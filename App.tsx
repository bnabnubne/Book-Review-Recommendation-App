import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import BookDetailScreen from './src/screens/BookDetailScreen';
import ContactScreen from './src/screens/ContactScreen';
import { TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: true }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen}
          options={({ navigation }) => ({
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('Contact')} style={{ marginRight: 15 }}>
                <Text style={{ color: 'black' }}>Liên hệ</Text>
              </TouchableOpacity>
            ) })}
        
        />
        <Stack.Screen name="BookDetail" component={BookDetailScreen}
          options={({ navigation }) => ({
            title: 'Chi tiết sách',
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('Contact')} style={{ marginRight: 15 }}>
                <Text style={{ color: 'black' }}>Liên hệ</Text>
              </TouchableOpacity>
            )
          })}
           />
        <Stack.Screen name="Contact" component={ContactScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}