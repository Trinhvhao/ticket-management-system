'use client';

import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { formatDateTime, formatDate, formatRelativeTime } from '@/lib/utils/format';

dayjs.extend(utc);
dayjs.extend(timezone);

const VIETNAM_TIMEZONE = 'Asia/Ho_Chi_Minh';

interface TimezoneCheckResult {
  serverInfo: {
    currentTime: string;
    currentTimeISO: string;
    currentTimeUTC: string;
    serverTimezone: string;
    nodeVersion: string;
    platform: string;
  };
  databaseInfo: {
    currentTimestamp: string;
    currentTimestampTZ: string;
    databaseTimezone: string;
    showTimezone: string;
  };
  columnTypes: {
    tableName: string;
    columnName: string;
    dataType: string;
    isTimestamptz: boolean;
  }[];
  sampleData: {
    tickets: {
      id: number;
      ticketNumber: string;
      createdAt: string;
      createdAtRaw: unknown;
      dueDate: string | null;
      dueDateRaw: unknown;
    }[];
    users: {
      id: number;
      email: string;
      createdAt: string;
      createdAtRaw: unknown;
    }[];
  };
  analysis: {
    issue: string;
    severity: 'OK' | 'WARNING' | 'CRITICAL';
    recommendation: string;
  }[];
}

