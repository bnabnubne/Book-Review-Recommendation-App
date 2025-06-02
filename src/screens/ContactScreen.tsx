import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
} from 'react-native';

export default function ContactScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!name.trim() || !message.trim()) {
      Alert.alert('Vui lòng nhập tên và nội dung góp ý.');
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert('Email không hợp lệ.');
      return;
    }
    setSending(true);
    try {
      const res = await fetch('http://10.0.2.2:4000/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      const result = await res.json();
      if (res.ok) {
        Alert.alert(result.message || 'Gửi góp ý thành công!');
        setName('');
        setEmail('');
        setMessage('');
        Keyboard.dismiss();
      } else {
        Alert.alert(result.message || 'Gửi góp ý thất bại!');
      }
    } catch (err) {
      Alert.alert('Lỗi', 'Không gửi được góp ý');
    }
    setSending(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Góp ý & Liên hệ</Text>
      <Text style={styles.desc}>Hãy cho chúng tôi biết ý kiến hoặc vấn đề của bạn!</Text>
      <TextInput
        style={styles.input}
        placeholder="Tên của bạn *"
        value={name}
        onChangeText={setName}
        autoCorrect={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Email (tùy chọn)"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Nhập nội dung góp ý *"
        value={message}
        onChangeText={setMessage}
        multiline
        numberOfLines={5}
        textAlignVertical="top"
      />

      <TouchableOpacity
        style={[styles.button, sending && { backgroundColor: '#aaa' }]}
        onPress={handleSend}
        disabled={sending}
        activeOpacity={0.7}
      >
        {sending ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Gửi góp ý</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 8, color: '#542e71' },
  desc: { color: '#555', marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    backgroundColor: '#fafafa',
    padding: 12,
    marginBottom: 14,
    borderRadius: 10,
    fontSize: 16,
  },
  textArea: {
    height: 110,
    marginBottom: 18,
  },
  button: {
    backgroundColor: '#542e71',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 5,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 0.5,
  },
});