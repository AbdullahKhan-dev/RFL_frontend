import AsyncStorage from '@react-native-async-storage/async-storage';

export async function isLoggedIn() {
  if (await AsyncStorage.getItem('User')) {
    return true;
  } else {
    return false;
  }
}
