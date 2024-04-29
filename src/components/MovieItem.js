import React from 'react';
import { View, Text, Image } from 'react-native';

const MovieItem = ({ item }) => (
    
  <View style={{ display:'flex',justifyContent:'space-between',flex:1,padding:5}}>
    <Text>{item.title}</Text>
    <Image
      source={{ uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}` }}
      style={{ width: 100, height: 150 }}
    />
    {/* <Text>Description: {item.overview}</Text> */}
  </View>
);

export default MovieItem;
