import * as React from 'react';
import {Wrapper} from './style';
import {Colors} from '../../theme';
import moment from 'moment';
import DateRangePicker from 'react-native-daterange-picker';
import {useTranslation} from 'react-i18next';
import {FlatList, Text, View, TouchableOpacity, Alert} from 'react-native';
import {en} from '../../i18n/locales';
export const AppDatePickerProps = {
  onOpen: Function,
  isOpen: boolean,
  isFirst: boolean,
  range: boolean,
  startDate: Date,
  endDate: Date,
  date: Date,
  setStartDate: Function,
  setEndDate: Function,
  setDate: Function,
};
export const AppDatePicker: React.FC<AppDatePickerProps> = ({
  onOpen,
  isOpen,
  range,
  startDate,
  endDate,
  date,
  setEndDate,
  setStartDate,
  setDate,
  isFirst,
}) => {
  const [displayDate, setDisplayDate] = React.useState(moment());
  const [isChange, setIsChange] = React.useState(false);
  const onChange = e => {
    if (e.endDate) {
      setIsChange(true);
      setEndDate && setEndDate(e.endDate);
    } else if (e.startDate) {
      setStartDate && setStartDate(e.startDate);
    } else if (e.date) {
      setStartDate && setStartDate(e.date);
    } else if (e.displayedDate) {
      setDisplayDate(e.displayedDate);
    } else {
      setDate && setDate(e.Date);
    }
  };
  return (
    <Wrapper>
      <DateRangePicker
        backdropStyle={{
          backgroundColor: Colors.WhiteOpacity('0.2'),
        }}
        isOpen={isOpen}
        onOpen={() => {
          onOpen(!isOpen);
        }}
        onChange={onChange}
        date={date}
        endDate={endDate}
        startDate={startDate}
        displayedDate={displayDate}
        range={range}
        isFirst={isFirst}
        isChange={isChange}
      />
    </Wrapper>
  );
};
