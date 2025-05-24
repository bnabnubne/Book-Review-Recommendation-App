import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput, Button, Alert, Image
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchBookById, postComment } from '../api/api';

interface Comment {
  id: number;
  content: string;
  created_at: string;
}

export default function BookDetailScreen() {
  const route = useRoute();
  const { bookId } = route.params as { bookId: number };

  const [book, setBook] = useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  const fetchBook = async () => {
    try {
      const bookData = await fetchBookById(bookId);
      setBook(bookData);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải dữ liệu sách');
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`http://10.0.2.2:4000/api/comments/${bookId}`);
      const text = await res.text();
      const data = JSON.parse(text);
      setComments(data);
    } catch (error) {
      console.log('Lỗi fetch comment:', error);
    }
  };

  const handleComment = async () => {
    const token = await AsyncStorage.getItem('token');
    const userIdStr = await AsyncStorage.getItem('userId');
  
    if (!token || !userIdStr) {
      return Alert.alert('Bạn cần đăng nhập');
    }
  
    const userId = parseInt(userIdStr);
  
    try {
      const res = await postComment(bookId, userId, newComment);
      console.log('✅ Kết quả gửi bình luận:', res);
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('❌ Lỗi gửi bình luận:', error);
      Alert.alert('Lỗi', 'Không gửi được bình luận');
    }
  };

  useEffect(() => {
    fetchBook();
    fetchComments();
  }, []);

  if (!book || !book.title) return <Text>Đang tải sách...</Text>;

  return (
    <FlatList
      ListHeaderComponent={
        <View style={styles.container}>
          {book.cover_url ? (
            <Image source={{ uri: book.cover_url }} style={styles.cover} />
          ) : null}
          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.author}>Tác giả: {book.author || 'Không rõ'}</Text>
          <Text style={styles.rating}>⭐ {book.rating?.toFixed(1) || 'Chưa có'} ({book.rating_count} đánh giá)</Text>
          <Text style={styles.desc}>{book.description || 'Không có mô tả'}</Text>

          {book.subjects && (
            <View style={styles.subjectContainer}>
              <Text style={styles.subjectLabel}>Chủ đề:</Text>
              {(Array.isArray(book.subjects) ? book.subjects : JSON.parse(book.subjects)).map((subj: string, idx: number) => (
                <Text key={idx} style={styles.subjectTag}>#{subj}</Text>
              ))}
            </View>
          )}

          <Text style={styles.commentTitle}>Bình luận:</Text>
        </View>
      }
      data={comments}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.commentBox}>
          <Text>{item.content}</Text>
          <Text style={styles.time}>{item.created_at}</Text>
        </View>
      )}
      ListFooterComponent={
        <View style={{ padding: 20 }}>
          <TextInput
            placeholder="Nhập bình luận"
            style={styles.input}
            value={newComment}
            onChangeText={setNewComment}
          />
          <Button title="Gửi bình luận" onPress={handleComment} />
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginTop: 10 },
  author: { fontSize: 18, marginTop: 5 },
  desc: { fontSize: 16, marginVertical: 10 },
  cover: { width: '100%', height: 300, resizeMode: 'cover', borderRadius: 8 },
  rating: { fontSize: 16, color: 'darkorange', marginVertical: 5 },
  commentTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  commentBox: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  input: { borderWidth: 1, padding: 10, marginTop: 10, borderRadius: 6 },
  time: { fontSize: 12, color: 'gray' },
  subjectContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  subjectLabel: { fontWeight: 'bold', marginRight: 5 },
  subjectTag: { backgroundColor: '#eee', borderRadius: 5, padding: 4, marginRight: 5, marginTop: 5 }
});