/**
 * @format
 */

import React from 'react';
import { AppRegistry, Alert } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

import messaging from '@react-native-firebase/messaging';
var PushNotification = require("react-native-push-notification");
import PushNotificationIOS from '@react-native-community/push-notification-ios';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  
  // PushNotification.localNotification({
  //   title: 'notification.title',
  //   message: 'notification.body!',
  // });
  PushNotificationIOS.presentLocalNotification({
    alertTitle: 'Open House Notification Of Background',
    alertBody: 'Client Picked You As Preferred Agent'
  })
});

function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }

  return <App />;
}

//AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent(appName, () => HeadlessCheck);