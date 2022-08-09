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
  FlatList,
  SafeAreaView,
} from 'react-native';
import Fixture from '../Components/fixture';
import Header from '../Components/header';
import PointsTable from '../Components/points-table';
import axios from 'axios';
import moment from 'moment';
import DateRangePicker from 'react-native-daterange-picker';
import NetworkLoggerWidget from '../Components/networklogger-widget';

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
  const [isFiltered, setIsFiltered] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [displayedDate, setDisplayedDate] = useState(moment());

  //Function that makes API calls and populates container with filtered data
  async function handleDateChange(e) {
    console.log('executing filter');
    if (e.displayedDate) {
      setDisplayedDate(e.displayedDate);
      return;
    } else if (e.date) {
      setIsFiltered(true);
      const formattedDate = moment(e.date).format(moment.HTML5_FMT.DATE);
      try {
        const response = await axios.get(
          `${baseURL}/fixtures/filter/date?date=${formattedDate}`,
        );
        if (response.data.length == 0) {
          Alert.alert('No results found for this date.');
          return;
        }

        setSelectedDate(e.date);
        const data = response.data;
        setFixtureData(data);
      } catch (error) {
        console.log('Error Filtering Results: ', error.message);
      }
    }
  }

  //pagination data Variables
  //_------------------------
  const [currentPaginationPage, setCurrentPaginationPage] = useState(1);
  const [endReachedFixture, setEndReachedFixture] = useState(false);
  const [totalPages, setTotalPages] = useState(99);

  ////
  ////  FUNCTION THAT FETCHES MORE RECORDS BY PAGINATING
  ////
  async function fetchMoreFixtures() {
    if (endReachedFixture) {
      return;
    }
    console.log(`${baseURL}/fixtures?page=${currentPaginationPage + 1}`);
    try {
      const response = await axios.get(
        `${baseURL}/fixtures?page=${currentPaginationPage + 1}`,
      );
      const data = response.data.items;
      AsyncStorage.setItem('fixtureData', JSON.stringify(data));

      console.log('executing fetch more fix');
      setFixtureData([...fixtureData, ...data]);
      setCurrentPaginationPage(currentPaginationPage + 1);
    } catch (error) {
      console.log('Error fetching more records: ', error.message);
    }
  }

  useEffect(() => {
    if (currentPaginationPage == totalPages) {
      setEndReachedFixture(true);
    }
  }, [currentPaginationPage]);

  function refreshFixtures() {
    setEndReachedFixture(false);
    setRefreshing(true);
    updateFixtureData();
    setRefreshing(false);
  }
  //
  // Function that gets fixtures data by making API calls
  // Runs everytime the page loads or
  //
  const [refreshing, setRefreshing] = useState(false);
  async function updateFixtureData() {
    try {
      const response = await axios.get(`${baseURL}/fixtures`);
      const data = response.data.items;
      setFixtureData(data);
      AsyncStorage.setItem('fixtureData', JSON.stringify(data));
      setTotalPages(response.data.meta.totalPages);
      setCurrentPaginationPage(1);
      setIsFiltered(false);
    } catch (error) {
      setFixtureData([]);
      console.log(error.message);
    }
  }
  const renderFixtures = fixture => (
    <Fixture fixture={fixture} key={fixture.id} startGame={startGame} />
  );

  async function updateTableData() {
    try {
      const response = await axios.get(`${baseURL}/table`);
      const data = response.data;
      AsyncStorage.setItem('tableData', JSON.stringify(data));
      setTableData(data);
    } catch (error) {
      setTableData([]);
    }
  }

  const renderTable = entry => <PointsTable entry={entry} key={entry.id} />;
  //
  //HAndles the code for calling and updating data to be shown based on reloads
  //and when the panel changes
  //
  //tableData
  useEffect(() => {
    if (panelToDisplay === 'fixtures') {
      setEndReachedFixture(false);
      setPanelToDisplay('fixtures');
      updateFixtureData();
    } else if (panelToDisplay === 'table') {
      setCurrentPaginationPage(2); //reset pagination page number
      updateTableData();
    }
  }, [panelToDisplay]);

  return (
    <View style={styles.wrapper}>
      <Header signoutHandler={signoutHandler} />
      <View style={styles.tabs}>
        <TouchableWithoutFeedback
          onPress={() => {
            setPanelToDisplay('fixtures');
          }}>
          <Text
            style={[
              styles.tabOptions,
              panelToDisplay === 'fixtures' && styles.borderBottom,
            ]}>
            Fixtures
          </Text>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => setPanelToDisplay('table')}>
          <Text
            style={[
              styles.tabOptions,
              panelToDisplay === 'table' && styles.borderBottom,
            ]}>
            Points Table
          </Text>
        </TouchableWithoutFeedback>
      </View>

      <View style={styles.panelHeader}>
        {panelToDisplay === 'fixtures' && fixtureData.length != 0 && (
          <DateRangePicker
            containerStyle={styles.calendarContainer}
            backdropStyle={styles.backdropStyle}
            onChange={handleDateChange}
            displayedDate={displayedDate}
            date={selectedDate}>
            <Text style={styles.filterButton}> Filter </Text>
          </DateRangePicker>
        )}
        <Text style={styles.title}>
          {panelToDisplay == 'fixtures' ? 'FIXTURES' : 'POINTS TABLE'}
        </Text>
      </View>
      <SafeAreaView style={styles.container}>
        {panelToDisplay === 'fixtures' && fixtureData.length != 0 && (
          <FlatList
            data={fixtureData}
            renderItem={renderFixtures}
            keyExtractor={item => item.id}
            onEndReached={!isFiltered && fetchMoreFixtures}
            onRefresh={refreshFixtures}
            refreshing={refreshing}
          />
        )}

        {panelToDisplay === 'table' && (
          <FlatList
            data={tableData}
            renderItem={renderTable}
            keyExtractor={item => item.id}
          />
        )}
        {panelToDisplay === 'fixtures' && fixtureData.length == 0 && (
          <Text style={{textAlign: 'center'}}>
            Could not find any results to be displayed
          </Text>
        )}
      </SafeAreaView>
      {/* <NetworkLoggerWidget /> */}
    </View>
  );
}
const styles = StyleSheet.create({
  panelHeader: {
    width: '100%',
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
  },
  wrapper: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButton: {
    position: 'absolute',
    top: 18,
    right: 120,
    marginTop: 5,
    padding: 2,
    textAlign: 'left',
    backgroundColor: '#D8D8D8',
    borderRadius: 5,
  },
  container: {
    width: '100%',
    paddingBottom: 50,
    paddingHorizontal: 30,
    height: '69%',
  },
  title: {
    marginVertical: 20,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#BB0D0D',
  },
  tabs: {
    width: '100%',
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
    textAlign: 'center',
    paddingBottom: 15,
  },

  borderBottom: {
    borderBottomWidth: 4,
    borderBottomColor: '#fff',
  },

  backdropStyle: {
    height: 700,
  },
  calendarContainer: {
    height: 500,
    transform: [{translateY: -70}],
  },
});
