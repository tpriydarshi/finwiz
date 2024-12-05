# FinWiz - Financial Portfolio Tracker

A comprehensive financial portfolio tracker designed for the Indian market with support for international assets.

## Features

- Multi-portfolio management for family members
- Comprehensive asset tracking (Stocks, Mutual Funds, NPS, etc.)
- Goal-based financial planning
- Real-time market data integration
- Advanced analytics and visualizations
- Tax reporting and document management

## Tech Stack

- Frontend: React.js with TypeScript
- Backend: Node.js with Express
- Database: SQLite with Prisma ORM
- UI Framework: Material-UI
- Charts: Chart.js

## Prerequisites

- Node.js >= 18.0.0
- Yarn >= 1.22.0 (npm is not supported)

To install Yarn, run:
```bash
npm install -g yarn
```

## Project Structure

```
finwiz/
├── packages/
│   ├── frontend/     # React frontend application
│   ├── backend/      # Node.js backend server
│   └── common/       # Shared types and utilities
├── package.json      # Root package.json for workspace management
└── README.md        # Project documentation
```

## Getting Started

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Start development servers:
   ```bash
   yarn dev
   ```

This will start both the frontend and backend development servers.

## Development

- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Important Notes

- This project uses Yarn workspaces for package management. Please do not use npm as it may cause dependency issues.
- Make sure to commit the `yarn.lock` file to ensure consistent dependencies across all environments.

## License

MIT
