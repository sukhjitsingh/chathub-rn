import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import firebase from 'react-native-firebase';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';


export default class LoginComponent extends Component {

  _onGoogleSignIn = async () => {

    await GoogleSignin.configure();

    GoogleSignin.hasPlayServices({ autoResolve: true }).then(() => {
      // play services are available. can now configure library
    })
      .catch((err) => {
        console.log("Play services error", err.code, err.message);
      })

    await GoogleSignin.signIn()
      .then((data) => {
        // Create a new Firebase credential with the token
        console.log("ID-TOKEN:", data.idToken)
        console.log("ACCESS-TOKEN:", data.accessToken)
        
        const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken);
        // Login with the credential
        return firebase.auth().signInAndRetrieveDataWithCredential(credential);
      })
      .then((currentUser) => {
        console.log(`Google Login with user : ${currentUser.user.displayName}`);
      })
      .catch((err) => {
        console.log(`Login fail with error: ${err.code, err.error}`);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <GoogleSigninButton
          style={{ width: 230, height: 48 }}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Light}
          onPress={() => { this._onGoogleSignIn() }} />
      </View>

    )
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
