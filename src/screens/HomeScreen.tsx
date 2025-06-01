import React, { useEffect, useState , useLayoutEffect  } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { fetchBooks } from '../api/api';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

interface Book {
  id: number;
  title: string;
  author: string;
}

export default function HomeScreen() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    fetchBooks()
      .then(setBooks)
      .catch(err => console.log('Lỗi lấy sách:', err))
      .finally(() => setLoading(false));
  }, []);
 
  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('BookDetail', { bookId: item.id })}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.author}>Tác giả: {item.author}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  author: { fontSize: 14, color: '#333' }
});