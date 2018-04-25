import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import { GoogleSignin } from 'react-native-google-signin';

import ChatList from '../components/chats/ChatList'

export default class HomeScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};

    return {
      headerTitle: 'Messages',
      headerRight: (
        <TouchableOpacity >
          <Text style={{ marginRight: 20, fontWeight: 'bold' }}
            onPress={() => params._onGoogleSignOut()}>
            Logout
          </Text>
        </TouchableOpacity>
      )
    }
  }

  constructor(props) {
    super(props);
    const { user } = this.props
    this.state = {
      loading: true,
      user: user,
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({ _onGoogleSignOut: this._onGoogleSignOut });
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
});
