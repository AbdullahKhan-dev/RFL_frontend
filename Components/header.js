import {View, StyleSheet, Text, TouchableWithoutFeedback} from 'react-native';
import React, {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function Header(props) {
  const [username, setUsername] = useState('');

  AsyncStorage.getItem('User')
    .then(user => {
      setUsername(JSON.parse(user).username);
    })
    .catch(error => {
      console.log('Error fetching user', JSON.stringify(error));
    });

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <Text style={styles.adminBadge}> Admin: {username}</Text>
        <TouchableWithoutFeedback onPress={props.signoutHandler}>
          <Text style={styles.signOutButton}>Sign Out</Text>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  signOutButton: {
    textColor: '#fff',
    backgroundColor: 'white',
    width: 90,
    textAlign: 'center',
    borderRadius: 10,
  },
  container: {
    width: '100%',
    padding: 30,
    paddingHorizontal: 50,
    backgroundColor: '#BB0D0D',
    flexDirection: 'column',
    height: 100,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 15,
    textColor: 'white',
  },
  adminBadge: {
    color: '#fff',
    fontSize: 16,
  },
});
