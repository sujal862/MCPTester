import { useState } from 'react'
import './App.css'

function App() {
  const [config, setConfig] = useState('');
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleTest = async () => {
    try {
      setTesting(true);
      setError(null);
      setResults(null);

      const response = await fetch('http://localhost:5000/api/test-mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Testing failed');
      }

      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setTesting(false);
    }
  };

  const jsonExample = `{
  "mcpServers": {
    "server-sequential-thinking": {
      "command": "cmd",
      "args": [
        "/c",
        "npx",
        "-y",
        "@smithery/cli@latest",
        "run",
        "@smithery-ai/server-sequential-thinking",
        "--key",
        "your-key-here"
      ]
    }
  }
}`;

  const npxExample = `npx -y @smithery/cli@latest install @smithery-ai/server-sequential-thinking --client claude --key your-key-here`;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">MCP Server Tester</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              MCP Configuration:
            </label>
            <textarea
              className="w-full h-48 p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={config}
              onChange={(e) => setConfig(e.target.value)}
              placeholder="Paste your MCP server configuration here (JSON or NPX command format)"
            />
          </div>

          <button
            className={`px-4 py-2 rounded-md text-white font-medium ${
              testing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            onClick={handleTest}
            disabled={testing || !config.trim()}
          >
            {testing ? 'Testing...' : 'Test MCP Server'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <h3 className="text-red-800 font-medium">Error:</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {results && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Test Results</h2>
            
            <div className="mb-4">
              <h3 className="font-medium text-gray-700">Configuration Type:</h3>
              <p className="text-gray-600">{results.configurationType}</p>
            </div>

            <div className="mb-4">
              <h3 className="font-medium text-gray-700">Status:</h3>
              <div className={results.success ? 'text-green-600' : 'text-red-600'}>
                {results.success ? '✓ Connected Successfully' : '✗ Connection Failed'}
              </div>
            </div>

            {results.output && (
              <div className="mb-4">
                <h3 className="font-medium text-gray-700 mb-2">Output:</h3>
                <div className="bg-gray-50 rounded-md p-4 overflow-x-auto">
                  {results.output.map((out, index) => (
                    <pre key={index} className={out.type === 'stderr' ? 'text-red-600' : 'text-gray-800'}>
                      {out.data}
                    </pre>
                  ))}
                </div>
              </div>
            )}

            {results.serverDetails && (
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Server Details:</h3>
                <div className="bg-gray-50 rounded-md p-4 overflow-x-auto">
                  <pre className="text-gray-800">
                    {JSON.stringify(results.serverDetails, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Configuration Examples</h2>
          
          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-2">JSON Configuration:</h3>
            <div className="bg-gray-50 rounded-md p-4 overflow-x-auto">
              <pre className="text-gray-800">{jsonExample}</pre>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-700 mb-2">NPX Command:</h3>
            <div className="bg-gray-50 rounded-md p-4 overflow-x-auto">
              <pre className="text-gray-800">{npxExample}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App
