import numpy as np
import random
from . import database # 用于获取已注册用户的 embedding

# 模拟讯飞 SDK 或类似服务的交互
def register_speaker(user_id, embedding, app_id):
    """模拟向讯飞平台或数据库注册用户声纹"""
    print(f"Simulating registration for user {user_id} with iFlytek AppID {app_id}")
    # 实际可能调用: iflytek_sdk.register(user_id, embedding_data)
    # 或者直接保存到我们自己的数据库
    success = database.register_embedding(user_id, embedding.tolist())
    return success

def verify_speaker(user_id, current_embedding, app_id):
    """模拟向讯飞平台或使用数据库进行 1:1 声纹验证"""
    print(f"Simulating verification for user {user_id} with iFlytek AppID {app_id}")
    # 实际可能调用: result = iflytek_sdk.verify(user_id, current_embedding_data)
    # verification_passed = result['passed']
    # score = result['score']

    # 模拟基于数据库的比对
    registered_embedding = database.get_user_embedding(user_id)
    if registered_embedding is None:
        print(f"User {user_id} not found in DB for verification.")
        return False, 0.0

    # 计算余弦相似度
    registered_embedding = np.array(registered_embedding)
    # 确保都是单位向量 (voice_processor 中已做，这里再次确保)
    registered_embedding /= np.linalg.norm(registered_embedding)
    current_embedding /= np.linalg.norm(current_embedding)
    
    cosine_similarity = np.dot(registered_embedding, current_embedding)
    score = max(0.0, min(1.0, cosine_similarity)) # 限制在 0-1

    threshold = 0.7 # 假设相似度阈值
    verification_passed = score >= threshold

    print(f"Verification Result for {user_id}: {'Passed' if verification_passed else 'Failed'} (Score: {score:.4f})")
    return verification_passed, float(f"{score:.4f}") 