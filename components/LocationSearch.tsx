import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { MapPinIcon } from 'react-native-heroicons/solid';
import { LocationDTO } from '../constants/DTOs';

type LocationSearchProps = {
    locations: LocationDTO[];
    showSearch: boolean;
    handleLocation: (loc: LocationDTO) => void;
    };

const LocationSearch = ({ locations, showSearch, handleLocation }:LocationSearchProps) => {
  return (
    <>
           {locations.length > 0 && showSearch ? (
              <View className="absolute top-16 w-full rounded-lg bg-gray-300 ">
                {locations.map((loc, index) => {
                  let showBorder = index + 1 != locations.length;
                  let borderClass = showBorder
                    ? ' border-b-2 border-b-gray-400'
                    : '';
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleLocation(loc)}
                      className={
                        'mb-1 flex-row items-center border-0 p-3 px-4 ' +
                        borderClass
                      }>
                      <MapPinIcon size="20" color="gray" />
                      <Text className="ml-2 text-lg text-black">
                        {loc?.name}, {loc?.country}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
    </>
  );
};

export default LocationSearch;
