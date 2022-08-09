import AsyncStorage from '@react-native-async-storage/async-storage';
import {baseURL} from '../shared/constants';
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
  Alert,
  Button,
  Modal,
  Pressable,
} from 'react-native';
import Fixture from '../Components/fixture';
import Header from '../Components/header';
import PointsTable from '../Components/points-table';
import axios from 'axios';
import {TouchableOpacity} from 'react-native-gesture-handler';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';
import DateRangePicker from 'react-native-daterange-picker';

export default function HomeBody({route, navigation}) {
  function startGame(data) {
    navigation.navigate('GameScreen', {
      fixture: {...data},
    });
  }

  function signoutHandler() {
    AsyncStorage.removeItem('User').then(() => {
      navigation.replace('LoginScreen');
    });
  }

  ///
  /// Important page states
  ///
  const [panelToDisplay, setPanelToDisplay] = useState(
    route.params.panelToDisplay,
  );
  const [fixtureData, setFixtureData] = useState([]);
  const [tableData, setTableData] = useState([]);

  //    CALENDAR
  // Calendar date stored as state to be used for filtering
  //
  const [displayFilterButton, setDisplayFilterButton] = useState(
    panelToDisplay === 'fixtures',
  );
  const [selectedDate, setSelectedDate] = useState(moment('2022-08-01'));
  const [displayCalendar, setDisplayCalendar] = useState(false);

  //Function that makes API calls and populates container with filtered data
  function handleDateChange(date) {
    setDisplayCalendar(false);
    setSelectedDate(date.date);
    const formattedDate = moment(date.date).format(moment.HTML5_FMT.DATE);
    console.log(
      'date in func: ',
      formattedDate,
      '  selected date state: ',
      moment(selectedDate).format(moment.HTML5_FMT.DATE),
    );
    if (formattedDate === moment(selectedDate).format(moment.HTML5_FMT.DATE)) {
      return;
    }

    AsyncStorage.getItem('User')
      .then(user => {
        const accessToken = JSON.parse(user).accessToken;
        axios
          .get(`${baseURL}/fixtures/filter/date?date=${formattedDate}`, {
            headers: {Authorization: `Bearer ${accessToken}`},
          })
          .then(response => {
            if (response.data.length == 0) {
              Alert.alert(
                'No results found for this date. Displaying all results instead',
              );
              return;
            }
            const data = response.data;
            let temp = [];
            temp = data.map(fixture => {
              return (
                <Fixture
                  fixture={fixture}
                  key={fixture.id}
                  startGame={startGame}
                />
              );
            });
            setFixtureData(temp);
          })
          .catch(error => {
            if (error.code == 401) {
              Alert.alert('Unauthorized. Please Login');
              navigation.replace('HomeScreen');
            } else {
              AsyncStorage.getItem('fixtureData')
                .then(data => setFixtureData(data))
                .catch(error => {
                  setFixtureData([]);
                });
            }
          });
      })
      .catch(error => {
        navigation.replace('HomeScreen');
      });
  }

  //pagination data Variables
  //_------------------------
  const [currentPaginationPage, setCurrentPaginationPage] = useState(2);
  const [displayMoreButton, setViewMoreButton] = useState(
    panelToDisplay === 'fixtures',
  );
  const [totalPages, setTotalPages] = useState(99);
  const [totalItems, setTotalItems] = useState(0);

  ////
  ////  FUNCTION THAT FETCHES MORE RECORDS BY PAGINATING
  ////
  async function fetchMoreFixtures() {
    console.log(`total pages: ${totalPages}`);
    console.log(`current pagination page: ${currentPaginationPage}`);
    //
    if (totalItems === fixtureData.length) {
      Alert.alert('No more records to show');
      setViewMoreButton(false);
      return;
    }

    //1- use interceptor to avoid having to get access token for every request
    //2- use checks on page number instead of length
    //3- fix calendar
    //4- incorporate flat list instead of scroll view

    console.log(`${baseURL}/fixtures?page=${currentPaginationPage}`);
    AsyncStorage.getItem('User')
      .then(user => {
        const accessToken = JSON.parse(user).accessToken;
        axios
          .get(`${baseURL}/fixtures?page=${currentPaginationPage}`, {
            headers: {Authorization: `Bearer ${accessToken}`},
          })
          .then(response => {
            const data = response.data.items;
            setTotalPages(response.data.meta.totalPages);
            let temp = [];
            temp = data.map(fixture => {
              return (
                <Fixture
                  fixture={fixture}
                  key={fixture.id}
                  startGame={startGame}
                />
              );
            });
            AsyncStorage.setItem('fixtureData', JSON.stringify(temp));
            setFixtureData([...fixtureData, ...temp]);
            setCurrentPaginationPage(prev => prev + 1);
          });
      })
      .catch(error => {
        navigation.replace('HomeScreen');
      });
  }

  //
  // Function that gets fixtures data by making API calls
  // Runs everytime the page loads or
  //
  async function updateFixtureData() {
    AsyncStorage.getItem('User')
      .then(user => {
        const accessToken = JSON.parse(user).accessToken;
        axios
          .get(`${baseURL}/fixtures`, {
            headers: {Authorization: `Bearer ${accessToken}`},
          })
          .then(response => {
            const data = response.data.items;
            let temp = [];
            temp = data.map(fixture => {
              return (
                <Fixture
                  fixture={fixture}
                  key={fixture.id}
                  startGame={startGame}
                />
              );
            });
            AsyncStorage.setItem('fixtureData', JSON.stringify(temp));
            setFixtureData([...temp]);
            setTotalItems(response.data.meta.totalItems);
            setViewMoreButton(true);
            setCurrentPaginationPage(2);
          })
          .catch(error => {
            if (error.code == 401) {
              Alert.alert('Unauthorized. Please Login');
              navigation.replace('HomeScreen');
            } else {
              AsyncStorage.getItem('fixtureData')
                .then(data => setFixtureData(data))
                .catch(error => {
                  setFixtureData([]);
                });
            }
          });
      })
      .catch(error => {
        navigation.replace('HomeScreen');
      });
  }

  async function updateTableData() {
    AsyncStorage.getItem('User').then(user => {
      const accessToken = JSON.parse(user).accessToken;
      axios
        .get(`${baseURL}/table`, {
          headers: {Authorization: `Bearer ${accessToken}`},
        })
        .then(response => {
          const data = response.data;
          let temp = [];
          temp = data.map(entry => {
            return <PointsTable entry={entry} key={entry.id} />;
          });
          AsyncStorage.setItem('tableData', JSON.stringify(temp));
          setTableData(temp);
        })
        .catch(error => {
          if (error.code == 401) {
            Alert.alert('Unauthorized. Please Login');
            navigation.replace('HomeScreen');
          } else {
            AsyncStorage.getItem('tableData')
              .then(data => setTableData(data))
              .catch(error => {
                setTableData([]);
              });
          }
        });
    });
  }

  //
  //HAndles the code for calling and updating data to be shown based on reloads
  //and when the panel changes
  //
  //tableData
  useEffect(() => {
    if (panelToDisplay === 'fixtures') {
      setDisplayFilterButton(true);
      setViewMoreButton(true);
      setPanelToDisplay('fixtures');
      updateFixtureData();
    } else if (panelToDisplay === 'table') {
      setDisplayFilterButton(false);
      setViewMoreButton(false);
      updateTableData();
    }
  }, [panelToDisplay]);

  return (
    <ScrollView>
      <Header signoutHandler={signoutHandler} />
      <View style={styles.tabs}>
        <TouchableWithoutFeedback
          onPress={() => {
            setPanelToDisplay('fixtures');
          }}>
          <Text style={styles.tabOptions}>Fixtures</Text>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => setPanelToDisplay('table')}>
          <Text style={styles.tabOptions}>Points Table</Text>
        </TouchableWithoutFeedback>
      </View>

      <View style={styles.calendarContainer}>
        <DateRangePicker
          onChange={handleDateChange}
          displayedDate={moment()}
          date={moment(selectedDate)}></DateRangePicker>
      </View>

      <ScrollView style={styles.container} scrollEventThrottle={400}>
        <Text style={styles.title}> {panelToDisplay} </Text>
        {panelToDisplay === 'fixtures' && fixtureData}
        {panelToDisplay === 'table' &&npm i @react-native-community/datetimepicker tableData}
      </ScrollView>
      {displayMoreButton && (
        <Button title=" View More" onPress={fetchMoreFixtures} />
      )}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  filterButton: {
    width: '50',
    backgroundColor: 'red',
  },
  container: {width: '100%', padding: 30},
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    textColor: '#BB0D0D',
  },
  tabs: {
    padding: 40,
    backgroundColor: '#BB0D0D',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 15,
    paddingBottom: 10,
    textColor: 'white',
  },

  tabOptions: {
    color: '#fff',
    width: '40%',
    fontSize: 18,
    borderBottomWidth: 4,
    borderBottomColor: '#fff',
    textAlign: 'center',
    paddingBottom: 15,
  },

  closeCalendarButton: {
    textAlign: 'center',
    color: 'red',
    fontWeight: 'bold',
  },
  calendarContainer: {
    paddingTop: 40,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9,
  },
});
