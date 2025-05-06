import React from 'react';
import './PhoneFrame.css'; // 我们将在这里添加样式
import StatusBar from './StatusBar'; // 导入状态栏组件

interface PhoneFrameProps {
  children: React.ReactNode;
}

const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  return (
    <div className="outer-frame">
      <div className="inner-frame">
        <div className="screen">
          <StatusBar /> {/* 添加状态栏 */}
          <div className="content-area"> {/* 创建一个新的div包裹App */}
            {children} {/* App组件现在在这里 */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneFrame; 