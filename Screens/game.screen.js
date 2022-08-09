import React, {useState, useEffect} from 'react';
import {Button, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import GameScreenBody from '../Components/game-body';
import GameTimer from '../Components/game-timer';
import {baseURL} from '../shared/constants';
import axios from 'axios';
import {ResultsEnum} from '../shared/resultsEnum';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetworkLoggerWidget from '../Components/networklogger-widget';
export default function GameScreen({route, navigation}) {
  const [isStarted, setIsStarted] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [homeTeamScore, setHomeTeamScore] = useState(0);
  const [awayTeamScore, setAwayTeamScore] = useState(0);
  const [displayBackButton, setDisplayBackButton] = useState(false);

  useEffect(() => {
    const {id, date} = route.params.fixture;
    const homeTeam = route.params.fixture.homeTeam.teamName;
    const awayTeam = route.params.fixture.awayTeam.teamName;

    if (isEnded) {
      let resultHome = {teamName: homeTeam, thisResult: ''};
      let resultAway = {teamName: awayTeam, thisResult: ''};

      if (homeTeamScore > awayTeamScore) {
        resultHome.thisResult = ResultsEnum.won;
        resultAway.thisResult = ResultsEnum.lost;
      } else if (homeTeamScore < awayTeamScore) {
        resultHome.thisResult = ResultsEnum.lost;
        resultAway.thisResult = ResultsEnum.won;
      } else {
        resultHome.thisResult = ResultsEnum.drawn;
        resultAway.thisResult = ResultsEnum.drawn;
      }
      AsyncStorage.getItem('User').then(user => {
        const accessToken = JSON.parse(user).accessToken;
        axios
          .patch(`${baseURL}/table`, resultHome, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then(() => {
            console.log('Home Team Patched:', resultHome);
            axios
              .patch(`${baseURL}/table`, resultAway, {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${accessToken}`,
                },
              })
              .then(() => {
                const combinedResult = `${homeTeamScore} -  ${awayTeamScore}`;
                console.log('Away Team Patched:', resultAway);
                axios.patch(
                  `${baseURL}/fixtures/${id}`,
                  {
                    ended: true,
                    result: combinedResult,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${accessToken}`,
                    },
                  },
                );
              })
              .catch(function (error) {
                console.log(JSON.stringify(error));
              });
          })
          .catch(function (error) {
            console.log(JSON.stringify(error));
          });

        setDisplayBackButton(true);
      });
    }
  }, [isEnded]);

  function backButtonHandler() {
    navigation.replace('HomeScreen', {panelToDisplay: 'table'});
  }
  return (
    <View style={styles.container}>
      <GameScreenBody
        fixture={route.params.fixture}
        isStarted={isStarted}
        isEnded={isEnded}
        updateHomeTeamScore={setHomeTeamScore}
        updateAwayTeamScore={setAwayTeamScore}
      />
      <GameTimer
        startGameState={setIsStarted} //helps the child component determine whether game is started or not
        endGameState={setIsEnded} //allows child component to alter parent's state to set the match equal to ended
      />
      {displayBackButton && (
        <TouchableOpacity
          onPress={backButtonHandler}
          style={styles.goBackButton}>
          <Text style={styles.goBackButtonText}> {'<'} Go Back </Text>
        </TouchableOpacity>
      )}

      {/* <NetworkLoggerWidget navigation={navigation} /> */}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 30,
  },
  goBackButton: {
    textAlign: 'center',
  },
  goBackButtonText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#6E6E6E',
  },
  button: {
    backgroundColor: 'green',
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
  },
});
