# MCP Server Tester

A web application for testing Model Context Protocol (MCP) servers before integration. This tool supports both JSON configuration and NPX command formats.

## Features

- Test MCP servers using JSON or NPX command formats
- Real-time server response monitoring
- Error detection and detailed feedback
- User-friendly interface with example configurations
- Support for multiple server configurations

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/sujal862/MCPTester
cd MCPTESTER
```

2. Install dependencies for both frontend and backend:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Start the application:

```bash
# Start the backend server (in the backend directory)
cd ../backend
npm start

# In a new terminal, start the frontend server (in the frontend directory)
cd ../frontend
npm run dev
```

4. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173` or `http://localhost:5174`)

## Detailed Usage Guide

### Testing Your MCP Server

1. **Launch the Application**
   - Ensure both backend and frontend servers are running
   - Open the application in your browser
   - You'll see a clean interface with a configuration input area

2. **Enter Your Configuration**
   - Click the "Show Examples" button to view sample configurations
   - Choose either JSON or NPX command format
   - Use the "Copy to Input" button to quickly use an example
   - Modify the configuration with your server details and API key

3. **JSON Configuration Format**
```json
{
  "mcpServers": {
    "your-server-name": {
      "command": "npx",
      "args": [
        "-y",
        "@smithery/cli@latest",
        "run",
        "@your-org/your-mcp-server",
        "--key",
        "your-api-key"
      ]
    }
  }
}
```

4. **NPX Command Format**
```bash
npx -y @smithery/cli@latest install @your-org/your-mcp-server --client claude --key your-api-key
```

5. **Run the Test**
   - Click the "Test MCP Server" button
   - The application will:
     - Validate your configuration
     - Connect to your MCP server
     - Display real-time server responses
     - Show any errors or success messages

6. **Understanding Results**
   - Green checkmark: Test passed successfully
   - Red X: Test failed (with error details)
   - Connection status is shown in real-time
   - Error messages are clearly displayed if any issues occur

## Troubleshooting

### Common Issues

1. **Connection Errors**
   - Verify your API key is correct
   - Check if the server package name is correct
   - Ensure you have internet connectivity

2. **Server Not Starting**
   - Make sure both backend and frontend servers are running
   - Check terminal outputs for any error messages
   - Verify all dependencies are installed correctly

3. **Invalid Configuration**
   - Compare your configuration with the examples
   - Ensure JSON format is valid
   - Check for proper command syntax in NPX format

### Getting Help

If you encounter any issues:
1. Check the terminal output for error messages
2. Verify your configuration matches the examples
3. Ensure all prerequisites are installed correctly
4. Check the [Smithery CLI documentation](https://smithery.ai/docs) for more details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
