import React, { Component } from 'react';
import { View, Text, ScrollView, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, Input, Icon, List, ListItem } from 'react-native-elements';
import { MaterialCommunityIcons } from 'react-native-vector-icons'
import firebase from 'react-native-firebase';
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
      messageInput: '',
      loading: true,
      chats: [],
    };
  }

  componentDidMount() {
    this.unsubscribe = this.ref.orderBy('createdAt', 'asc').onSnapshot(this.onCollectionUpdate)
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
      const { message, createdAt } = doc.data();
      console.log("MESSAGE-TEST:", message)
      const time = timeSince(createdAt)
      chats.push({
        key: doc.id,
        doc, // DocumentSnapshot
        message,
        time,
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
      createdAt: new Date()
    });
    this.setState({
      messageInput: '',
    });
  }

  renderMessage = ({ item }) => {
    return (
      <View style={styles.messageList} >
        <Icon
          name='account-circle'
          type='material-community'
          color='black'
        />
        <Text style={styles.message}>
          {item.message}
        </Text>
      </View>
    )
  }

  render() {
    // console.log("Message-List:", this.state.chats)
    return (
      <View style={styles.container}>
          <FlatList style={{ flex: 1 }}
            data={this.state.chats}
            keyExtractor={(item, index) => index}
            renderItem={({ item, index }) => this.renderMessage({ item })}
          />
        <View style={styles.inputContainer}>
          <Input
            placeholder='Message'
            value={this.state.messageInput}
            onChangeText={(text) => this.updateMessageInput(text)}
          />
          <Icon
            name='send'
            type='material-community'
            color='black'
            // disabled={!this.state.messageInput.length}
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
    alignItems: 'flex-end',
  },
  messageList: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingTop: 10,
    flexWrap: 'wrap',
  },
  message: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    fontSize: 14,
    paddingLeft: 10,
    flexWrap: 'wrap',
  }
});
