const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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
          return {
            type: 'json',
            config
          };
        }
      } catch (e) {
        throw new Error('Invalid JSON format: ' + e.message);
      }
    }
    // Check if input is an NPX command
    else if (input.includes('npx') && input.includes('@smithery/cli')) {
      const parts = input.split(' ').filter(p => p.trim().length > 0);
      const serverIndex = parts.findIndex(p => p.includes('@smithery-ai/'));
      const keyIndex = parts.findIndex(p => p === '--key');
      const clientIndex = parts.findIndex(p => p === '--client');

      if (serverIndex !== -1 && keyIndex !== -1 && keyIndex + 1 < parts.length) {
        return {
          type: 'npx',
          config: {
            command: parts[0] === 'npx' ? parts[0] : 'npx',
            serverName: parts[serverIndex],
            key: parts[keyIndex + 1],
            client: clientIndex !== -1 && clientIndex + 1 < parts.length ? parts[clientIndex + 1] : undefined,
            fullCommand: input
          }
        };
      }
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
      const serverName = Object.keys(parsedConfig.config.mcpServers)[0];
      const serverConfig = parsedConfig.config.mcpServers[serverName];
      testProcess = spawn(serverConfig.command, serverConfig.args, { shell: true });
    } else if (parsedConfig.type === 'npx') {
      const args = parsedConfig.config.fullCommand.split(' ').filter(p => p.trim().length > 0);
      const command = args.shift();
      testProcess = spawn(command, args, { shell: true });
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

    res.json({
      success: true,
      configurationType: parsedConfig.type,
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