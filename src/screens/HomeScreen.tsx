import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  ActivityIndicator, StyleSheet, TextInput, Image
} from 'react-native';
import { fetchBooks, fetchBooksByGenre } from '../api/api';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

interface Book {
  id: number;
  title: string;
  author: string;
  subjects: string[];
  cover_url: string;
  genre:string;
}

export default function HomeScreen() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchText, setSearchText] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [genres, setGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    fetchBooks()
      .then((data) => {
        const fixed = data.map((book: any) => ({
          ...book,
          subjects: typeof book.subjects === 'string' ? JSON.parse(book.subjects) : (book.subjects || []),
        }));
        setBooks(fixed);
        setFilteredBooks(fixed);
        extractGenres(fixed);    
        console.log('Book sample:', data[0]);

      })
      
      .catch(err => console.log('Lỗi lấy sách:', err))
      .finally(() => setLoading(false));
  }, []);

  const extractGenres = (bookList: Book[]) => {
    const allGenres = bookList.map(book => book.genre).filter((g): g is string => !!g && g.trim().length > 0);
    const unique = Array.from(new Set(allGenres));
    setGenres(unique);
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    filterBooks(text, selectedGenre);
  };

  const filterBooks = (text: string, genre: string | null) => {
    const filtered = books.filter(book => {
      const matchTitle = book.title.toLowerCase().includes(text.toLowerCase());
      const matchGenre = genre ? book.subjects?.includes(genre) : true;
      return matchTitle && matchGenre;
    });
    setFilteredBooks(filtered);
  };

  const handleSelectGenre = async (genre: string) => {
    const newGenre = genre === selectedGenre ? null : genre;
    setSelectedGenre(newGenre);
    setLoading(true);

    try {
      let data;
      if (newGenre) {
        data = await fetchBooksByGenre(newGenre);
      } else {
        data = await fetchBooks();
      }
      const fixed = data.map((book: any) => ({
        ...book,
        subjects: typeof book.subjects === 'string' ? JSON.parse(book.subjects) : (book.subjects || []),
      }));
      setFilteredBooks(fixed);
    } catch (e) {
      setFilteredBooks([]);
      console.log('Lỗi lấy sách theo thể loại:', e);
    }
    setLoading(false);
  };

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Tìm sách theo tên..."
        value={searchText}
        onChangeText={handleSearch}
        style={styles.searchBox}
      />

      <FlatList
        horizontal
        data={genres}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 5 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.genreButton,
              selectedGenre === item && styles.genreSelected
            ]}
            onPress={() => handleSelectGenre(item)}
          >
            <Text style={[
              styles.genreText,
              selectedGenre === item && styles.genreTextSelected
            ]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={filteredBooks}
        numColumns={2}
        key={'2cols'} // để tránh warning về thay đổi số cột
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('BookDetail', { bookId: item.id })}
          >
            <Image source={{ uri: item.cover_url }} style={styles.cover} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.author}>{item.author}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  searchBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10
  },
  genreButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#eee',
    marginRight: 8,
    height: 36,
    justifyContent: 'center'
  },
  genreSelected: {
    backgroundColor: '#8B4513',
  },
  genreText: {
    fontSize: 14,
    color: '#555'
  },
  genreTextSelected: {
    color: '#fff',
    fontWeight: 'bold'
  },
  card: {
    width: '48%',
    marginBottom: 20,
  },
  cover: {
    width: '100%',
    aspectRatio: 2 / 3,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#ccc'
  },
  title: { fontSize: 14, fontWeight: 'bold' },
  author: { fontSize: 12, color: '#666' }
});