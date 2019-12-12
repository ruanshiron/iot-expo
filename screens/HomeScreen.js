import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
} from 'react-native';

import { MonoText } from '../components/StyledText';
import { Switch } from 'react-native-gesture-handler';

export default function HomeScreen() {
  const [state, setState] = useState({
    sensors: [
      {
        id: 1,
        arduino_id: 1,
        name: 'SHARP GP2Y10',
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
        name: 'DHT11 T',
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
        name: 'DHT11 H',
        unit: '%',
        description: 'Cảm biến độ ẩm',
        data: {
          value: 40,
          datetime: '19:30 26/12/2019'
        }
      },

    ]
  })

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}>
        {
          state.sensors.map((sensor, i) => (
            <View key={i} style={{...styles.item, backgroundColor: colors[i % colors.length]}}>
              <View style={styles.value}>
                <Text style={{...styles.unit, color: colors[i % colors.length]}}>{sensor.unit}</Text>
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
