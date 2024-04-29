import React from 'react';
import { SafeAreaView, StatusBar, Text } from 'react-native';
import MovieList from './components/MovieList';

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <MovieList />
    </SafeAreaView>
  );
};

export default App;
