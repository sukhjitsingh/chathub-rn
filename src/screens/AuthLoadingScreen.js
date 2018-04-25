import React, { Component } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, Text, View, } from 'react-native';
import firebase from 'react-native-firebase';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';

export default class AuthLoadingScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      user: null,
    };
    console.disableYellowBox = true; // To disable warnings temprarorly 

  }

  componentDidMount() {
    GoogleSignin.configure({
      iosClientId: '', // only for iOS
    })
      .then(() => {
        GoogleSignin.currentUserAsync().then((user) => {
          console.log('AUTH-SCREEN-USER', user);
          this.setState({ loading: false, user: user });
          this.props.navigation.navigate(user ? 'Home' : 'Auth');
        }).done()
      });
  }
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
