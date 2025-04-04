const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Helper function to analyze server output for errors
function analyzeServerOutput(output) {
  let hasError = false;
  let errorMessage = null;
  let connectionStatus = false;
  let lastConnectionMessage = null;

  for (const item of output) {
    const data = item.data.toLowerCase();
    
    // checking some -> common error patterns
    if (data.includes('failed to fetch config') || 
        data.includes('fatal error') ||
        data.includes('server not found') ||
        data.includes('internal server error')) {
      hasError = true;
      // Extract the actual error message
      const errorMatch = item.data.match(/Error:([^\n]+)/);
      if (errorMatch) {
        errorMessage = errorMatch[1].trim();
      }
    }

    // checking connection status
    if (data.includes('websocket connection established')) {
      connectionStatus = true;
      lastConnectionMessage = 'WebSocket connection established';
    } else if (data.includes('connecting to websocket')) {
      lastConnectionMessage = 'Attempting to connect...';
    }

    // Specific error checks
    if (data.includes('server not found')) {
      hasError = true;
      errorMessage = 'Server package not found or invalid';
      connectionStatus = false;
    } else if (data.includes('internal server error')) {
      hasError = true;
      errorMessage = 'Server encountered an internal error';
      connectionStatus = false;
    }
  }

  return {
    hasError,
    errorMessage,
    connectionStatus,
    lastConnectionMessage
  };
}

// Parse and validate MCP configuration
function parseConfiguration(input) {
  try {
    if (!input || typeof input !== 'string') {
      throw new Error('Invalid input: Configuration must be a string');
    }

    // Check if input is a JSON object
    if (input.trim().startsWith('{')) {
      try {
        const config = JSON.parse(input);
        if (config.mcpServers) {
          // Validate the JSON structure
          const serverName = Object.keys(config.mcpServers)[0];
          const serverConfig = config.mcpServers[serverName];
          
          if (!serverConfig.command || !Array.isArray(serverConfig.args)) {
            throw new Error('Invalid server configuration: Must include command and args array');
          }

          // Validate required arguments for MCP server
          const hasCliArg = serverConfig.args.some(arg => arg.includes('@smithery/cli'));
          const hasKeyArg = serverConfig.args.includes('--key');
          const hasServerArg = serverConfig.args.some(arg => arg.includes('@') && !arg.includes('@smithery/cli'));

          if (!hasCliArg || !hasKeyArg || !hasServerArg) {
            throw new Error('Invalid MCP server configuration: Missing required arguments');
          }

          return {
            type: 'json',
            config,
            serverName,
            serverPackage: serverConfig.args.find(arg => arg.includes('@') && !arg.includes('@smithery/cli')),
            apiKey: serverConfig.args[serverConfig.args.indexOf('--key') + 1]
          };
        }
        throw new Error('Invalid JSON format: Missing mcpServers object');
      } catch (e) {
        throw new Error('Invalid JSON format: ' + e.message);
      }
    }
    // Check if input is an NPX command
    else if (input.includes('npx')) {
      const parts = input.split(' ').filter(p => p.trim().length > 0);
      
      // Validate basic NPX command structure
      if (!parts.includes('npx') || !parts.includes('@smithery/cli@latest')) {
        throw new Error('Invalid NPX command: Must use @smithery/cli');
      }

      // Find server package and key
      const serverIndex = parts.findIndex(p => p.includes('@') && !p.includes('@smithery/cli'));
      const keyIndex = parts.findIndex(p => p === '--key');
      const clientIndex = parts.findIndex(p => p === '--client');

      if (serverIndex === -1 || keyIndex === -1 || keyIndex + 1 >= parts.length) {
        throw new Error('Invalid NPX command: Missing server package or API key');
      }

      const serverPackage = parts[serverIndex];
      const apiKey = parts[keyIndex + 1];
      const client = clientIndex !== -1 && clientIndex + 1 < parts.length ? parts[clientIndex + 1] : undefined;

      // Extract server name from package
      const serverName = serverPackage.split('/').pop().replace(/-mcp-server$/, '');

      return {
        type: 'npx',
        config: {
          command: 'npx',
          args: [
            '-y',
            '@smithery/cli@latest',
            'run',
            serverPackage,
            '--key',
            apiKey,
            ...(client ? ['--client', client] : [])
          ],
          serverName,
          serverPackage,
          apiKey,
          client
        },
        serverName,
        serverPackage,
        apiKey
      };
    }
    throw new Error('Invalid configuration format: Must be either a JSON object or NPX command');
  } catch (error) {
    throw new Error(`Configuration parsing error: ${error.message}`);
  }
}

// Test MCP server endpoint
app.post('/api/test-mcp', async (req, res) => {
  try {
    const { config } = req.body;
    
    if (!config) {
      throw new Error('Configuration is required');
    }

    const parsedConfig = parseConfiguration(config);
    let testProcess;
    let output = [];
    let error = null;

    if (parsedConfig.type === 'json') {
      const serverConfig = parsedConfig.config.mcpServers[parsedConfig.serverName];
      testProcess = spawn(serverConfig.command, serverConfig.args, { shell: true });
    } else if (parsedConfig.type === 'npx') {
      testProcess = spawn(parsedConfig.config.command, parsedConfig.config.args, { shell: true });
    }

    testProcess.stdout.on('data', (data) => {
      output.push({
        type: 'stdout',
        data: data.toString()
      });
    });

    testProcess.stderr.on('data', (data) => {
      output.push({
        type: 'stderr',
        data: data.toString()
      });
    });

    testProcess.on('error', (err) => {
      error = err.message;
    });

    // Wait for process to complete or timeout after 30 seconds
    await new Promise((resolve) => {
      const timeout = setTimeout(() => {
        testProcess.kill();
        resolve();
      }, 30000);

      testProcess.on('close', (code) => {
        clearTimeout(timeout);
        resolve();
      });
    });

    if (error) {
      throw new Error(error);
    }

    // Analyze the output for errors and connection status
    const analysis = analyzeServerOutput(output);
    
    if (analysis.hasError) {
      res.status(400).json({
        success: false,
        error: analysis.errorMessage || 'Server connection failed',
        output: output,
        connectionStatus: analysis.connectionStatus,
        lastConnectionMessage: analysis.lastConnectionMessage
      });
      return;
    }

    res.json({
      success: true,
      configurationType: parsedConfig.type,
      serverName: parsedConfig.serverName,
      serverPackage: parsedConfig.serverPackage,
      connectionStatus: analysis.connectionStatus,
      lastConnectionMessage: analysis.lastConnectionMessage,
      output: output,
      serverDetails: parsedConfig.config
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});