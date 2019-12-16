import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Button, Slider, SafeAreaView, Picker, Text, ToastAndroid } from 'react-native';
import { Defs, LinearGradient, Stop } from 'react-native-svg'
import { LineChart, Grid, XAxis, YAxis } from 'react-native-svg-charts'

import DateTimePicker from "react-native-modal-datetime-picker";
import * as shape from 'd3-shape'

import Axios from 'axios';

export default function SettingsScreen() {


  const contentInset = { top: 20, bottom: 8 }

  const [state, setState] = useState({
    labels: [],
    data: [1, 2, 3, 4],
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
    ]
  })

  const [selected, setSelected] = useState({
    data: {
      sensorId: 3,
      arduino_id: 1,
      name: 'DHT11_H',
      arduino: 'arduino_1'
    }
  })


  const Gradient = () => (
    <Defs key={'gradient'}>
      <LinearGradient id={'gradient'} x1={'0'} y={'0%'} x2={'100%'} y2={'0%'}>
        <Stop offset={'0%'} stopColor={'rgb(134, 65, 244)'} />
        <Stop offset={'100%'} stopColor={'rgb(66, 194, 244)'} />
      </LinearGradient>
    </Defs>
  )

  function handleOnChange(itemValue) {
    if (interval) clearInterval(interval);
    setSelected({
      data: itemValue
    })
    interval = setInterval(getInflux, 5000);
  }

  function getInflux() {
    Axios({
      url: 'https://us-west-2-1.aws.cloud2.influxdata.com/api/v2/query?org=theten12@gmail.com&pretty=true',
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.flux',
        'Authorization': 'Token ak5mrOgELZ6XR7yQyF0Hc6BrGszJ3JciaUwBJJnkFlMK76ZTdMKNIxOKdH_fBOl25qZ5huoxeozKjuh_-xIzOg==',
        'Accept-Encoding': 'identity'
      },
      data: "from(bucket: \"my-bucket\")|> range(start: -5m)|> filter(fn: (r) => r._measurement == \"arduino_1\")|> filter(fn: (r) => r._field == \"value\")|> filter(fn: (r) => r.sensor == \"" + selected.data.name + "\")",
    })
      .then(res => {
        let sensors = parser(res.data)

        let new_data = sensors[0].map(u => parseFloat(u._value))

        console.log(new_data);
        

        setState({
          ...state,
          data: new_data
        })
      })
  }

  let interval

  useEffect(() => {
    interval = setInterval(getInflux, 5000);
    return () => clearInterval(interval)

  }, [])


  return (

    <ScrollView style={styles.container}>
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
          formatLabel={(value) => `${value}`}
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
      <Picker
        selectedValue={selected.data}
        onValueChange={handleOnChange}
      >
        {
          state.sensors && state.sensors.map(u => (
            <Picker.Item key={u.name} label={u.name} value={u} />
          ))
        }
      </Picker>

      <Button title="off" onPress={() => {
        console.log(interval);
        
        clearInterval(interval)
      }}/>

    </ScrollView>
  )
}

SettingsScreen.navigationOptions = {
  title: 'Live',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

function parser(plain) {
  let rows = plain.split("\n")

  let sensors_table = [[]], i = 0

  rows.map((u) => {
    if (u.trim() == "") {
      i++
      sensors_table.push([])
    }
    else sensors_table[i].push(u.trim())
  })

  sensors_table.pop()
  sensors_table.pop()

  let result = sensors_table.map(u => csv(u))

  return result

}

function csv(csv) {

  var lines = csv

  var result = [];

  // NOTE: If your columns contain commas in their values, you'll need
  // to deal with those before doing the next step 
  // (you might convert them to &&& or something, then covert them back later)
  // jsfiddle showing the issue https://jsfiddle.net/
  var headers = lines[0].split(",");

  for (var i = 1; i < lines.length; i++) {

    var obj = {};
    var currentline = lines[i].split(",");

    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }

    result.push(obj);

  }

  return result
}