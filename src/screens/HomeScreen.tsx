import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const books = [
  { id: '1', title: 'Dế Mèn Phiêu Lưu Ký', description: 'Cuộc phiêu lưu kỳ thú của Dế Mèn.' },
  { id: '2', title: 'Totto-chan: Cô bé bên cửa sổ', description: 'Câu chuyện cảm động về giáo dục tự do.' },
];

export default function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách sách</Text>
      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('BookDetail', { book: item })}
          >
            <Text style={styles.bookTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.contactButton} onPress={() => navigation.navigate('Contact')}>
        <Text style={styles.contactText}>Liên hệ</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 10 },
  item: {
    padding: 15,
    backgroundColor: '#f4f4f4',
    marginBottom: 10,
    borderRadius: 8,
  },
  bookTitle: { fontSize: 18 },
  contactButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  contactText: { color: 'white', fontWeight: 'bold' },
});