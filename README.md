# CryptoMonitor-Angular

A modern cryptocurrency monitoring application built with Angular 21 and Angular Material. This application fetches real-time cryptocurrency data from the CoinCap API and displays it in a sortable, paginated table with optional WebSocket support for live price updates.

## Features

- **Cryptocurrency Data**: Fetches and displays cryptocurrency information from CoinCap API
- **Interactive Table**: Sortable data table with Angular Material
- **Pagination**: Lazy-loaded pagination for efficient data handling
- **Real-time Updates**: WebSocket support for live price updates (configurable)
- **Modern Angular**: Built with Angular 21 using standalone components, signals, and the latest Angular features
- **Responsive UI**: Clean interface built with Angular Material components

## Tech Stack

- **Angular 21.0.0** - Latest Angular framework with standalone components
- **Angular Material 21.0.0** - UI component library
- **RxJS 7.8.1** - Reactive programming for API calls and WebSocket
- **CoinCap API** - Cryptocurrency data provider
- **TypeScript 5.9.2** - Type-safe development

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── table/          # Main cryptocurrency table component
│   │   ├── header/         # Application header
│   │   └── footer/         # Application footer
│   ├── services/
│   │   └── coincap.service.ts  # CoinCap API integration service
│   ├── models/
│   │   └── coin.ts         # TypeScript interfaces for Coin data
│   ├── material/
│   │   └── material.module.ts  # Angular Material module configuration
│   ├── app.component.ts    # Root component
│   ├── app.config.ts       # Application configuration
│   └── app.routes.ts       # Routing configuration
├── environments/
│   ├── environment.ts      # Development environment variables
│   └── environment.prod.ts # Production environment variables
└── main.ts                 # Application bootstrap
```

## Setup

### Prerequisites

- Node.js (v20 or higher recommended)
- npm or yarn
- CoinCap API Key (get one at [coincap.io](https://coincap.io/api))

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd CryptoMonitor-Angular
```

2. Install dependencies:
```bash
npm install
```

3. Set up your CoinCap API key:
```bash
export COINCAP_KEY=your-api-key-here
```

Or update the environment file:
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  restApi: "https://rest.coincap.io/v3/assets",
  coincapKey: "your-api-key-here",
  wsApi: "wss://ws.coincap.io",
  websocketsEnabled: true  // Set to true to enable WebSocket updates
};
```

## Development

Run the development server:
```bash
npm start
```

Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Build the project for production:
```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## API Integration

### REST API

The application uses the CoinCap REST API to fetch cryptocurrency data:
- **Endpoint**: `https://rest.coincap.io/v3/assets`
- **Authentication**: Bearer token (CoinCap API key)
- **Features**: Pagination support with limit and offset parameters

### WebSocket API

Optional real-time price updates via WebSocket:
- **Endpoint**: `wss://ws.coincap.io`
- **Usage**: Subscribes to price updates for displayed cryptocurrencies
- **Configuration**: Enable/disable via `websocketsEnabled` in environment

## Data Model

The application displays the following cryptocurrency information:
- **Rank**: Market capitalization rank
- **Symbol**: Cryptocurrency symbol (e.g., BTC, ETH)
- **Name**: Full cryptocurrency name
- **Price**: Current price in USD
- **Market Cap**: Total market capitalization
- **24h Change**: Price change percentage in the last 24 hours
- **Volume**: 24-hour trading volume

## Components

### TableComponent
Main component displaying cryptocurrency data with:
- Material Data Table
- Pagination with lazy loading
- Sorting capabilities
- Real-time price updates (when WebSocket is enabled)

### HeaderComponent & FooterComponent
Layout components for the application header and footer.

## Angular Features Used

- **Standalone Components**: No NgModule declarations needed
- **Signals**: Reactive state management
- **viewChild**: Type-safe component queries
- **effect**: Reactive side effects
- **HttpClient**: With fetch API for HTTP requests
- **Router**: Standalone routing configuration

## License

This project is licensed under the MIT License.
