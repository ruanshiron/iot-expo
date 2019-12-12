import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Button } from 'react-native';
import { Defs, LinearGradient, Stop } from 'react-native-svg'
import { LineChart, Grid, XAxis, YAxis } from 'react-native-svg-charts'
import * as shape from 'd3-shape'



export default function LinksScreen() {

  const contentInset = { top: 20, bottom: 20 }

  const [state, setState] = useState({ data: [50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80] })


  const handleOnPress = () => {
    setState({ data: [50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, 20] })
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
          <XAxis
            style={{ marginHorizontal: 0 }}
            data={state.data}
            formatLabel={(value, index) => index}
            contentInset={{ left: 10, right: 10 }}
            svg={{ fontSize: 10, fill: 'black' }}
          />
        </View>
      </View>
      {/* End Đồ Thị */}

      <Button title="click" onPress={handleOnPress} />
    </ScrollView>

  );
}


LinksScreen.navigationOptions = {
  title: 'Graph',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
