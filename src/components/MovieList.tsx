import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import GenreFilter from './GenreFilter';
import MovieItem from './MovieItem';

const API_KEY = '2dca580c2a14b55200e784d157207b4d';
const MIN_VOTE_COUNT = 100;

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
}

interface Genre {
  id: number;
  name: string;
}

const MovieList = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(2012);
  const [page, setPage] = useState(1);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const flatListRef = useRef(null);
  const [allGenresSelected, setAllGenresSelected] = useState(false);

  useEffect(() => {
    fetchGenres();
    fetchMovies(year);
  }, [year]);

  useEffect(() => {
    if (selectedGenres.length > 0|| allGenresSelected) {
      setMovies([]);
      setPage(1);
      fetchMovies(year);
    }
  }, [selectedGenres,allGenresSelected]);

  const fetchGenres = useCallback(async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en`,
      );
      const data = await response.json();
      setGenres(data.genres);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  }, []);

  const fetchMovies = useCallback(
    async (selectedYear: number) => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&primary_release_year=${selectedYear}&page=${page}&vote_count.gte=${MIN_VOTE_COUNT}&with_genres=${selectedGenres.join(
            ',',
          )}&limit=20`,
        );
        const data = await response.json();
        setMovies(prevMovies => [...prevMovies, ...data.results]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setLoading(false);
      }
    },
    [page, selectedGenres,allGenresSelected],
  );

  const handleLoadMore = useCallback(() => {
    setPage(prevPage => prevPage + 1);
  }, []);

  const handleScroll = useCallback(
    ({nativeEvent}: NativeSyntheticEvent<NativeScrollEvent>) => {
      const {contentOffset, layoutMeasurement, contentSize} = nativeEvent;
      const scrolledToBottom =
        contentOffset.y + layoutMeasurement.height >= contentSize.height - 50;

      if (scrolledToBottom) {
        // Load movies of the next year
        setYear(prevYear => prevYear + 1);
      } else if (contentOffset.y <= 0 && year > 2012) {
        // Load movies of the previous year
        setYear(prevYear => prevYear - 1);
      }
    },
    [year],
  );

  const handleGenrePress = useCallback((genreId:number) => {
    const updatedGenres = selectedGenres.includes(genreId)
      ? selectedGenres.filter((id) => id !== genreId)
      : [...selectedGenres, genreId];
    setSelectedGenres(updatedGenres);
    setAllGenresSelected(false); // Reset allGenresSelected when individual genre is selected/deselected
  }, [selectedGenres]);

  const handleAllGenresPress = useCallback(() => {
    setAllGenresSelected(!allGenresSelected); // Toggle allGenresSelected
    setSelectedGenres([]); // Clear selected genres when all genres are selected
  }, [allGenresSelected]);
  

  const renderGenreFilter = () => (
    <GenreFilter
      genres={genres}
      selectedGenres={selectedGenres}
      handleGenrePress={handleGenrePress}
      handleAllGenresPress={handleAllGenresPress}
    />
  );

  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator size="large" color="blue" />;
  };

  if (loading && page === 1) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <View>
      {renderGenreFilter()}
      <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 }}>{year}</Text>
      <FlatList
        ref={flatListRef}
        data={movies}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => <MovieItem item={item} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        onScroll={handleScroll}
        initialNumToRender={20}
        removeClippedSubviews={true}
        numColumns={2} // Set the number of columns to 2
      />
    </View>
  );
};

export default MovieList;
