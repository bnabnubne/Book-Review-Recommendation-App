import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

export default function ContactScreen() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    Alert.alert('Đã gửi!', 'Cảm ơn bạn đã liên hệ.');
    setName('');
    setMessage('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liên hệ</Text>
      <TextInput
        style={styles.input}
        placeholder="Họ và tên"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Nội dung liên hệ"
        value={message}
        onChangeText={setMessage}
        multiline
      />
      <Button title="Gửi liên hệ" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
});