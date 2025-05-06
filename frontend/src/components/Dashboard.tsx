import React from 'react';

interface DashboardProps {
  username: string;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ username, onLogout }) => {
  return (
    <div className="p-4 space-y-6">
      {/* 顶部欢迎区域 */}
      <div className="text-center py-6 bg-gradient-to-b from-blue-50 to-gray-100 rounded-lg border border-gray-200">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white text-2xl font-bold mb-3 shadow">
          {username.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-lg font-semibold text-gray-800">欢迎, {username}!</h2>
        <p className="text-sm text-gray-600">您已通过声纹验证成功登录</p>
      </div>
      
      {/* 状态卡片 */}
      <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 p-2 bg-green-100 rounded-full">
            {/* 使用更明确的 Check 图标 (模拟) */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-800">声纹识别状态</h3>
            <p className="text-xs text-gray-600">验证通过</p>
          </div>
        </div>
      </div>
      
      {/* 安全等级和抗伪造能力 */}
      <div className="grid grid-cols-1 gap-4">
        {/* 安全等级 */}
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 space-y-2">
          <h3 className="text-sm font-medium">声纹安全等级</h3>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '85%' }}></div>
          </div>
          <p className="text-xs text-gray-500 text-right">85%</p>
        </div>
        
        {/* 抗伪造能力 */}
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 space-y-2">
          <h3 className="text-sm font-medium">抗伪造能力</h3>
           <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '92%' }}></div>
            </div>
            <p className="text-xs text-gray-500 text-right">92%</p>
        </div>
      </div>
      
      {/* 退出按钮 */}
      <div className="pt-4">
        <button
          onClick={onLogout}
          className="w-full py-3 px-4 bg-gray-700 text-white rounded-md shadow hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium uppercase tracking-wider text-sm"
        >
          退出登录
        </button>
      </div>
    </div>
  );
};

export default Dashboard; 