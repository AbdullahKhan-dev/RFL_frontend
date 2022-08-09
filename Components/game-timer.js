import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import Timer from 'react-native-stopwatch-timer/lib/timer';
import {GAME_LENGTH} from '../shared/constants';

export default function GameTimer(props) {
  const [startTimer, setStartTimer] = useState(false);
  const [buttonText, setButtonText] = useState('Start');
  const [disableButton, setDisableButton] = useState(false);

  function handleTimerComplete() {
    setStartTimer(false);
    setButtonText('Match Ended');
    props.endGameState(true);
  }

  function startHandler() {
    setStartTimer(true);
    setButtonText('');
    setDisableButton(true);
    props.startGameState(true);
  }

  const timerStyles = {
    container: {
      backgroundColor: '#4284f5',
      width: 100,
      height: 30,
    },
    text: {
      color: '#fff',
      fontSize: 25,
    },
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback disabled={disableButton} onPress={startHandler}>
        <View style={styles.button}>
          {startTimer && (
            <Timer
              options={timerStyles}
              totalDuration={GAME_LENGTH}
              msecs
              start={startTimer}
              handleFinish={handleTimerComplete}
            />
          )}
          <Text style={styles.buttonText}>{buttonText}</Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#4284f5',
    width: 150,
    height: 150,
    borderRadius: 100,
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
  },
});
