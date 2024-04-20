export interface WeatherData {
    location: LocationDTO | null;
    current: CurrentWeather | null;
    forecast?: Forecast | null;
    alerts?: Alerts | null;
}

export interface LocationDTO {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tz_id: string;
    localtime_epoch: number;
    localtime: string;
}

interface CurrentWeather {
    last_updated_epoch: number;
    last_updated: string;
    temp_c: number;
    temp_f: number;
    is_day: number;
    condition: WeatherCondition;
    wind_mph: number;
    wind_kph: number;
    wind_degree: number;
    wind_dir: string;
    pressure_mb: number;
    pressure_in: number;
    precip_mm: number;
    precip_in: number;
    humidity: number;
    cloud: number;
    feelslike_c: number;
    feelslike_f: number;
    vis_km: number;
    vis_miles: number;
    uv: number;
    gust_mph: number;
    gust_kph: number;
    air_quality: AirQuality;
}

interface WeatherCondition {
    text: string;
    icon: string;
    code: number;
}

interface AirQuality {
    co: number;
    no2: number;
    o3: number;
    so2: number;
    pm2_5: number;
    pm10: number;
    'us-epa-index': number;
    'gb-defra-index': number;
}

interface Forecast {
    forecastday: ForecastDay[];
}

interface ForecastDay {
    date: string;
    date_epoch: number;
    day: DayWeather;
    astro: Astronomy;
    hour: HourWeather[];
}

interface DayWeather {
    maxtemp_c: number;
    maxtemp_f: number;
    mintemp_c: number;
    mintemp_f: number;
    avgtemp_c: number;
    avgtemp_f: number;
    maxwind_mph: number;
    maxwind_kph: number;
    totalprecip_mm: number;
    totalprecip_in: number;
    avgvis_km: number;
    avgvis_miles: number;
    avghumidity: number;
    daily_will_it_rain: number;
    daily_chance_of_rain: number;
    daily_will_it_snow: number;
    daily_chance_of_snow: number;
    condition: WeatherCondition;
    uv: number;
}

interface HourWeather extends DayWeather {
    time_epoch: number;
    time: string;
    is_day: number;
    windchill_c: number;
    windchill_f: number;
    heatindex_c: number;
    heatindex_f: number;
    dewpoint_c: number;
    dewpoint_f: number;
    will_it_rain: number;
    chance_of_rain: number;
    will_it_snow: number;
    chance_of_snow: number;
    gust_mph: number;
    gust_kph: number;
}

interface Astronomy {
    sunrise: string;
    sunset: string;
    moonrise: string;
    moonset: string;
    moon_phase: string;
    moon_illumination: string;
}

interface Alerts {
    alert: Alert[];
}

interface Alert {
    headline: string;
    msgtype: string | null;
    severity: string | null;
    urgency: string | null;
    areas: string | null;
    category: string;
    certainty: string | null;
    event: string;
    note: string | null;
    effective: string;
    expires: string;
    desc: string;
    instruction: string;
}
