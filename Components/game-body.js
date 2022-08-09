import {View, StyleSheet, Text, Button, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';

export default function GameScreenBody(props) {
  const homeTeam = props.fixture.homeTeam.teamName;
  const awayTeam = props.fixture.awayTeam.teamName;
  const [homeTeamScore, setHomeTeamScore] = useState(0);
  const [awayTeamScore, setAwayTeamScore] = useState(0);

  function addHomeTeamScore() {
    if (!props.isStarted || props.isEnded) {
      return;
    }
    setHomeTeamScore(homeTeamScore + 1);
  }

  function addAwayTeamScore() {
    if (!props.isStarted || props.isEnded) {
      return;
    }
    setAwayTeamScore(awayTeamScore + 1);
  }

  function subtractHomeTeamScore() {
    if (!props.isStarted || props.isEnded) {
      return;
    }
    setHomeTeamScore(prev => {
      if (prev == 0) {
        return prev;
      } else {
        return prev - 1;
      }
    });
  }

  function subtractAwayTeamScore() {
    if (!props.isStarted || props.isEnded) {
      return;
    }
    setAwayTeamScore(prev => {
      if (prev == 0) {
        return prev;
      } else {
        return prev - 1;
      }
    });
  }

  useEffect(() => {
    props.updateHomeTeamScore(homeTeamScore);
    props.updateAwayTeamScore(awayTeamScore);
  }, [homeTeamScore, awayTeamScore]);
  return (
    <View style={styles.header}>
      <View
        style={{
          ...styles.row,
          borderBottomWidth: 2,
          borderBottomColor: '#D8D8D8',
        }}>
        <Text style={{...styles.teamLabel, textAlign: 'left'}}>
          {' '}
          {homeTeam}{' '}
        </Text>
        <Text style={{flex: 2, paddingTop: 15, textAlign: 'center'}}> VS </Text>
        <Text style={{...styles.teamLabel, textAlign: 'right'}}>
          {awayTeam}
        </Text>
      </View>
      <View style={styles.row}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={addHomeTeamScore}
            style={styles.scoreButton}>
            <Text style={styles.buttonText}> +</Text>
          </TouchableOpacity>
          <Text style={styles.scoreLabel}>{homeTeamScore}</Text>
          <TouchableOpacity
            onPress={subtractHomeTeamScore}
            style={styles.scoreButton}>
            <Text style={styles.buttonText}> -</Text>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={addAwayTeamScore}
            style={styles.scoreButton}>
            <Text style={styles.buttonText}> +</Text>
          </TouchableOpacity>
          <Text style={styles.scoreLabel}>{awayTeamScore}</Text>
          <TouchableOpacity
            onPress={subtractAwayTeamScore}
            style={styles.scoreButton}>
            <Text style={styles.buttonText}> -</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  header: {
    paddingVertical: 70,
    flexDirection: 'column',
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },

  scoreLabel: {
    fontSize: 35,
  },
  teamLabel: {
    flex: 2,
    fontSize: 28,
    paddingTop: 10,
    textAlign: 'center',
    color: 'black',
    width: 30,
  },
  buttonText: {
    paddingTop: 5,
    width: 30,
    fontSize: 30,
    fontWeight: '1000',
    color: '#4284f5',
  },
  scoreButton: {},
});
