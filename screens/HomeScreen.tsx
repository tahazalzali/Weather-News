import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MagnifyingGlassIcon, XMarkIcon} from 'react-native-heroicons/outline';
import {CalendarDaysIcon, MapPinIcon} from 'react-native-heroicons/solid';
import {debounce} from 'lodash';
import {theme} from '../theme';
import {fetchLocations, fetchWeatherForecast} from '../api/weather';
import * as Progress from 'react-native-progress';
import {weatherImages} from '../constants';
import {storeData} from '../utils/asyncStorage';
import {
  getMyCurrentLocation,
  requestLocationPermission,
} from '../utils/functions';
import {LocationDTO, WeatherData} from '../constants/DTOs';
import {GeoCoordinates} from 'react-native-geolocation-service';
import {weekDaysApiRequest} from '../utils/constants';
import LocationSearch from '../components/LocationSearch';

export default function HomeScreen() {
  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocations] = useState<LocationDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState<WeatherData>();
  const handleSearch = (search: string) => {
    if (search && search.length > 2)
      fetchLocations({cityName: search}).then(data => {
        setLocations(data);
      });
  };

  const handleLocation = (loc: LocationDTO) => {
    setLoading(true);
    toggleSearch(false);
    setLocations([]);
    fetchWeatherForecast({
      cityName: loc.name,
      days: weekDaysApiRequest.toString(),
    }).then(data => {
      setLoading(false);
      setWeather(data);
      storeData('city', loc.name);
    });
  };

  useEffect(() => {
    fetchMyWeatherData();
  }, []);

  const fetchMyWeatherData = async () => {
    let positionCoords: GeoCoordinates = {
      latitude: 0,
      longitude: 0,
      accuracy: 0,
      altitude: null,
      heading: null,
      speed: null,
    };
    let longitude;
    let latitude;
    requestLocationPermission().then(granted => {
      if (granted) {
        getMyCurrentLocation().then(position => {
          positionCoords = position.coords;
          longitude = positionCoords.longitude;
          latitude = positionCoords.latitude;

          let locationParam = `${latitude},${longitude}`;

          fetchWeatherForecast({
            cityName: locationParam,
            days: weekDaysApiRequest.toString(),
          }).then(data => {
            setWeather(data);
            setLoading(false);
          });
        });
      } else {
        fetchWeatherForecast({
          cityName: 'Lebanon',
          days: weekDaysApiRequest.toString(),
        }).then(data => {
          setWeather(data);
          setLoading(false);
        });
      }
    });
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);

  return (
    <ScrollView className="relative flex-1 bg-slate-600">
      {loading ? (
        <View className="flex-1 items-center justify-center align-middle pt-80">
          <Progress.Bar indeterminate color="#0bb3b2" />
          <Text className="text-xl font-bold text-white mt-4 text-center">
            Fetching data...
          </Text>
        </View>
      ) : (
        <SafeAreaView className="flex flex-1">
          {/* search section */}
          <View style={{height: '7%'}} className="relative z-50 mx-4">
            <View
              className="flex-row items-center justify-end rounded-lg"
              style={{
                backgroundColor: showSearch
                  ? theme.bgWhite('0.2')
                  : 'transparent',
              }}>
              {showSearch ? (
                <TextInput
                  onChangeText={handleTextDebounce}
                  placeholder="Search for any city"
                  placeholderTextColor={'lightgray'}
                  className="h-10 flex-1 pb-1 pl-6 text-base text-white"
                />
              ) : null}
              <TouchableOpacity
                onPress={() => toggleSearch(!showSearch)}
                className={`${
                  showSearch ? 'rounded-lg' : 'rounded-full'
                } m-1 p-3`}
                style={{backgroundColor: theme.bgWhite('0.3')}}>
                {showSearch ? (
                  <XMarkIcon size="25" color="white" />
                ) : (
                  <MagnifyingGlassIcon size="25" color="white" />
                )}
              </TouchableOpacity>
            </View>
            <LocationSearch
              locations={locations}
              showSearch={showSearch}
              handleLocation={handleLocation}
            />
          </View>

          {/* forecast section */}
          <View className="mx-4 mb-2 flex flex-1 justify-around">
            {/* location */}
            <Text className="text-center text-2xl font-bold text-white">
              {weather?.location?.name}, {''}
              <Text className="text-lg font-semibold text-gray-300">
                {weather?.location?.country}
              </Text>
            </Text>
            {/* weather icon */}
            <View className="flex-row justify-center">
              <Image
                source={
                  weatherImages[weather?.current?.condition?.text || 'other']
                }
                className="h-52 w-52"
              />
            </View>
            {/* degree celcius */}
            <View className="space-y-2">
              <Text className="ml-5 text-center text-6xl font-bold text-white">
                {weather?.current?.temp_c}&#176;
              </Text>
              <Text className="text-center text-xl tracking-widest text-white">
                {weather?.current?.condition?.text}
              </Text>
            </View>

            {/* other stats */}
            <View className="mx-4 flex-row justify-between">
              <View className="flex-row items-center space-x-2">
                <Image
                  source={require('../assets/icons/wind.png')}
                  className="h-6 w-6"
                />
                <Text className="text-base font-semibold text-white">
                  {weather?.current?.wind_kph}km
                </Text>
              </View>
              <View className="flex-row items-center space-x-2">
                <Image
                  source={require('../assets/icons/drop.png')}
                  className="h-6 w-6"
                />
                <Text className="text-base font-semibold text-white">
                  {weather?.current?.humidity}%
                </Text>
              </View>
              <View className="flex-row items-center space-x-2">
                <Image
                  source={require('../assets/icons/sun.png')}
                  className="h-6 w-6"
                />
                <Text className="text-base font-semibold text-white">
                  {weather?.forecast?.forecastday[0]?.astro?.sunrise}
                </Text>
              </View>
            </View>
          </View>

          {/* forecast for next days */}
          <View className="mb-2 space-y-3">
            <View className="mx-5 flex-row items-center space-x-2">
              <CalendarDaysIcon size="22" color="white" />
              <Text className="text-base text-white">Daily forecast</Text>
            </View>
            <ScrollView
              horizontal
              contentContainerStyle={{paddingHorizontal: 15}}
              showsHorizontalScrollIndicator={false}>
              {weather?.forecast?.forecastday?.map((item, index) => {
                const date = new Date(item.date);
                const options: Intl.DateTimeFormatOptions = {weekday: 'long'};
                let dayName = date.toLocaleDateString('en-US', options);
                dayName = dayName.split(',')[0];
                console.info(item.day.condition.code);

                return (
                  <View
                    key={index}
                    className="mr-4 flex w-28 items-center justify-center space-y-1 rounded-lg py-3"
                    style={{backgroundColor: theme.bgWhite('0.15')}}>
                    <Image
                      source={{uri: `https:${item.day.condition.icon}`}}
                      className="h-11 w-14"
                    />
                    <Text className="text-white">{dayName}</Text>
                    <Text className="text-xl font-semibold text-white">
                      {item?.day?.avgtemp_c}&#176;
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </SafeAreaView>
      )}
    </ScrollView>
  );
}
