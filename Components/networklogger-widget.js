import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {TouchableOpacity, View} from 'react-native';

export default function NetworkLoggerWidget(props) {
  return (
    <View>
      <TouchableOpacity
        style={styles.widget}
        onPress={() => props.navigation.navigate('NetworkLoggerScreen')}>
        <Text> Network Logger </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  widget: {
    backgroundColor: 'red',
    position: 'absolute',
    bottom: 20,
    borderRadius: 20,
    height: 50,
    textAlign: 'center',
    color: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    borderWidth: 1,
    borderColor: 'black',
  },
});
