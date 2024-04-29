import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const GenreFilter = ({ genres, selectedGenres, handleGenrePress, handleAllGenresPress }) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
    <TouchableOpacity
      style={[
        styles.genreButton,
        { backgroundColor: selectedGenres.length === genres.length ? 'blue' : 'lightgray' },
      ]}
      onPress={handleAllGenresPress}
    >
      <Text style={{ color: selectedGenres.length === genres.length ? 'white' : 'black' }}>
        All
      </Text>
    </TouchableOpacity>
    {genres.map((genre) => (
      <TouchableOpacity
        key={genre.id}
        style={[
          styles.genreButton,
          { backgroundColor: selectedGenres.includes(genre.id) ? 'blue' : 'lightgray' },
        ]}
        onPress={() => handleGenrePress(genre.id)}
      >
        <Text style={{ color: selectedGenres.includes(genre.id) ? 'white' : 'black' }}>
          {genre.name}
        </Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  genreButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: 'gray',
  },
});

export default GenreFilter;
