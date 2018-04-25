import React, { Component } from 'react';
import { Text, View } from 'react-native';

import RootNavigator from './src/navigation/RootNavigator'

export default class App extends React.Component {
  render() {
    return (
      <RootNavigator />
    )
  }
}