import React from 'react';
import LoginScreen from './Screens/login.screen';
import {StyleSheet} from 'react-native';
import HomeBody from './Screens/home-body';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StartupScreen} from './Screens/startup.screen';
import GameScreen from './Screens/game.screen';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {startNetworkLogging} from 'react-native-network-logger';
import {NetworkLoggerScreen} from './Screens/networklogger.screen';

const Stack = createNativeStackNavigator();

export default function App() {
  startNetworkLogging();

  axios.interceptors.request.use(async config => {
    try {
      const token = await AsyncStorage.getItem('User');
      const accessToken = JSON.parse(token).accessToken;
      if (token) {
        config.headers.Authorization = 'Bearer ' + accessToken;
      }
      return config;
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="StartupScreen"
          component={StartupScreen}
          options={{header: () => null}}
        />
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{header: () => null}}
        />
        <Stack.Screen
          name="HomeScreen"
          component={HomeBody}
          options={{header: () => null}}
        />
        <Stack.Screen name="GameScreen" component={GameScreen} />
        <Stack.Screen
          name="NetworkLoggerScreen"
          component={NetworkLoggerScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
