import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import { GoogleSignin } from 'react-native-google-signin';

import ChatList from '../components/chats/ChatList'

export default class HomeScreen extends Component {

  constructor(props) {
    super(props);
    const { user } = this.props
    this.state = {
      loading: true,
      user: user,
    };
  }

  componentDidMount() {
    GoogleSignin.currentUserAsync().then((user) => {
      console.log('USER-HOMESCREEN-ASYNC:', user);
      this.setState({ user: user });
    }).done()
  }

  _onGoogleSignOut = () => {
    GoogleSignin.signOut()
      .then(() => {
        console.log('Logging out...', this.state.user)
        this.setState({ user: null })
        console.log('Logged out', this.state.user);
        this.props.navigation.navigate('Auth');
      })
      .catch((err) => {
        console.log(err)
      });
  }
  render() {
    return (
      <View style={styles.container}>
        <ChatList />
        <Button
          title='Logout'
          buttonStyle={{
            paddingHorizontal: 5
          }}
          onPress={() => this._onGoogleSignOut()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
