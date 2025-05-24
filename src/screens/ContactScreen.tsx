import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ContactScreen() {
  const [message, setMessage] = useState('');

  const handleSend = async () => {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) return Alert.alert('Bạn cần đăng nhập');

    try {
      const res = await fetch('http://10.0.2.2:4000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: parseInt(userId), message })
      });
      const result = await res.json();
      Alert.alert(result.message || 'Đã gửi góp ý thành công');
      setMessage('');
    } catch (err) {
      Alert.alert('Lỗi', 'Không gửi được góp ý');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Góp ý / Liên hệ:</Text>
      <TextInput
        style={styles.input}
        multiline
        numberOfLines={4}
        value={message}
        onChangeText={setMessage}
        placeholder="Nhập nội dung liên hệ..."
      />
      <Button title="Gửi" onPress={handleSend} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontSize: 18, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 8,
    textAlignVertical: 'top'
  }
});
