import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Animated,
  ScrollView,
  Text,
  Image,
  ImageBackground,
  TextInput,
  Alert,
  Linking,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import normalize from 'react-native-normalize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';

import {WebView} from 'react-native-webview'; //ios
import PDFView from 'react-native-view-pdf'; //android
import RNFetchBlob from 'rn-fetch-blob';
import Spinner from 'react-native-loading-spinner-overlay';

import {
  BrowseCard,
  Button,
  CallCard,
  Header,
  LabelTag,
  PropertyCard,
  SearchBox,
  SideMenu,
  SignModal,
} from '@components';
import {Colors, Images, LoginInfo, RouteParam} from '@constants';
import {getContentByAction, postData} from '../../api/rest';

export default class OpenHouseSignatureScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: true,
      visibleSignForm: false,
      pdfURL:
        'http://www.openhousemarketingsystem.com/application/data/attendeepdf/2991.pdf',
    };
  }

  componentDidMount() {}

  onSignOK = () => {
    this.postSignature();

    this.props.navigation.navigate('OpenHouseSignatureEnd');
  };

  postSignature = async () => {
    let signaturePath = `${RNFetchBlob.fs.dirs.DocumentDir}/signature.png`;
    let uri = Platform.OS === 'ios' ? signaturePath : 'file://' + signaturePath;

    let filetoupload = this.props.route.params.attendeeAccount + '.png';
    let photo_id = LoginInfo.user_account + '-' + RouteParam.propertyRecordNo;

    let data = new FormData();
    data.append('photo_id', photo_id);
    data.append('photo_type', 's');
    data.append('filetoupload', {
      uri: uri,
      name: filetoupload,
      type: 'image/png',
    });

    fetch(
      'http://www.openhousemarketingsystem.com/application/virtualplus/v1/uploadimage.php',
      {
        method: 'POST',
        headers: {'Content-Type': 'multipart/form-data'},
        body: data,
      },
    )
      .then((res) => res.json())
      .then((res) => {
        //console.log('post sign success', res)
      })
      .catch((err) => {
        //console.log('post sign error',err);
      })
      .done();
  };

  render() {
    return (
      <ImageBackground style={styles.container}>
        <Spinner visible={this.state.spinner} />
        <SignModal
          visible={this.state.visibleSignForm}
          onClose={() => this.setState({visibleSignForm: false})}
          onSignOK={() => this.onSignOK()}
        />
        <View style={styles.headerContainer}>
          <Header
            title={'AGENCY DISCLOSURE FORM'}
            titleColor={Colors.blackColor}
            onPressBack={() => this.props.navigation.goBack(null)}
          />
        </View>
        <View style={styles.body}>
          <View style={styles.pdfContainer}>
            <WebView
              source={{uri: this.state.pdfURL}}
              onLoadEnd={() => this.setState({spinner: false})}
            />
          </View>
          <View style={styles.btnContainer}>
            <Button
              btnTxt="AGREE AND SIGN"
              btnStyle={{
                width: '100%',
                height: normalize(50, 'height'),
                color: 'blue',
                fontSize: RFPercentage(2.7),
              }}
              onPress={() => this.setState({visibleSignForm: true})}
            />
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,1)',
    flex: 1,
    width: width,
    height: height,
  },
  headerContainer: {
    width: '100%',
    height: normalize(70, 'height'),
    justifyContent: 'center',
    alignItems: 'center',
    //borderColor: Colors.borderColor,
    //borderBottomWidth: normalize(0.5, 'height'),
  },
  body: {
    width: '100%',
    height: height,
    marginTop: normalize(10, 'height'),
    alignItems: 'center',
    //borderWidth: 2
  },
  pdfContainer: {
    width: '95%',
    height: '75%',
    justifyContent: 'center',
    alignSelf: 'center',
    //borderWidth: 1
  },
  emptyContainer: {
    width: '60%',
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    //borderWidth: 1
  },
  btnContainer: {
    width: '90%',
    height: normalize(50, 'height'),
    alignSelf: 'center',
    justifyContent: 'flex-start',
    marginTop: normalize(20, 'height'),
  },
});
