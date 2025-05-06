from flask import Flask, request, jsonify, abort
from werkzeug.utils import secure_filename
import os

# (假设这些模块存在于 backend 目录或已安装)
from . import voice_processor
from . import antispoofing_detector
from . import speaker_verifier
from . import database
from .config import UPLOAD_FOLDER, ALLOWED_EXTENSIONS, IFLYTEK_APP_ID # 假设配置

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['IFLYTEK_APP_ID'] = IFLYTEK_APP_ID # 示例：加载讯飞配置

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return "听声无恙 后端服务运行中"

@app.route('/api/v1/register', methods=['POST'])
def register_voice():
    """接收用户注册语音, 进行检测并注册声纹"""
    if 'file' not in request.files or 'user_id' not in request.form:
        return jsonify({"error": "Missing file or user_id"}), 400
    
    file = request.files['file']
    user_id = request.form['user_id']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
        
    if file and allowed_file(file.filename):
        filename = secure_filename(f"{user_id}_register_{file.filename}")
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        try:
            file.save(filepath)

            # 1. 伪装语音检测
            is_real, spoof_confidence = antispoofing_detector.detect_spoof(filepath)
            if not is_real:
                 os.remove(filepath) # 清理上传的伪造语音
                 return jsonify({"error": "Spoofed speech detected", "confidence": spoof_confidence}), 403

            # 2. 提取声纹特征 (模拟)
            embedding = voice_processor.extract_speaker_embedding(filepath)
            if embedding is None:
                os.remove(filepath)
                return jsonify({"error": "Failed to extract voice features"}), 500

            # 3. 调用讯飞 SDK 或数据库保存声纹 (模拟)
            registration_success = speaker_verifier.register_speaker(user_id, embedding, app.config['IFLYTEK_APP_ID'])
            if not registration_success:
                 os.remove(filepath)
                 return jsonify({"error": "Speaker registration failed"}), 500

            # 4. (可选) 保存用户和文件信息到数据库
            database.save_user_registration(user_id, filepath, embedding.tolist())
            
            # os.remove(filepath) # 注册成功后是否保留原始文件？
            
            return jsonify({"message": "User registered successfully", "user_id": user_id}), 201

        except Exception as e:
            print(f"Error processing registration for {user_id}: {e}")
            if os.path.exists(filepath):
                try: os.remove(filepath) 
                except OSError: pass
            return jsonify({"error": "Internal server error during registration"}), 500
    else:
        return jsonify({"error": "File type not allowed"}), 400

@app.route('/api/v1/login', methods=['POST'])
def login_voice():
    """接收用户登录语音, 进行检测和验证"""
    if 'file' not in request.files or 'user_id' not in request.form:
        return jsonify({"error": "Missing file or user_id"}), 400

    file = request.files['file']
    user_id = request.form['user_id']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(f"{user_id}_login_{file.filename}")
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        try:
            file.save(filepath)

            # 1. 伪装语音检测
            is_real, spoof_confidence = antispoofing_detector.detect_spoof(filepath)
            if not is_real:
                os.remove(filepath)
                return jsonify({"error": "Spoofed speech detected", "result": "fail", "reason": "spoof", "confidence": spoof_confidence}), 403

            # 2. 提取声纹特征
            embedding = voice_processor.extract_speaker_embedding(filepath)
            if embedding is None:
                os.remove(filepath)
                return jsonify({"error": "Failed to extract voice features"}), 500

            # 3. 调用讯飞 SDK 或数据库进行声纹比对 (模拟)
            verification_passed, score = speaker_verifier.verify_speaker(user_id, embedding, app.config['IFLYTEK_APP_ID'])
            
            os.remove(filepath) # 登录尝试后通常删除临时文件

            if verification_passed:
                return jsonify({"message": "Login successful", "result": "pass", "user_id": user_id, "score": score}), 200
            else:
                return jsonify({"error": "Speaker verification failed", "result": "fail", "reason": "mismatch", "score": score}), 401

        except Exception as e:
            print(f"Error processing login for {user_id}: {e}")
            if os.path.exists(filepath):
                 try: os.remove(filepath) 
                 except OSError: pass
            return jsonify({"error": "Internal server error during login"}), 500
    else:
        return jsonify({"error": "File type not allowed"}), 400


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001) # 使用不同端口以防与 STA 冲突 