'use client';

import { useState, useEffect } from 'react';
import { authLogger } from '@/lib/utils/auth-logger';

export function AuthDebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'error' | 'warn' | 'info'>('all');

  useEffect(() => {
    if (isOpen) {
      const allLogs = authLogger.getLogs();
      setLogs(allLogs);
    }
  }, [isOpen]);

  const refreshLogs = () => {
    const allLogs = authLogger.getLogs();
    setLogs(allLogs);
  };

  const filteredLogs = logs.filter((log) => {
    if (filter === 'all') return true;
    return log.level === filter;
  });

  const getTokenInfo = () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!accessToken || !refreshToken) {
      return { status: 'No tokens', color: 'text-red-500' };
    }

    try {
      const decodeToken = (token: string) => {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        return JSON.parse(jsonPayload);
      };

      const accessPayload = decodeToken(accessToken);
      const now = Math.floor(Date.now() / 1000);
      const timeLeft = accessPayload.exp - now;

      if (timeLeft < 0) {
        return { status: 'Access token expired', color: 'text-red-500', timeLeft };
      } else if (timeLeft < 300) {
        return { status: `Expires in ${Math.floor(timeLeft / 60)}m`, color: 'text-orange-500', timeLeft };
      } else {
        return { status: `Valid for ${Math.floor(timeLeft / 60)}m`, color: 'text-green-500', timeLeft };
      }
    } catch (e) {
      return { status: 'Invalid token', color: 'text-red-500' };
    }
  };

  const tokenInfo = getTokenInfo();

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-3 shadow-lg"
        title="Auth Debug Panel"
      >
        🔍
      </button>

      {/* Debug panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-96 max-h-[600px] bg-white border border-gray-300 rounded-lg shadow-2xl flex flex-col">
          {/* Header */}
          <div className="bg-purple-600 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
            <div>
              <h3 className="font-bold">Auth Debug Panel</h3>
              <p className="text-xs opacity-90">Development Mode Only</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          {/* Token status */}
          <div className="px-4 py-3 bg-gray-50 border-b">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Token Status:</span>
              <span className={`text-sm font-bold ${tokenInfo.color}`}>
                {tokenInfo.status}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="px-4 py-2 border-b flex gap-2">
            <button
              onClick={refreshLogs}
              className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Refresh
            </button>
            <button
              onClick={() => authLogger.exportLogs()}
              className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
            >
              Export
            </button>
            <button
              onClick={() => {
                authLogger.clearLogs();
                setLogs([]);
              }}
              className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
            >
              Clear
            </button>
          </div>

          {/* Filter */}
          <div className="px-4 py-2 border-b flex gap-2">
            {['all', 'error', 'warn', 'info'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-3 py-1 text-xs rounded ${
                  filter === f
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Logs */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 text-xs font-mono">
            {filteredLogs.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No logs</p>
            ) : (
              filteredLogs.reverse().map((log, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded border-l-4 ${
                    log.level === 'error'
                      ? 'bg-red-50 border-red-500'
                      : log.level === 'warn'
                      ? 'bg-orange-50 border-orange-500'
                      : log.level === 'info'
                      ? 'bg-blue-50 border-blue-500'
                      : 'bg-gray-50 border-gray-500'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-gray-700">
                      [{log.category}]
                    </span>
                    <span className="text-gray-500 text-[10px]">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-gray-800">{log.message}</div>
                  {log.data && (
                    <details className="mt-1">
                      <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                        Data
                      </summary>
                      <pre className="mt-1 p-2 bg-white rounded text-[10px] overflow-x-auto">
                        {JSON.stringify(log.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}
