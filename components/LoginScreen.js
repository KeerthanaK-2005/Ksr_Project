import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);

const handleLogin = async () => {
  if (!email || !password) {
    Alert.alert('Error', 'Please enter both email and password');
    return;
  }

  try {
    const response = await fetch('http://10.0.2.2:3001/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    console.log('📥 Login response:', data); // ✅ log backend response

    if (response.ok) {
      await AsyncStorage.setItem('accessToken', data.accessToken);
      await AsyncStorage.setItem('refreshToken', data.refreshToken);
      await AsyncStorage.setItem('userId', data.userId.toString());

      console.log('✅ Stored access token:', data.accessToken); // ✅ check stored value
      onLoginSuccess(data);
    } else {
      console.warn('❌ Login failed:', data.error);
      Alert.alert('Login Failed', data.error || 'Invalid credentials');
    }
  } catch (error) {
    console.error('🚨 Login error:', error);
    Alert.alert('Error', 'Something went wrong. Please try again.');
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Matrimony Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputPassword}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry={hidePassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
          <Icon name={hidePassword ? 'eye-off' : 'eye'} size={22} color="#999" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#FF6B6B',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    color: '#000',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    height: 50,
  },
  inputPassword: {
    flex: 1,
    color: '#000',
  },
  loginButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
