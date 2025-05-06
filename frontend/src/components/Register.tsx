import React, { useState, useRef, useEffect } from 'react';

interface RegisterProps {
  onRegisterSuccess: (username: string) => void;
}

const TOTAL_RECORDINGS = 3; // 总共需要录制的段数

const Register: React.FC<RegisterProps> = ({ onRegisterSuccess }) => {
  const [username, setUsername] = useState('');
  const [randomDigits, setRandomDigits] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollmentProgress, setEnrollmentProgress] = useState(0);
  const [recordingsDone, setRecordingsDone] = useState(0); // 已完成录音段数
  const [transientMessage, setTransientMessage] = useState<string | null>(null); // 临时消息
  const timerRef = useRef<number | null>(null);
  const progressRef = useRef<number | null>(null);
  const messageTimerRef = useRef<number | null>(null);

  // 清理状态的副作用
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    };
  }, []);

  const showTemporaryMessage = (message: string, duration: number = 1500) => {
      setTransientMessage(message);
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
      messageTimerRef.current = window.setTimeout(() => {
          setTransientMessage(null);
      }, duration);
  }

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
    setTransientMessage(null); // 清除临时消息
    setRandomDigits(generateRandomDigits());
    setIsRecording(true);
    setRecordingTime(0);
    // isEnrolling 和 enrollmentProgress 在最后一段完成后设置

    timerRef.current = window.setInterval(() => {
       setRecordingTime(prev => {
        if (prev >= 5) { // 假设每段最多录5秒
           handleStop();
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
    const currentRecordingsDone = recordingsDone + 1;
    setRecordingsDone(currentRecordingsDone);

    if (currentRecordingsDone < TOTAL_RECORDINGS) {
        // 还未完成所有录音
        showTemporaryMessage(`第 ${currentRecordingsDone} 段录音完成!`);
        setRandomDigits(''); // 清除数字，等待下一次开始
    } else {
        // 所有录音完成，开始处理注册
        setIsEnrolling(true);
        setEnrollmentProgress(0);

        progressRef.current = window.setInterval(() => {
          setEnrollmentProgress(prev => {
            const nextProgress = prev + 20;
            if (nextProgress >= 100) {
              if (progressRef.current) {
                clearInterval(progressRef.current);
                progressRef.current = null;
              }
              setTimeout(() => {
                setIsEnrolling(false);
                // 不再显示 alert
                onRegisterSuccess(username);
              }, 300);
              return 100;
            }
            return nextProgress;
          });
        }, 300);
    }
  };

  const isRegistrationComplete = recordingsDone >= TOTAL_RECORDINGS;

  return (
    <div className="space-y-6 p-2">
      {/* 用户名输入框 (仅在开始前可编辑) */}
      <div className="relative">
        <input
          id="reg-username"
          type="text"
          className="block w-full px-2.5 pb-2.5 pt-4 text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer disabled:text-gray-500 disabled:border-gray-200"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isRecording || isEnrolling || recordingsDone > 0}
          placeholder=" "
        />
        <label 
           htmlFor="reg-username"
           className={`absolute text-sm ${recordingsDone > 0 ? 'text-gray-400' : 'text-gray-500'} duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-gray-100 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}
         >用户名</label>
      </div>
      
      {/* 注册进度或操作区域 */}
      {!isEnrolling && !isRegistrationComplete && (
        <>
          {/* 数字显示区域 */}
          {randomDigits && (
            <div className="p-4 bg-blue-50 rounded-lg text-center border border-blue-200">
              <p className="text-sm font-medium text-blue-800">
                  请朗读以下数字 (第 {recordingsDone + 1}/{TOTAL_RECORDINGS} 段):
              </p>
              <p className="text-3xl font-bold tracking-wider my-2 text-blue-900">{randomDigits}</p>
            </div>
          )}
          
          {/* 录音状态 */}
          {isRecording && (
             <div className="text-center text-sm text-red-600">
                录音中... {recordingTime} / 5 秒
             </div>
          )}

          {/* 临时消息 */} 
          {transientMessage && (
             <div className="p-2 bg-green-100 text-green-700 rounded-lg text-center text-sm">
                 {transientMessage}
             </div>
          )}
          
          {/* 操作按钮 */}
          <div className="pt-2">
            {!isRecording ? (
              <button
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:shadow-none font-medium uppercase tracking-wider text-sm"
                onClick={handleStart}
                // 只有在非录音/非注册中，且用户名非空时才可点击
                disabled={isRecording || isEnrolling || !username || transientMessage !== null}
              >
                开始录制第 {recordingsDone + 1} 段
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
        </>
      )}

      {/* 最终注册处理进度条 */}
      {isEnrolling && (
        <>
          <div className="space-y-2 pt-4">
            <p className="text-center font-medium text-gray-700 text-sm">所有录音完成，正在处理注册...</p>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300 ease-linear" 
                style={{ width: `${enrollmentProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 text-center">{enrollmentProgress}%</p>
          </div>
        </>
      )}
    </div>
  );
};

export default Register; 