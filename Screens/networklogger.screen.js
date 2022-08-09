import NetworkLogger from 'react-native-network-logger';
import React from 'react';
import {StyleSheet} from 'react-native';

export function NetworkLoggerScreen({navigation}) {
  return (
    <NetworkLogger
      theme={{
        colors: {
          background: 'white',
        },
      }}
    />
  );
}

const styles = StyleSheet.create({});
