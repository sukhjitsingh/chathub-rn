import React, { Component } from 'react';
import { View, Text, ScrollView, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Avatar, Button, Input, Icon, List, ListItem } from 'react-native-elements';
import { MaterialCommunityIcons } from 'react-native-vector-icons'
import firebase from 'react-native-firebase';
import { GoogleSignin } from 'react-native-google-signin';

import { timeSince } from '../../utils/timeSince'


export default class ChatList extends Component {
  constructor() {
    super();

    this.ref = firebase.firestore().collection('chats')
    this.FCM = firebase.messaging()

    // const Blob = RNFetchBlob.polyfill.Blob
    // window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
    // window.Blob = Blob

    this.unsubscribe = null;
    this.state = {
      user: null,
      messageInput: '',
      loading: true,
      chats: [],
    };
  }

  componentDidMount() {
    GoogleSignin.currentUserAsync().then((user) => {
      console.log('USER-ChatList:', user);
      this.setState({ user: user });
    }).done()
    this.unsubscribe = this.ref.orderBy('createdAt', 'desc').onSnapshot(this.onCollectionUpdate)
    // firebase.auth().onAuthStateChanged(user => {
    //   if (user) {
    //     this.FCM.requestPermission()
    //     this.FCM.getToken().then(token => {
    //       if (token) {
    //         console.log('CHATLIST-TOKEN:', token)
    //         // this.ref.doc(id).update({ FCMToken: token })
    //       } else {
    //         console.info("User does't have a device token yet.")
    //       }
    //     })
    //   }
    // })
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  // uploadImage = (uri, mime = 'application/octet-stream') => {
  //   return new Promise((resolve, reject) => {
  //     const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
  //       const sessionId = new Date().getTime()
  //       let uploadBlob = null
  //       const imageRef = storage.ref('images').child(`${sessionId}`)

  //       fs.readFile(uploadUri, 'base64')
  //       .then((data) => {
  //         return Blob.build(data, { type: `${mime};BASE64` })
  //       })
  //       .then((blob) => {
  //         uploadBlob = blob
  //         return imageRef.put(blob, { contentType: mime })
  //       })
  //       .then(() => {
  //         uploadBlob.close()
  //         return imageRef.getDownloadURL()
  //       })
  //       .then((url) => {
  //         resolve(url)
  //       })
  //       .catch((error) => {
  //         reject(error)
  //       })
  //   })
  // }

  onCollectionUpdate = (querySnapshot) => {
    const chats = [];
    querySnapshot.forEach((doc) => {
      const { message, createdAt, author } = doc.data();
      console.log("MESSAGE-TEST:", this.state.user)
      const time = timeSince(createdAt)
      chats.push({
        key: doc.id,
        doc, // DocumentSnapshot
        message,
        time,
        author,
      });
    });
    this.setState({
      chats,
      loading: false,
    });
  }

  updateMessageInput(value) {
    this.setState({ messageInput: value });
  }

  sendMessage() {
    this.ref.add({
      message: this.state.messageInput,
      createdAt: new Date(),
      author: this.state.user.name
    });
    this.setState({
      messageInput: '',
    });
  }

  parseMessage(str) {
    let bold = false, italics = false;
    let output = [];
    let text = str.split('').reduce((a, b) => {
      if (b == '*') {
        if (bold) {
          if (a != '') {
            if (italics)
              output.push({ text: a, bold: true, italics: true });
            else
              output.push({ text: a, bold: true });
          }
          bold = false;
        }
        else {
          if (italics)
            output.push({ text: a, italics: true })
          else
            output.push({ text: a })
          bold = true;
        }
        return '';
      }
      else if (b == '_') {
        if (italics) {
          if (a != '') {
            if (bold)
              output.push({ text: a, bold: true, italics: true });
            else
              output.push({ text: a, italics: true });
          }
          italics = false;
        }
        else {
          if (bold)
            output.push({ text: a, bold: true })
          else
            output.push({ text: a })
          italics = true;
        }
        return '';
      }
      else {
        return a + b;
      }
    }, '');
    if (text != '')
      output.push({ text: text });
    console.log(output);
    return output;
  }

  renderMessage = ({ item }) => {
    let name = item.author
    let avatorIcon = name.charAt(0).toString()
    if (name != null) {
      this.avatorIcon = name.charAt(0).toString()
    } else {
      this.avatorIcon = ''
    }

    return (
      <View style={{ flex: 1 }}>

        <View style={styles.messageList}>
          <Avatar
            small
            rounded
            title={avatorIcon}
          />
          <View style={styles.messageContainer}>
            <Text style={styles.message}>
              {item.message}
            </Text>
            <Text>
              {name}
            </Text>
          </View>
        </View>

      </View>

    )
  }

  render() {
    // console.log("Message-List:", this.state.chats)
    return (
      <View style={styles.container}>
        <FlatList
          inverted
          data={this.state.chats}
          keyExtractor={(item, index) => index}
          renderItem={({ item, index }) => this.renderMessage({ item })}
        />
        <View style={styles.inputContainer}>
          <Input
            placeholder='Type a message'
            value={this.state.messageInput}
            onChangeText={(text) => this.updateMessageInput(text)}
          />
          <Icon
            name='send'
            type='material-community'
            color='black'
            disabled={!this.state.messageInput.length}
            onPress={() => { this.sendMessage() }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingTop: 10,
  },
  messageList: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 5,
    paddingTop: 10,
    flexWrap: 'wrap',
  },
  messageContainer: {
    flex: 1,
    marginLeft: 5,
    padding: 5,
    flexWrap: 'wrap',
    backgroundColor: '#EEEEEE',
    borderRadius: 5,
  },
  message: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 16,
    fontFamily: 'Roboto',
    paddingBottom: 10,
    flexWrap: 'wrap',
    color: 'black'
  }
});
