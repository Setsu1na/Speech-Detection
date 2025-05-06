import React, { useState, useEffect } from 'react';
import './StatusBar.css'; // 引入样式

const StatusBar: React.FC = () => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };

    updateTime(); // 初始化时间
    const timerId = setInterval(updateTime, 60000); // 每分钟更新一次

    return () => clearInterval(timerId); // 清理定时器
  }, []);

  return (
    <div className="status-bar">
      <div className="status-bar-left">
        <span>{currentTime}</span>
      </div>
      <div className="status-bar-right">
        {/* 这里用文字模拟图标，也可以替换为SVG图标 */}
        <span className="icon wifi-icon">📶</span> {/* Wi-Fi 图标 */} 
        <span className="icon signal-icon">📊</span> {/* 信号图标 - 暂用柱状图代替 */}
        <span className="icon battery-icon">🔋</span> {/* 电池图标 */} 
        <span className="battery-level">85%</span>
      </div>
    </div>
  );
};

export default StatusBar; 