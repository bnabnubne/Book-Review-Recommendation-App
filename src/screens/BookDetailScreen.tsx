import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput, Button, Alert, Image, TouchableOpacity
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchBookById, postComment } from '../api/api';

interface Comment {
  id: number;
  content: string;
  created_at: string;
  rating: number;
  username: string;
}

export default function BookDetailScreen() {
  const route = useRoute();
  const { bookId } = route.params as { bookId: number };

  const [book, setBook] = useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [userRating, setUserRating] = useState<number>(0);

  const fetchBook = async () => {
    try {
      const data = await fetchBookById(bookId);
      setBook(data);
    } catch (error) {
      Alert.alert('Lỗi', 'Không tải được sách');
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`http://10.0.2.2:4000/api/comments/${bookId}`);
      const text = await res.text();
      const data = JSON.parse(text);
      setComments(data);
    } catch (error) {
      console.log('Lỗi lấy comment:', error);
    }
  };

  const handleComment = async () => {
    const token = await AsyncStorage.getItem('token');
    const userIdStr = await AsyncStorage.getItem('userId');
    if (!token || !userIdStr) return Alert.alert('Bạn cần đăng nhập');

    
    if (!userRating) return Alert.alert('Hãy đánh giá sao cho sách');
    if (!newComment.trim()) return Alert.alert('Vui lòng nhập bình luận');

    const userId = parseInt(userIdStr);
    try {
      console.log('🔄 Gửi:', { bookId, userId, newComment, userRating });

      await postComment(bookId, userId, newComment, userRating);
      setNewComment('');
      setUserRating(0);
      await fetchComments();
    } catch (error) {
      Alert.alert('Lỗi gửi bình luận');
      console.error('❌ Gửi lỗi:', error);

    }
  };

  useEffect(() => {
    fetchBook();
    fetchComments();
  }, []);

  const averageRating =
    comments.length > 0
      ? (comments.reduce((sum, c) => sum + c.rating, 0) / comments.length).toFixed(2)
      : 'Chưa có';

  const renderStars = (selected: number, onSelect?: (val: number) => void) => {
    return (
      <View style={styles.starRow}>
        {[1, 2, 3, 4, 5].map((val) => (
          <TouchableOpacity key={val} onPress={() => onSelect?.(val)}>
            <Text style={[styles.star, val <= selected ? styles.starActive : {}]}>
              ⭐
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  if (!book || !book.title) return <Text>Đang tải...</Text>;

  return (
    <FlatList
      ListHeaderComponent={
        <View style={styles.container}>
          {book.cover_url && <Image source={{ uri: book.cover_url }} style={styles.cover} />}
          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.author}>Tác giả: {book.author}</Text>
          <Text style={styles.rating}>⭐ {averageRating} ({comments.length} đánh giá)</Text>
          <Text style={styles.desc}>{book.description || 'Không có mô tả'}</Text>

          <Text style={styles.subjectLabel}>Chủ đề:</Text>
          <View style={styles.subjectContainer}>
            {(Array.isArray(book.subjects) ? book.subjects : JSON.parse(book.subjects)).map(
              (subj: string, idx: number) => (
                <Text key={idx} style={styles.subjectTag}>#{subj}</Text>
              )
            )}
          </View>

          <Text style={styles.commentTitle}>Đánh giá cộng đồng:</Text>
        </View>
      }
      data={comments}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.commentBox}>
          <Text style={styles.username}>{item.username}</Text>
          {renderStars(item.rating)}
          <Text>{item.content}</Text>
          <Text style={styles.time}>{item.created_at}</Text>
        </View>
      )}
      ListFooterComponent={
        <View style={{ padding: 20 }}>
          <Text>Đánh giá sách:</Text>
          {renderStars(userRating, setUserRating)}
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
  rating: { fontSize: 16, color: 'orange', marginVertical: 5 },
  commentTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  commentBox: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  input: { borderWidth: 1, padding: 10, marginTop: 10, borderRadius: 6 },
  time: { fontSize: 12, color: 'gray' },
  username: { fontWeight: 'bold' },
  subjectContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  subjectLabel: { fontWeight: 'bold', marginTop: 10 },
  subjectTag: { backgroundColor: '#eee', borderRadius: 5, padding: 4, marginRight: 5, marginTop: 5 },
  starRow: { flexDirection: 'row', marginVertical: 5 },
  star: { fontSize: 28, opacity: 0.3 },
  starActive: { opacity: 1 }
});