export interface WeatherData {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface MainWeather {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level?: number;
  grnd_level?: number;
}

export interface Wind {
  speed: number;
  deg: number;
  gust?: number;
}

export interface Clouds {
  all: number;
}

export interface Rain {
  '1h'?: number;
  '3h'?: number;
}

export interface Snow {
  '1h'?: number;
  '3h'?: number;
}

export interface Sys {
  type?: number;
  id?: number;
  country: string;
  sunrise: number;
  sunset: number;
}

export interface Coord {
  lon: number;
  lat: number;
}

export interface CurrentWeather {
  coord: Coord;
  weather: WeatherData[];
  base: string;
  main: MainWeather;
  visibility: number;
  wind: Wind;
  clouds: Clouds;
  rain?: Rain;
  snow?: Snow;
  dt: number;
  sys: Sys;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface ForecastItem {
  dt: number;
  main: MainWeather;
  weather: WeatherData[];
  clouds: Clouds;
  wind: Wind;
  visibility: number;
  pop: number;
  rain?: Rain;
  snow?: Snow;
  sys: {
    pod: string;
  };
  dt_txt: string;
}

export interface ForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastItem[];
  city: {
    id: number;
    name: string;
    coord: Coord;
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export interface LocationData {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface WeatherSeverity {
  level: 'clear' | 'light' | 'moderate' | 'heavy';
  color: string;
  description: string;
}

export interface IndianCity {
  name: string;
  state: string;
  lat: number;
  lon: number;
  population?: number;
}