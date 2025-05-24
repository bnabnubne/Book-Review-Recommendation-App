import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login, register } from '../api/api';

export default function LoginScreen({ navigation }: any) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = async () => {
    try {
      console.log('Gửi login với:', { username, password });
      const res = await login(username, password);
  
      if (res.token) {
        await AsyncStorage.setItem('token', res.token);
        if (res.userId) {
          await AsyncStorage.setItem('userId', res.userId.toString());
        }
        navigation.replace('Home');
      } else {
        Alert.alert('Sai thông tin');
      }
    } catch (err) {
      console.error('❌ Lỗi đăng nhập:', err);
      Alert.alert('Lỗi đăng nhập');
    }
  };
  const handleRegister = async () => {
    try {
      const res = await register(username, email, password);
      if (res.message) {
        Alert.alert('Đăng ký thành công, hãy đăng nhập');
        setIsRegistering(false);
      }
    } catch (err) {
      Alert.alert('Lỗi đăng ký');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isRegistering ? 'Đăng ký' : 'Đăng nhập'}</Text>
      <TextInput placeholder="Username" style={styles.input} value={username} onChangeText={setUsername} />
      {isRegistering && (
        <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} />
      )}
      <TextInput
        placeholder="Mật khẩu"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title={isRegistering ? 'Đăng ký' : 'Đăng nhập'}
        onPress={isRegistering ? handleRegister : handleLogin}
      />
      <Button
        title={isRegistering ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký'}
        onPress={() => setIsRegistering(!isRegistering)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 5 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }
});
