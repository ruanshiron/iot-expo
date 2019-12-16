import * as WebBrowser from 'expo-web-browser';
import React, { useState, useEffect } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  ToastAndroid
} from 'react-native';

import { MonoText } from '../components/StyledText';
import { Switch } from 'react-native-gesture-handler';
import Axios from 'axios';

export default function HomeScreen() {
  const [state, setState] = useState({
    sensors: [
      {
        id: 1,
        arduino_id: 1,
        name: 'GP2Y10',
        unit: 'mg/m3',
        description: 'Cảm biến chất lượng không khí',
        data: {
          value: 20,
          datetime: '19:30 26/12/2019'
        }
      },
      {
        id: 2,
        arduino_id: 1,
        name: 'DHT11_T',
        unit: '°C',
        description: 'Cảm biến nhiệt',
        data: {
          value: 30,
          datetime: '19:30 26/12/2019'
        }
      },
      {
        id: 3,
        arduino_id: 1,
        name: 'DHT11_H',
        unit: '%',
        description: 'Cảm biến độ ẩm',
        data: {
          value: 40,
          datetime: '19:30 26/12/2019'
        }
      },

    ]
  })

  function getData() {
    state.sensors.map(u => {
      fetch(`http://springbootiot1-env-1.rzpga2pgvr.us-east-1.elasticbeanstalk.com/arduino/live?amount=1&arduinoId=${u.arduino_id}&sensorId=${u.id}`)
        .then((response) => response.json())
        .then((res) => {
          setState({
            sensors: state.sensors.map(mu => {
              if (mu == u) {
                return {
                  ...mu,
                  data: {
                    ...mu.data,
                    value: res[0].value
                  }
                }
              }
              return mu
            })
          })
        })
    })
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
      data: "from(bucket: \"my-bucket\")|> range(start: -30s)|> filter(fn: (r) => r._field == \"value\")",
    })
      .then(res => {
        let sensors = parser(res.data)
        
        let a = sensors.map(u => {
          if (u[0]) {
            return {
              arduino_id: u[0]._measurement,
              name: u[0].sensor,
              data: {
                value: parseFloat(u[0]._value).toFixed(2),
                datetime: Date(u[0]._time)
              }
            }
          }
        })
        setState({sensors: a})
      })
  }

  useEffect(() => {
    const interval = setInterval(() => getInflux(), 10000);
    return () => clearInterval(interval);

  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}>
        {
          state.sensors.map((sensor, i) => (
            <View key={i} style={{ ...styles.item, backgroundColor: colors[i % colors.length] }}>
              <View style={styles.value}>
                <Text style={{ ...styles.unit, color: colors[i % colors.length] }}>{sensor.unit}</Text>
                <Text style={styles.title}>{sensor.data.value}</Text>
                <Text style={styles.unit}>{sensor.unit}</Text>
              </View>
              <Text style={styles.name}>{sensor.name}</Text>
              <Text style={styles.description}>{sensor.description}</Text>
              <Text style={styles.datetime}>{sensor.data.datetime}</Text>
            </View>
          ))
        }
      </ScrollView>
    </View >
  );
}

HomeScreen.navigationOptions = {
  title: 'Sensors',
};

const colors = [
  '#F6774A',
  '#FFCE38',
  '#36AB91'
]

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 0,
  },
  item: {
    backgroundColor: '#F6774A',
    padding: 20,
    paddingBottom: 40,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  value: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    alignContent: 'stretch'
  },
  title: {
    fontSize: 96,
    fontWeight: 'bold',
    color: '#fff'
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#141518'
  },
  description: {
    color: '#141518'
  },
  unit: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    paddingBottom: 20
  },
  datetime: {
    paddingTop: 15,
    color: '#141518'
  }
});


function parser(plain){
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

function csv(csv){

  var lines=csv

  var result = [];

  // NOTE: If your columns contain commas in their values, you'll need
  // to deal with those before doing the next step 
  // (you might convert them to &&& or something, then covert them back later)
  // jsfiddle showing the issue https://jsfiddle.net/
  var headers=lines[0].split(",");

  for(var i=1;i<lines.length;i++){

      var obj = {};
      var currentline=lines[i].split(",");

      for(var j=0;j<headers.length;j++){
          obj[headers[j]] = currentline[j];
      }

      result.push(obj);

  }
  
  return result
}