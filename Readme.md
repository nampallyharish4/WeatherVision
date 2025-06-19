# WeatherVision India

A modern, interactive weather forecasting application focused on Indian cities. Built with React, Vite, and TypeScript, it provides real-time weather data, analytics, and visualizations for major cities across India.

## Features

- **Real-Time Weather:** Live weather updates for any location in India, including temperature, humidity, wind, and more.
- **7-Day Forecast:** Detailed daily forecasts with precipitation probability and temperature trends.
- **Interactive Map:** Visualize weather severity across major Indian cities on a map. Click any city to view its weather.
- **Weather Analytics:** Charts and graphs for temperature, humidity, rainfall, wind speed, and weather pattern distribution.
- **Weather Alerts:** Automatic alerts for extreme weather conditions (heat, cold, rain, wind, visibility, etc.).
- **Location Search:** Search and select from major Indian cities or use your current location.
- **Unit Toggle:** Switch between Celsius and Fahrenheit.
- **Responsive UI:** Clean, mobile-friendly design using Tailwind CSS.

## Screenshots

> _Add screenshots here if available._

## Getting Started

### Prerequisites

- Node.js (v16 or above recommended)
- npm or yarn

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repo-url>
   cd project
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**

   - Create a `.env` file in the project root:
     ```env
     VITE_OPENWEATHER_API_KEY=your_openweathermap_api_key
     ```
   - (Optional) You can also set:
     ```env
     VITE_WEATHER_API_BASE_URL=https://api.openweathermap.org/data/2.5
     VITE_GEO_API_BASE_URL=https://api.openweathermap.org/geo/1.0
     ```

4. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The app will be available at `http://localhost:5173` (or as shown in your terminal).

### Build for Production

```bash
npm run build
# or
yarn build
```

### Linting

```bash
npm run lint
# or
yarn lint
```

## Project Structure

- `src/`
  - `components/` — UI components (WeatherCard, ForecastCard, WeatherMap, etc.)
  - `data/` — Static data (major Indian cities)
  - `hooks/` — Custom React hooks (e.g., useWeatherData)
  - `types/` — TypeScript type definitions
  - `utils/` — API logic and helpers

## API & Configuration

- Uses [OpenWeatherMap API](https://openweathermap.org/api) for weather data.
- If no API key is provided, the app uses mock data for demo purposes.
- To use real data, set `VITE_OPENWEATHER_API_KEY` in your `.env` file.

## Dependencies

- React, TypeScript, Vite
- Tailwind CSS
- Axios
- React-Leaflet & Leaflet (maps)
- Recharts (charts)
- Lucide React (icons)
- date-fns (date formatting)

## License

> _Specify your license here (e.g., MIT)_

---

**WeatherVision India** — Real-time weather, analytics, and insights for India.
