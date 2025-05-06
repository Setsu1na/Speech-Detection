import React, { useState, useRef, useEffect } from 'react';

interface LoginProps {
  onLoginSuccess: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [randomDigits, setRandomDigits] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [verificationResult, setVerificationResult] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [loginAttemptCount, setLoginAttemptCount] = useState(0); // 追踪登录次数
  const timerRef = useRef<number | null>(null);

  // 清理状态的副作用
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const generateRandomDigits = () => {
    let digits = '';
    for (let i = 0; i < 8; i++) {
      digits += Math.floor(Math.random() * 10);
    }
    return digits;
  };

  const handleStart = () => {
    if (!username) {
      alert('请输入用户名');
      return;
    }
    setRandomDigits(generateRandomDigits());
    setIsRecording(true);
    setRecordingTime(0);
    setVerificationResult(null); // 清除上次结果
    setLoginAttemptCount(prev => prev + 1); // 增加尝试次数

    timerRef.current = window.setInterval(() => {
      setRecordingTime(prev => {
        // 简单模拟录音时长，比如最多5秒
        if (prev >= 5) {
           handleStop(); // 自动停止
           return 5;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const handleStop = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRecording(false);
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      const currentAttempt = loginAttemptCount % 3;

      if (currentAttempt === 1) { // 第一次尝试
        setVerificationResult('fail');
      } else if (currentAttempt === 2) { // 第二次尝试
        setVerificationResult('fake');
      } else { // 第三次尝试 (currentAttempt === 0)
        setVerificationResult('success');
        setTimeout(() => onLoginSuccess(username), 1000); // 登录成功跳转
      }
    }, 1500); // 模拟验证耗时
  };

  return (
    <div className="space-y-6 p-2">
      {/* Android 风格输入框 */}
      <div className="relative">
        <input
          id="username"
          type="text"
          className="block w-full px-2.5 pb-2.5 pt-4 text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isRecording || isVerifying}
          placeholder=" " // 需要 placeholder 来配合 label 动画
        />
        <label 
           htmlFor="username"
           className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-gray-100 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
         >用户名</label>
      </div>
      
      {randomDigits && (
        <div className="p-4 bg-blue-50 rounded-lg text-center border border-blue-200">
          <p className="text-sm font-medium text-blue-800">请朗读以下数字进行验证：</p>
          <p className="text-3xl font-bold tracking-wider my-2 text-blue-900">{randomDigits}</p>
        </div>
      )}
      
      {isRecording && (
        <div className="text-center text-sm text-red-600">
            录音中... {recordingTime} / 5 秒
        </div>
      )}
      {isVerifying && (
        <div className="text-center text-sm text-yellow-600">
            声纹验证中...
        </div>
      )}
      
      {verificationResult === 'success' && (
        <div className="p-3 bg-green-100 text-green-700 rounded-lg text-center text-sm">
          ✅ 声纹验证成功，登录中...
        </div>
      )}
      {verificationResult === 'fail' && (
        <div className="p-3 bg-red-100 text-red-700 rounded-lg text-center text-sm">
          ❌ 登录失败：非本人声音！
        </div>
      )}
      {verificationResult === 'fake' && (
        <div className="p-3 bg-orange-100 text-orange-700 rounded-lg text-center text-sm">
          ⚠️ 检测到伪装语音！
        </div>
      )}
      
      {/* Android 风格按钮 */}
      <div className="pt-2">
        {!isRecording ? (
          <button
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:shadow-none font-medium uppercase tracking-wider text-sm"
            onClick={handleStart}
            disabled={isVerifying || !username}
          >
            开始录音验证
          </button>
        ) : (
          <button
            className="w-full py-3 px-4 bg-red-600 text-white rounded-md shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 font-medium uppercase tracking-wider text-sm"
            onClick={handleStop}
          >
            停止录音
          </button>
        )}
      </div>
    </div>
  );
};

export default Login; 