import React from 'react';
import { ExpoConfigView } from '@expo/samples';

import { ScrollView, StyleSheet } from 'react-native';

export default function SettingsScreen() {
  return (
    <ScrollView style={styles.container}>
      
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

