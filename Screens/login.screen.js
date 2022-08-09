import React, {useEffect, useState} from 'react';
import {baseURL} from '../shared/constants';
import {
  Image,
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  Touchable,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function LoginScreen({navigation}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSignedUp, setIsSignedUp] = useState(true);
  const logo = require('../Assets/logo.png');

  async function registerLogin() {
    if (username.trim() === '' || password === '') {
      return;
    }
    const uninterceptedAxiosInstance = axios.create();
    uninterceptedAxiosInstance
      .post(
        `${baseURL}/auth/sign-in`,
        {username, password},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .then(async function (response) {
        const usr = {
          username: username,
          accessToken: response.data.accessToken,
        };
        await AsyncStorage.setItem('User', JSON.stringify(usr));
        console.log(JSON.parse(await AsyncStorage.getItem('User')));
        navigation.replace('HomeScreen', {panelToDisplay: 'fixtures'});
      })
      .catch(function (error) {
        console.log(JSON.stringify(error.message));
        Alert.alert('Invalid Credentials');
      });
  }

  async function registerSignin() {
    if (username === '' || password === '') {
      return;
    }

    const uninterceptedAxiosInstance = axios.create();
    uninterceptedAxiosInstance
      .post(
        `${baseURL}/auth/sign-up`,
        {username, password},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .then(function (response) {
        console.log('signin registered');
        registerLogin();
      })
      .catch(function (error) {
        if (error.code === 'ERR_BAD_REQUEST') {
          Alert.alert('Username or password too weak');
        }
      });
  }
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image style={styles.logo} source={logo} />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            maxLength={20}
            placeholderTextColor="#D8D8D8"
          />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            placeholder="Password"
            placeholderTextColor="#D8D8D8"
          />
          <View style={styles.buttonContainer}>
            {isSignedUp && (
              <TouchableWithoutFeedback
                style={styles.button}
                onPress={registerLogin}>
                <Text style={styles.buttonText}>Log in</Text>
              </TouchableWithoutFeedback>
            )}
            {!isSignedUp && (
              <TouchableWithoutFeedback
                style={styles.button}
                onPress={registerSignin}>
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableWithoutFeedback>
            )}
          </View>

          <TouchableOpacity
            style={styles.bottomLink}
            onPress={() => setIsSignedUp(false)}>
            {isSignedUp && (
              <View>
                <Text>Not signed up? Register</Text>
              </View>
            )}
          </TouchableOpacity>
          {!isSignedUp && (
            <TouchableOpacity
              style={styles.bottomLink}
              onPress={() => setIsSignedUp(true)}>
              <View>
                <Text>Go Back to Login</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  logoContainer: {marginBottom: 70, marginTop: 50},
  logo: {width: 160, height: 160},
  bottomLink: {
    padding: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 80,
    backgroundColor: '#BB0D0D',
    width: '40%',
    height: 40,
    borderRadius: 5,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    lineHeight: 40,
    textAlign: 'center',
    color: '#fff',
    fontSize: 15,
  },
  screen: {
    padding: 20,
  },
  container: {
    paddingTop: 50,
    alignItems: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    margin: 12,
    borderBottomColor: '#AAAAAA',
    borderBottomWidth: 1,
    padding: 10,
  },
});
