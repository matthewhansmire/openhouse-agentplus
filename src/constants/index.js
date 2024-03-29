import { Alert, Linking } from 'react-native';
import {
  request, requestMultiple,
  check, checkMultiple,
  checkNotifications, requestNotifications,
  PERMISSIONS, RESULTS
} from 'react-native-permissions';

import CustomColors from './Colors';
import DefinedImages from './Images';

export const Colors = CustomColors;
export const Images = DefinedImages;

export const LoginInfo = {}

export const RouteParam = {
  isUnderReviewByApple: false,
  verifyResult: {},
  liveCallFromClosed: false,
  propertyRecordNo: '',
  property: '',
  liveInfo: {},
}

/////////// function //////////////
export const watchdogTimer = () => {
  setInterval(() => {
    //console.log('permission checking...')
    check(PERMISSIONS.IOS.CAMERA).then(
      (result) => {
        if (result != RESULTS.GRANTED) {
          //console.log('camera permission:', result);
          Linking.openSettings()
            .then(() => {

            })
            .catch((err) => {
              //console.log('open setting err', err)
            })
        }
      },
    );
    check(PERMISSIONS.IOS.MICROPHONE).then(
      (result) => {
        if (result != RESULTS.GRANTED) {
          //console.log('microphone permission:', result);
          Linking.openSettings()
            .then(() => {

            })
            .catch((err) => {
              //console.log('open setting err', err)
            })
        }
      },
    );
    check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(
      (result) => {
        if (result != RESULTS.GRANTED) {
          //console.log('location permission:', result);
          Linking.openSettings()
            .then(() => {

            })
            .catch((err) => {
              //console.log('open setting err', err) 
            })
        }
      },
    );
    checkNotifications().then(({ status, settings }) => {
      if (status != RESULTS.GRANTED) {
        //console.log('notification permission:', status);
        Linking.openSettings()
          .then(() => {

          })
          .catch((err) => {
            //console.log('open setting err', err) 
          })
      }
    });
  }, 2000);
}
