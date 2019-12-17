import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Button, Slider, SafeAreaView, Picker, Text, ToastAndroid } from 'react-native';
import { Defs, LinearGradient, Stop } from 'react-native-svg'
import { LineChart, Grid, XAxis, YAxis } from 'react-native-svg-charts'

import DateTimePicker from "react-native-modal-datetime-picker";
import * as shape from 'd3-shape'

import CalendarPicker from 'react-native-calendar-picker'
import RNPickerSelect from 'react-native-picker-select';


import moment from 'moment-timezone'
import Axios from 'axios';

function Separator() {
  return <View style={styles.separator} />;
}

export default function LinksScreen() {

  const [data, setData] = useState([4, 3, 1])

  const [selected, setSelected] = useState(null)

  const sensors = [
    { name: 'GP2Y10', id: 1, arduinoId: 1 },
    { name: 'DHT11_T', id: 2, arduinoId: 1 },
    { name: 'DHT11_H', id: 2, arduinoId: 1 }
  ]

  useEffect(() => {
  })


  const Gradient = () => (
    <Defs key={'gradient'}>
      <LinearGradient id={'gradient'} x1={'0'} y={'0%'} x2={'100%'} y2={'0%'}>
        <Stop offset={'0%'} stopColor={'rgb(134, 65, 244)'} />
        <Stop offset={'100%'} stopColor={'rgb(66, 194, 244)'} />
      </LinearGradient>
    </Defs>
  )

  function onDateChange(date) {
    let start = moment(date).tz('Asia/Ho_Chi_Minh').format('x')

    if (selected)
      Axios
        .get(`http://springbooteb1-env.rzpga2pgvr.us-east-1.elasticbeanstalk.com/arduino/log2?date=${start}&arduinoId=${selected.arduinoId}&sensorId=${selected.id}`)
        .then(response => {
          let new_data = response.data.map(u => (u.value))
          console.log(new_data)
          setData(new_data)
        })
        .catch(err => {
          ToastAndroid.show('Error' + err.response.status, ToastAndroid.SHORT)
        })
  }

  return (

    <SafeAreaView style={styles.container}>

      {/* Đồ thị */}
      <View style={{ flexDirection: 'row', padding: 10 }}>
        <YAxis
          data={data}
          style={{ paddingBottom: 10 }}
          contentInset={{ top: 20, bottom: 10 }}
          svg={{
            fill: 'grey',
            fontSize: 10,
          }}
          numberOfTicks={10}
          formatLabel={(value) => `${value}`}
        />
        <View style={{ height: 200, flexDirection: 'column', flex: 1 }}>
          <LineChart
            data={data}
            style={{ flex: 1, marginLeft: 8 }}
            contentInset={{ top: 20, bottom: 20 }}
            svg={{
              strokeWidth: 2,
              stroke: 'url(#gradient)',
            }}
            curve={shape.curveNatural}
          >
            <Grid />
            <Gradient />
          </LineChart>
        </View>

      </View>
      {/* End Đồ Thị */}

      <View style={styles.container}>
        <View style={styles.inputAndroid}>
          <RNPickerSelect
            onValueChange={(value) => setSelected(value)}
            items={sensors.map(u => ({ label: u.name, value: u }))}
          />
        </View>
        <CalendarPicker
          onDateChange={onDateChange}
        />
      </View>
    </SafeAreaView>

  );
}


LinksScreen.navigationOptions = {
  title: 'Graph',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'column',
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  inputAndroid: {
    marginLeft: 40,
    marginRight: 40,
    marginBottom: 20,
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'blue',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  }
});


function getListTime(fromTime, toTime) {
  let listTime = [];
  let startTime = fromTime;
  while (startTime <= toTime) {
    listTime.push(startTime);
    startTime += 30 * 60 * 1000;
  }
  return listTime;
}

function convertData(listTime, listData) {
  let output = [];
  listTime.forEach(function print(time1) {
    let time2 = time1 - 15 * 60 * 1000;
    let time3 = time1 + 15 * 60 * 1000;
    let valueSum = 0;
    let valueAve = 0;
    let count = 0;
    listData.forEach(function loop(arduino) {
      if (arduino.createtime >= time2 && arduino.createtime < time3) {
        count++;
        valueSum += arduino.value;
      }
      valueAve = count == 0 ? 0 : valueSum / count;
    });
    let arduino2 = {
      createtime: time1,
      value: valueAve
    }
    output.push(arduino2);
  });
  return output;
}