export default function TimezoneDebugPage() {
  const [backendData, setBackendData] = useState<TimezoneCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<{
    jsTime: string;
    jsTimeISO: string;
    browserTimezone: string;
    dayjsLocal: string;
    dayjsUTC: string;
    dayjsVietnam: string;
  } | null>(null);

  // Frontend timezone tests
  useEffect(() => {
    const now = new Date();
    setTestResults({
      jsTime: now.toString(),
      jsTimeISO: now.toISOString(),
      browserTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      dayjsLocal: dayjs().format('DD/MM/YYYY HH:mm:ss'),
      dayjsUTC: dayjs.utc().format('DD/MM/YYYY HH:mm:ss'),
      dayjsVietnam: dayjs().tz(VIETNAM_TIMEZONE).format('DD/MM/YYYY HH:mm:ss'),
    });
  }, []);

  const fetchBackendData = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
      const response = await fetch(`${apiUrl}/debug/timezone/check`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setBackendData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const createTestTicket = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
      const response = await fetch(`${apiUrl}/debug/timezone/create-test`);
      const data = await response.json();
      alert(JSON.stringify(data, null, 2));
      await fetchBackendData(); // Refresh data
    } catch (err) {
      alert('Error: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const cleanupTestTickets = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
      const response = await fetch(`${apiUrl}/debug/timezone/cleanup-test`);
      const data = await response.json();
      alert(JSON.stringify(data, null, 2));
      await fetchBackendData();
    } catch (err) {
      alert('Error: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  // Test timezone conversion
  const testTimezoneConversion = (isoString: string) => {
    const date = new Date(isoString);
    return {
      input: isoString,
      jsDate: date.toString(),
      jsDateLocal: date.toLocaleString('vi-VN', { timeZone: VIETNAM_TIMEZONE }),
      dayjsNoTZ: dayjs(isoString).format('DD/MM/YYYY HH:mm:ss'),
      dayjsWithTZ: dayjs(isoString).tz(VIETNAM_TIMEZONE).format('DD/MM/YYYY HH:mm:ss'),
      formatDateTime: formatDateTime(isoString),
      formatDate: formatDate(isoString),
      formatRelative: formatRelativeTime(isoString),
    };
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">🕐 Timezone Debug Tool</h1>

        {/* Frontend Info */}
        <section className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">📱 Frontend (Browser) Info</h2>
          {testResults && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Browser Timezone:</strong>
                <code className="ml-2 bg-gray-100 px-2 py-1 rounded">{testResults.browserTimezone}</code>
              </div>
              <div>
                <strong>JS Date.toString():</strong>
                <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-xs">{testResults.jsTime}</code>
              </div>
              <div>
                <strong>JS Date.toISOString():</strong>
                <code className="ml-2 bg-gray-100 px-2 py-1 rounded">{testResults.jsTimeISO}</code>
              </div>
              <div>
                <strong>dayjs Local:</strong>
                <code className="ml-2 bg-gray-100 px-2 py-1 rounded">{testResults.dayjsLocal}</code>
              </div>
              <div>
                <strong>dayjs UTC:</strong>
                <code className="ml-2 bg-gray-100 px-2 py-1 rounded">{testResults.dayjsUTC}</code>
              </div>
              <div>
                <strong>dayjs Vietnam (Asia/Ho_Chi_Minh):</strong>
                <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-green-600 font-semibold">{testResults.dayjsVietnam}</code>
              </div>
            </div>
          )}
        </section>

        {/* Actions */}
        <section className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">🛠️ Actions</h2>
          <div className="flex gap-4">
            <button
              onClick={fetchBackendData}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Loading...' : '🔄 Fetch Backend Timezone Data'}
            </button>
            <button
              onClick={createTestTicket}
              disabled={loading}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              ➕ Create Test Ticket
            </button>
            <button
              onClick={cleanupTestTickets}
              disabled={loading}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
            >
              🗑️ Cleanup Test Tickets
            </button>
          </div>
          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
              <strong>Error:</strong> {error}
            </div>
          )}
        </section>

        {/* Backend Data */}
        {backendData && (
          <>
            {/* Server Info */}
            <section className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-green-600">🖥️ Backend Server Info</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>Server Timezone:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{backendData.serverInfo.serverTimezone}</code></div>
                <div><strong>Node Version:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{backendData.serverInfo.nodeVersion}</code></div>
                <div><strong>Current Time:</strong> <code className="bg-gray-100 px-2 py-1 rounded text-xs">{backendData.serverInfo.currentTime}</code></div>
                <div><strong>Current ISO Time:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{backendData.serverInfo.currentTimeISO}</code></div>
              </div>
            </section>

            {/* Database Info */}
            <section className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-purple-600">🗄️ Database Info</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>DB Timezone:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{backendData.databaseInfo.databaseTimezone}</code></div>
                <div><strong>CURRENT_TIMESTAMP:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{backendData.databaseInfo.currentTimestamp}</code></div>
                <div><strong>NOW() with TZ:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{backendData.databaseInfo.showTimezone}</code></div>
              </div>
            </section>

            {/* Analysis */}
            <section className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-orange-600">🔍 Analysis</h2>
              <div className="space-y-4">
                {backendData.analysis.map((item, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded border-l-4 ${
                      item.severity === 'CRITICAL'
                        ? 'bg-red-50 border-red-500'
                        : item.severity === 'WARNING'
                        ? 'bg-yellow-50 border-yellow-500'
                        : 'bg-green-50 border-green-500'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        item.severity === 'CRITICAL'
                          ? 'bg-red-500 text-white'
                          : item.severity === 'WARNING'
                          ? 'bg-yellow-500 text-white'
                          : 'bg-green-500 text-white'
                      }`}>
                        {item.severity}
                      </span>
                      <span className="font-medium">{item.issue}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">💡 {item.recommendation}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Column Types */}
            <section className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-indigo-600">📋 Timestamp Column Types</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left">Table</th>
                      <th className="px-4 py-2 text-left">Column</th>
                      <th className="px-4 py-2 text-left">Data Type</th>
                      <th className="px-4 py-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {backendData.columnTypes.map((col, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-2">{col.tableName}</td>
                        <td className="px-4 py-2"><code>{col.columnName}</code></td>
                        <td className="px-4 py-2"><code>{col.dataType}</code></td>
                        <td className="px-4 py-2">
                          {col.isTimestamptz ? (
                            <span className="text-green-600 font-bold">✅ OK</span>
                          ) : col.dataType.includes('timestamp') ? (
                            <span className="text-red-600 font-bold">❌ NEEDS FIX</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Sample Tickets */}
            <section className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-teal-600">🎫 Sample Tickets (Timezone Conversion Test)</h2>
              <div className="space-y-4">
                {backendData.sampleData.tickets.map((ticket) => {
                  const conversion = testTimezoneConversion(ticket.createdAt);
                  const dueDateConversion = ticket.dueDate ? testTimezoneConversion(ticket.dueDate) : null;
                  
                  return (
                    <div key={ticket.id} className="border rounded p-4">
                      <div className="font-bold text-lg mb-2">{ticket.ticketNumber}</div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-2">Created At:</h4>
                          <ul className="space-y-1">
                            <li><strong>Raw from DB:</strong> <code className="bg-gray-100 px-1">{String(ticket.createdAtRaw)}</code></li>
                            <li><strong>ISO String:</strong> <code className="bg-gray-100 px-1">{ticket.createdAt}</code></li>
                            <li><strong>formatDateTime():</strong> <code className="bg-green-100 px-1 text-green-700 font-bold">{conversion.formatDateTime}</code></li>
                            <li><strong>formatRelativeTime():</strong> <code className="bg-gray-100 px-1">{conversion.formatRelative}</code></li>
                          </ul>
                        </div>
                        
                        {dueDateConversion && (
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-2">Due Date:</h4>
                            <ul className="space-y-1">
                              <li><strong>Raw from DB:</strong> <code className="bg-gray-100 px-1">{String(ticket.dueDateRaw)}</code></li>
                              <li><strong>ISO String:</strong> <code className="bg-gray-100 px-1">{ticket.dueDate}</code></li>
                              <li><strong>formatDateTime():</strong> <code className="bg-green-100 px-1 text-green-700 font-bold">{dueDateConversion.formatDateTime}</code></li>
                              <li><strong>Diff from created:</strong> <code className="bg-blue-100 px-1">{
                                ((new Date(ticket.dueDate!).getTime() - new Date(ticket.createdAt).getTime()) / (1000 * 60 * 60)).toFixed(1)
                              } hours</code></li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}

        {/* Manual Test Input */}
        <section className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-600">🧪 Manual Timezone Test</h2>
          <TimezoneManualTest />
        </section>
      </div>
    </div>
  );
}

function TimezoneManualTest() {
  const [input, setInput] = useState('2026-02-02T06:32:06.121Z');
  const [result, setResult] = useState<Record<string, string> | null>(null);

  const runTest = () => {
    try {
      const date = new Date(input);
      setResult({
        'Input': input,
        'JS Date.toString()': date.toString(),
        'JS toLocaleString (VN)': date.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
        'dayjs (no TZ)': dayjs(input).format('DD/MM/YYYY HH:mm:ss'),
        'dayjs.utc()': dayjs.utc(input).format('DD/MM/YYYY HH:mm:ss'),
        'dayjs.tz(VN)': dayjs(input).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm:ss'),
        'formatDateTime()': formatDateTime(input),
        'formatDate()': formatDate(input),
        'formatRelativeTime()': formatRelativeTime(input),
      });
    } catch (err) {
      setResult({ error: err instanceof Error ? err.message : 'Invalid date' });
    }
  };

  return (
    <div>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
          placeholder="Enter ISO date string (e.g., 2026-02-02T06:32:06.121Z)"
        />
        <button
          onClick={runTest}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Test
        </button>
      </div>
      {result && (
        <div className="bg-gray-50 rounded p-4">
          <table className="w-full text-sm">
            <tbody>
              {Object.entries(result).map(([key, value]) => (
                <tr key={key}>
                  <td className="font-semibold pr-4 py-1">{key}:</td>
                  <td><code className="bg-white px-2 py-1 rounded">{value}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
