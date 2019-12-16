import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Button, Slider, SafeAreaView, Picker, Text, ToastAndroid } from 'react-native';
import { Defs, LinearGradient, Stop } from 'react-native-svg'
import { LineChart, Grid, XAxis, YAxis } from 'react-native-svg-charts'

import DateTimePicker from "react-native-modal-datetime-picker";
import * as shape from 'd3-shape'

import moment from 'moment-timezone'

function Separator() {
  return <View style={styles.separator} />;
}

export default function LinksScreen() {

  const contentInset = { top: 20, bottom: 20 }

  const [state, setState] = useState({
    labels: [],
    data: [],
    isDateTimePickerVisible: false,
    sensors: [
      {
        sensorId: 1,
        arduino_id: 1,
        name: 'GP2Y10',
        arduino: 'arduino_1'
      },
      {
        sensorId: 2,
        arduino_id: 1,
        name: 'DHT11_T',
        arduino: 'arduino_1'
      },
      {
        sensorId: 3,
        arduino_id: 1,
        name: 'DHT11_H',
        arduino: 'arduino_1'
      }
    ],
    selected: {
      sensorId: 1,
      arduino_id: 1,
      name: 'GP2Y10',
      arduino: 'arduino_1'
    },
    date: ''
  })

  const [date, setDate] = useState({
    start: null,
    stop: null,
    pickFor: ''
  })

  useEffect(() => {
    console.log(date);

  })


  const showDateTimePicker = (option) => {

    setState({
      ...state,
      isDateTimePickerVisible: true,
      pickFor: option
    });
  };

  const hideDateTimePicker = () => {
    setState({
      ...state,
      isDateTimePickerVisible: false
    });
  };

  const handleDatePicked = pdate => {
    console.log("A date has been picked: ", date.toString());

    if (state.pickFor == 'start') {
      setDate({
        ...date,
        start: pdate
      })
    } else {
      setDate({
        ...date,
        stop: pdate
      })
    }


    hideDateTimePicker();
  };

  const handleOnPress = () => {
    // if ((date.start != null) && (date.stop != null))
    //   fetch('http://springbootiot1-env-1.rzpga2pgvr.us-east-1.elasticbeanstalk.com/arduino/search', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       arduinoId: state.selected.arduino_id,
    //       sensorId: state.selected.sensorId,
    //       fromTime: moment(date.start).tz('Asia/Ho_Chi_Minh').format('x'),
    //       toTime: moment(date.stop).tz('Asia/Ho_Chi_Minh').format('x'),
    //       pageable: false,
    //     }),
    //   })
    //     .then(res =>
    //       res.json()
    //     )
    //     .then(response => {
    //       let list = getListTime(moment(date.start).tz('Asia/Ho_Chi_Minh').format('x'), moment(date.stop).tz('Asia/Ho_Chi_Minh').format('x'))

    //       let data = convertData(list, response)
          
    //       console.log(data);
          

    //       setState({
    //         ...state,
    //         labels: list,
    //         data: data.map(u => u.value)
    //       })
    //     })
    // else {
    //   ToastAndroid('Nhập đầy đủ thông tin')
    // }
  }

  const Gradient = () => (
    <Defs key={'gradient'}>
      <LinearGradient id={'gradient'} x1={'0'} y={'0%'} x2={'100%'} y2={'0%'}>
        <Stop offset={'0%'} stopColor={'rgb(134, 65, 244)'} />
        <Stop offset={'100%'} stopColor={'rgb(66, 194, 244)'} />
      </LinearGradient>
    </Defs>
  )

  return (
    <SafeAreaView style={styles.container}>

      {/* Đồ thị */}
      <View style={{ flexDirection: 'row', padding: 10 }}>
        <YAxis
          data={state.data}
          style={{ paddingBottom: 10 }}
          contentInset={contentInset}
          svg={{
            fill: 'grey',
            fontSize: 10,
          }}
          numberOfTicks={10}
          formatLabel={(value) => `${value}ºC`}
        />
        <View style={{ height: 200, flexDirection: 'column', flex: 1 }}>
          <LineChart
            data={state.data}
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
          {/* <XAxis
            style={{ marginHorizontal: 0 }}
            data={state.data}
            formatLabel={(value, index) => state.labels[index]}
            contentInset={{ left: 10, right: 10 }}
            svg={{ fontSize: 10, fill: 'black' }}
          /> */}
        </View>

      </View>
      {/* End Đồ Thị */}

      <View style={{ padding: 8 }}>
        <Picker
          selectedValue={state.sensor}
          onValueChange={(itemValue, itemIndex) =>
            setState({
              ...state,
              sensor: itemValue
            })
          }>
          {
            state.sensors && state.sensors.map(u => (
              <Picker.Item key={u.name} label={u.name} value={u} />
            ))
          }
        </Picker>
        <DateTimePicker
          mode='datetime'
          isVisible={state.isDateTimePickerVisible}
          onConfirm={handleDatePicked}
          onCancel={hideDateTimePicker}
        />

        <View style={{ marginTop: 8 }}>
          <Button title={!date.start ? "thời điểm bắt đầu" : date.start.toString()} onPress={() => showDateTimePicker('start')} />
        </View>

        <View style={{ marginTop: 8 }}>
          <Button title={!date.stop ? "thời điểm kết thúc" : date.stop.toString()} onPress={() => showDateTimePicker('stop')} />
        </View>

        <View style={{ marginTop: 8 }}>
          <Button title="Xác nhận" onPress={handleOnPress} />
        </View>
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
    justifyContent: 'space-between',
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
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