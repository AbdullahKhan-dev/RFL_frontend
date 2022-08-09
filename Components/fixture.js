import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
export default function Fixture(props) {
  function pressHandler() {
    console.log('Game started on fixture: ', props.fixture.item);
    props.startGame(props.fixture.item);
  }
  return (
    <TouchableOpacity
      key={props.fixture.item.id}
      onPress={pressHandler}
      disabled={props.fixture.item.ended}>
      <View style={props.fixture.item.ended ? styles.disabled : styles.card}>
        <Text style={styles.teamHome}>
          {props.fixture.item.homeTeam.teamName}
        </Text>
        {!props.fixture.item.ended && (
          <Text style={styles.date}>{props.fixture.item.date}</Text>
        )}
        {props.fixture.item.ended && (
          <Text style={styles.date}>{props.fixture.item.result}</Text>
        )}
        <Text style={styles.teamAway}>
          {props.fixture.item.awayTeam.teamName}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  disabled: {
    flexDirection: 'row',
    width: '100%',
    padding: 7,
    backgroundColor: '#D8D8D8',
    borderRadius: 7,
    marginTop: 3,
    height: 50,
    alignItems: 'center',
    marginBottom: 3,
    justifyContent: 'space-evenly',
    opacity: 0.6,
  },
  card: {
    flexDirection: 'row',
    width: '100%',
    height: 50,
    alignItems: 'center',
    padding: 7,
    backgroundColor: '#D8D8D8',
    borderRadius: 7,
    marginTop: 3,
    marginBottom: 3,
    justifyContent: 'space-evenly',
  },

  date: {
    flex: 1,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#BB0D0D',
    textAlign: 'center',
  },

  teamAway: {
    textAlign: 'right',
  },
});
