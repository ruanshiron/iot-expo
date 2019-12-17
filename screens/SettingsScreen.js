import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Button, Slider, SafeAreaView, Picker, Text, ToastAndroid } from 'react-native';
import { Defs, LinearGradient, Stop } from 'react-native-svg'
import { LineChart, Grid, XAxis, YAxis } from 'react-native-svg-charts'

import DateTimePicker from "react-native-modal-datetime-picker";
import * as shape from 'd3-shape'
import RNPickerSelect from 'react-native-picker-select';

import Axios from 'axios';

let interval

export default function SettingsScreen() {


  const [data, setData] = useState([4, 3, 1])

  const sensors = [
    {name: 'GP2Y10', id: 1, arduinoId: 1},
    {name: 'DHT11_T', id: 2, arduinoId: 1},
    {name: 'DHT11_H', id: 2, arduinoId: 1}
  ]

  const [selected, setSelected] = useState('GP2Y10')

  const [netID, setNetID] = useState()

  const Gradient = (selected) => (
    <Defs key={'gradient'}>
      <LinearGradient id={'gradient'} x1={'0'} y={'0%'} x2={'100%'} y2={'0%'}>
        <Stop offset={'0%'} stopColor={'rgb(134, 65, 244)'} />
        <Stop offset={'100%'} stopColor={'rgb(66, 194, 244)'} />
      </LinearGradient>
    </Defs>
  )

  const getData = () => {
    Axios({
      method: 'post',
      url: 'https://us-west-2-1.aws.cloud2.influxdata.com/api/v2/query?org=theten12@gmail.com&pretty=true',
      headers: {
        'Authorization': 'Token ak5mrOgELZ6XR7yQyF0Hc6BrGszJ3JciaUwBJJnkFlMK76ZTdMKNIxOKdH_fBOl25qZ5huoxeozKjuh_-xIzOg==',
        'Content-Type': 'application/vnd.flux'
      },
      data: `from(bucket: "my-bucket")|> range(start: -30s)|> filter(fn: (r) => r._measurement == "arduino_1")|> filter(fn: (r) => r._field == "value")|> filter(fn: (r) => r.sensor == "${selected}")`
    })
      .then(response => parser(response.data)[0].map(u => +u._value))
      .then(new_data => {
        console.log(new_data);
        
        setData(new_data)
      })
  }


  useEffect(() => {
  }, [])


  return (

    <ScrollView style={styles.container}>
      

      {/* Đồ thị */}
      <View style={{ flexDirection: 'row', padding: 10, paddingTop: 20, paddingBottom: 20 }}>
        <YAxis
          data={data}
          style={{ paddingBottom: 10 }}
          contentInset={{ top: 20, bottom: 8 }}
          svg={{
            fill: 'grey',
            fontSize: 10,
          }}
          numberOfTicks={10}
          formatLabel={(value) => `${value}`}
        />
        <View style={{ height: 400, flexDirection: 'column', flex: 1 }}>
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
      <View style={styles.inputAndroid}>
      <RNPickerSelect
        onValueChange={(value) => {
          setSelected(value.name)
        }}
        items={sensors.map(u => ({ label: u.name, value: u }))}
      />

      <Button title='xac nhan' onPress={() => getData(selected)} />
      </View>
      <Text style={{textAlign: 'center'}}> Chọn một cảm biến xem chỉ số đã thay đổi trong 30s</Text>

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
    color: 'black'
  }
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