import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [page, setPage] = useState<'login' | 'register' | 'dashboard'>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const handleRegisterSuccess = (name: string) => {
    setUsername(name);
    setIsLoggedIn(true);
    setPage('dashboard');
  };

  const handleLoginSuccess = (name: string) => {
    setUsername(name);
    setIsLoggedIn(true);
    setPage('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPage('login');
  };

  return (
    <div className="h-full flex flex-col bg-gray-100 pt-2">
      <h1 className="text-xl font-semibold text-center text-gray-700 py-3 bg-white shadow-md flex-shrink-0">听声无恙</h1>
      
      <div className="flex-grow overflow-y-auto p-4">
        {!isLoggedIn ? (
          <>
            <div className="flex border-b border-gray-300 mb-4 flex-shrink-0">
              <button
                className={`flex-1 py-2 text-center text-sm font-medium ${page === 'login' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                onClick={() => setPage('login')}
              >
                登录
              </button>
              <button
                className={`flex-1 py-2 text-center text-sm font-medium ${page === 'register' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                onClick={() => setPage('register')}
              >
                注册
              </button>
            </div>
            
            <div className="mt-4">
              {page === 'login' ? (
                <Login onLoginSuccess={handleLoginSuccess} />
              ) : (
                <Register onRegisterSuccess={handleRegisterSuccess} />
              )}
            </div>
          </>
        ) : (
          <Dashboard username={username} onLogout={handleLogout} />
        )}
      </div>
    </div>
  );
}

export default App; 