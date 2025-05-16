import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function BookDetailScreen({ route }: any) {
  const { book } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.description}>{book.description}</Text>
      <Text style={styles.note}>Đánh giá và bình luận sẽ được thêm ở tuần 2</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 10 },
  description: { fontSize: 16, lineHeight: 22 },
  note: { marginTop: 20, fontStyle: 'italic', color: 'gray' },
});