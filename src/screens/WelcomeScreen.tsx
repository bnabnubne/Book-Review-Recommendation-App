import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

export default function WelcomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📚 Bookify </Text>
      <Text style={styles.subtitle}>Khám phá và chia sẻ những cuốn sách yêu thích</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Bắt đầu</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFE7DA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 38,
    fontWeight: '600',
    color: '#7D5A50',
    marginBottom: 10,
    fontFamily: 'serif'
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#5A4A42',
    marginBottom: 40
  },
  button: {
    backgroundColor: '#BFAS97',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500'
  }
});