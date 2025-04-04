import { useState } from 'react';
import axios from 'axios';

const jsonExample = `{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": [
        "-y",
        "@smithery/cli@latest",
        "run",
        "@your-org/your-mcp-server",
        "--key",
        "your-key-here"
      ]
    }
  }
}`;

const npxExample = `npx -y @smithery/cli@latest install @your-org/your-mcp-server --client claude --key your-key-here`;

function App() {
  const [config, setConfig] = useState('');
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [showExamples, setShowExamples] = useState(false);

  const testMcpServer = async () => {
    setTesting(true);
    setError(null);
    setResults(null);

    try {
      const response = await axios.post('http://localhost:5000/api/test-mcp', {
        config
      });
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      setResults(err.response?.data);
    }

    setTesting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <svg className="w-8 h-8 mr-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            MCP Server Tester
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
            </svg>
            Configuration
          </h2>
          
          <div className="space-y-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <button
                onClick={() => setShowExamples(prev => !prev)}
                className="flex items-center justify-between w-full text-left"
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium text-gray-900">View Example Configurations</span>
                </div>
                <svg className={`w-5 h-5 text-gray-500 transform transition-transform ${showExamples ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Examples Section */}
              {showExamples && (
                <div className="mt-4 space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-1.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      JSON Format:
                      <button
                        onClick={() => setConfig(jsonExample)}
                        className="ml-2 px-2 py-1 text-xs text-indigo-600 hover:text-indigo-800 hover:underline flex items-center"
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy to Input
                      </button>
                    </h4>
                    <div className="bg-white rounded border border-gray-200 p-3">
                      <pre className="text-xs text-gray-800 font-mono whitespace-pre-wrap">{jsonExample}</pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-1.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      NPX Command Format:
                      <button
                        onClick={() => setConfig(npxExample)}
                        className="ml-2 px-2 py-1 text-xs text-indigo-600 hover:text-indigo-800 hover:underline flex items-center"
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy to Input
                      </button>
                    </h4>
                    <div className="bg-white rounded border border-gray-200 p-3">
                      <pre className="text-xs text-gray-800 font-mono whitespace-pre-wrap">{npxExample}</pre>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mt-2 flex items-center">
                    <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Replace @your-org/your-mcp-server with your actual server package and your-key-here with your API key
                  </div>
                </div>
              )}
            </div>

            <textarea
              value={config}
              onChange={(e) => setConfig(e.target.value)}
              placeholder="Enter MCP server configuration (JSON or NPX command)"
              className="w-full h-32 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none font-mono text-sm"
            />
            
            <button
              onClick={testMcpServer}
              disabled={testing || !config.trim()}
              className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                ${testing || !config.trim() ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              {testing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Testing Server... (at least 30s)
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Test Server
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-lg">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-red-800 font-medium">Error Occurred</h3>
            </div>
            <p className="mt-2 text-red-700">{error}</p>
          </div>
        )}

        {results && (
          <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Test Results
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Configuration Type</h3>
                    <p className="mt-1 text-sm text-gray-900">{results.configurationType}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Server Package</h3>
                    <p className="mt-1 text-sm font-mono text-gray-900">{results.serverPackage}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Overall Status</h3>
                    <div className={`mt-1 flex items-center ${results.success ? 'text-green-600' : 'text-red-600'}`}>
                      <svg className="h-5 w-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d={results.success 
                            ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            : "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"} />
                      </svg>
                      <span className="font-medium">
                        {results.success ? 'Connected Successfully' : 'Connection Failed'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">WebSocket Status</h3>
                    <div className={`mt-1 ${results.connectionStatus ? 'text-green-600' : 'text-red-600'}`}>
                      <div className="flex items-center">
                        <svg className="h-5 w-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d={results.connectionStatus 
                              ? "M5 13l4 4L19 7"
                              : "M6 18L18 6M6 6l12 12"} />
                        </svg>
                        <span className="font-medium">
                          {results.connectionStatus ? 'WebSocket Connected' : 'WebSocket Connection Failed'}
                        </span>
                      </div>
                      {results.lastConnectionMessage && (
                        <p className="mt-1 text-sm text-gray-500">
                          Last status: {results.lastConnectionMessage}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {results.output && results.output.length > 0 && (
              <div className="p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Server Output</h3>
                <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-x-auto">
                  <div className="p-4 space-y-2 font-mono text-sm">
                    {results.output.map((out, index) => (
                      <pre key={index} className={`${out.type === 'stderr' ? 'text-red-600' : 'text-gray-800'} whitespace-pre-wrap`}>
                        {out.data}
                      </pre>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
