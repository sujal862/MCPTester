# MCP Server Tester

A web application for testing Model Context Protocol (MCP) servers before integration. This tool supports both JSON configuration and NPX command formats.

## Features

- Test MCP servers using different configuration formats
- Support for JSON configuration and NPX command formats
- Real-time test execution and monitoring
- Clear display of test results and errors
- Modern, responsive UI with Tailwind CSS
- Documentation and examples included

## Setup Instructions

### Prerequisites

- Node.js v16 or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/mcp-tester.git
   cd mcp-tester
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

### Development

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Enter your MCP server configuration in either JSON format or as an NPX command
2. Click "Test MCP Server" to run the test
3. View the test results, including server status and responses

### Supported Configuration Formats

#### JSON Configuration

```json
{
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
        "your-api-key"
      ]
    }
  }
}
```

#### NPX Command

```bash
npx -y @smithery/cli@latest install @smithery-ai/server-sequential-thinking --client claude --key your-api-key
```

## Technical Details

This application follows a client-server architecture:

- **Frontend**: React application built with Vite and Tailwind CSS
- **Backend**: Node.js/Express server that handles:
  - Configuration parsing and validation
  - MCP server execution
  - Test result formatting and delivery

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
