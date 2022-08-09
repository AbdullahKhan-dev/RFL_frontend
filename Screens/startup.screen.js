import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Image} from 'react-native';

export function StartupScreen({navigation}) {
  const logo = require('../Assets/logo.png');
  const [route, setRoute] = useState(false);
  AsyncStorage.getItem('User')
    .then(user => {
      setTimeout(() => {
        /// if user i=> is logged in
        if (user != null) {
          navigation.replace('HomeScreen', {panelToDisplay: 'fixtures'});
        } else {
          navigation.replace('LoginScreen');
        }
      }, 1000);
    })
    .catch(error => {
      console.log(error.message);
    });

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={logo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 160,
    height: 160,
  },
});
