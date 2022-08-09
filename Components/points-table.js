import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
export default function PointsTable(props) {
  return (
    <View style={styles.card}>
      <Text style={styles.team}>{props.entry.item.team.teamName}</Text>
      <Text style={styles.col}>Pl:{props.entry.item.played}</Text>
      <Text style={styles.col}>W:{props.entry.item.won}</Text>
      <Text style={styles.col}>D:{props.entry.item.drawn}</Text>
      <Text style={styles.col}>L:{props.entry.item.lost}</Text>
      <Text style={styles.col}>Pts:{props.entry.item.points}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    width: '100%',
    padding: 7,
    backgroundColor: '#D8D8D8',
    borderRadius: 7,
    marginTop: 3,
    marginBottom: 3,
  },

  col: {
    flex: 1,
  },

  team: {
    flex: 2,
    fontSize: 15,
    fontWeight: 'bold',
    textColor: '#BB0D0D',
  },
});
