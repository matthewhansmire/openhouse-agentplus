import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Animated,
  ScrollView,
  Text,
  Image,
  TextInput,
  Alert,
  Linking,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Dimensions,
  Platform,
  ImageBackground,
} from "react-native";
import normalize from "react-native-normalize";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Spinner from 'react-native-loading-spinner-overlay';

import {
  Button,
  AgentCard,
  Header,
  LabelTag,
  PropertyCard,
  SearchBox,
  SideMenu,
  SignModal,
} from '@components';
import { Colors, Images, LoginInfo, RouteParam } from '@constants';
import { getContentByAction, postData } from '../../api/rest';

export default class ClientViewScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: false,
      tab: this.props.route.params.tab ? this.props.route.params.tab : 'preference',
      client: this.props.route.params.client,
      preferenceData: [],
      searchedData: [],
      viewedData: [],
      pdfData: []
    }
  }

  componentDidMount() {
    this.getPreference();
    this.getSearched();
    this.getViewed();
    this.getPDF();
  }

  getPreference = () => {    
    var preferenceParam = {
      action: 'client_preferrences',
      account_no: this.state.client.client_account
    };
    //console.log('preferenceParam', preferenceParam);
    getContentByAction(preferenceParam)
      .then((res) => {
        //console.log('preference data', res);
        if (res.length == 0 || res[0].error) {
          this.setState({ spinner: false });
          return;
        }
        var sortedRes = res.sort((a, b) => { return a.displayorder - b.displayorder });
        this.setState({
          preferenceData: sortedRes,
        });
      })
      .catch((err) => {
        //console.log('get preference error', err);
      })
  }

  getSearched = () => {
    var searchedParam = {
      action: 'client_searched',
      account_no: LoginInfo.user_account,
      client_no: this.state.client.client_account
    };
    //console.log('searchedParam', searchedParam);
    getContentByAction(searchedParam)
      .then((res) => {
        //console.log('searched data', res);
        if (res.length == 0 || res[0].error) {
          this.setState({ spinner: false });
          return;
        }
        var sortedRes = res.sort((a, b) => { return a.displayorder - b.displayorder });
        this.setState({
          searchedData: sortedRes,
        });
      })
      .catch((err) => {
        //console.log('get searched error', err);
      })
  }

  getViewed = () => {
    var viewedParam = {
      action: 'client_properties_viewed',
      account_no: LoginInfo.user_account,
      client_no: this.state.client.client_account
    };
    //console.log('viewedParam', viewedParam);
    this.setState({ spinner: true });
    getContentByAction(viewedParam)
      .then((res) => {
        //console.log('viewed data', res);
        if (res.length == 0 || res[0].error) {
          this.setState({ spinner: false });
          return;
        }
        var sortedRes = res.sort((a, b) => { return a.displayorder - b.displayorder });
        this.setState({
          viewedData: sortedRes,
          spinner: false
        });
        RouteParam.propertyData = sortedRes;
      })
      .catch((err) => {
        //console.log('get viewed error', err);
        this.setState({ spinner: false})
      })
  }

  getPDF = () => {
    var pdfParam = {
      action: 'client_list_of_pdf',
      account_no: LoginInfo.user_account,
      client_no: this.state.client.client_account
    };
    //console.log('pdfParam', pdfParam);
    getContentByAction(pdfParam)
      .then((res) => {
        //console.log('pdf data', res);
        if (res.length == 0 || res[0].error) {
          this.setState({ spinner: false });
          return;
        }
        var sortedRes = res.sort((a, b) => { return a.displayorder - b.displayorder });
        this.setState({
          pdfData: sortedRes,
        });
      })
      .catch((err) => {
        //console.log('get pdf error', err);
      })
  }

  onTab = (kind) => {
    this.setState({ tab: kind });
  }

  onPropertyPress = (propertyRecordNo) => {
    RouteParam.propertyRecordNo = propertyRecordNo;
    this.props.navigation.navigate('PropertyStack');
  }

  renderPreference = () => {
    return (
      <ScrollView style={{ width: '100%', height: '100%', /*borderWidth: 1*/ }} showsVerticalScrollIndicator={false}>
        {
          this.state.preferenceData.length == 0 ?
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTxt}>No Result Data</Text>
            </View>
            :
            this.state.preferenceData.map((each, index) => {
              return (
                <View key={index} style={styles.preferenceItemContainer}>
                  <Text style={styles.preference}>Question: {each.client_question}</Text>
                  <Text style={styles.preference}>Answer: {each.client_answer}</Text>
                </View>
              );
            })
        }
      </ScrollView>
    );
  }

  renderSearched = () => {
    return (
      <ScrollView style={{ width: '100%', height: '100%' }} showsVerticalScrollIndicator={false}>
        {
          this.state.searchedData.length == 0 ?
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTxt}>No Result Data</Text>
            </View>
            :
            this.state.searchedData.map((each, index) => {
              return (
                <View key={index} style={styles.searchedItemContainer}>
                  <Text style={styles.searched}>{each.client_searched_string}</Text>
                  <Text style={styles.searched}>{each.client_searched_date}</Text>
                </View>
              );
            })
        }
      </ScrollView>
    );
  }

  renderViewed = () => {
    return (
      <View style={{ width: '100%', height: '100%' }}>
        {
          this.state.viewedData.length == 0 ?
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTxt}>No Result Data</Text>
            </View>
            :
            <FlatList
              showsVerticalScrollIndicator={false}
              data={this.state.viewedData}
              renderItem={({ item }) => <PropertyCard cardStyle={{ width: width * 0.94, height: normalize(245, 'height'), marginBottom: normalize(10, 'height'), marginRight: 0 }} item={item} onPress={() => this.onPropertyPress(item.property_recordno)} />}
              keyExtractor={item => item.displayorder.toString()}
            />
        }
      </View>
    );
  }

  formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  renderPDF = () => {
    return (
      <ScrollView style={{ width: '100%', height: '100%' }}>
        {
          this.state.pdfData.length == 0 ?
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTxt}>No Result Data</Text>
            </View>
            :
            this.state.pdfData.map((each, index) => {
              return (
                <TouchableOpacity key={index} style={styles.pdfItemContainer} onPress={()=>this.props.navigation.navigate('ClientViewPDF', {client: this.state.client, propertyPDF: each})}>
                  <Text style={styles.pdf}>{each.property_type} - {this.formatter.format(each.property_price).split(".")[0]} - ID: {each.property_mls_num}</Text>
                  <Text style={styles.pdf}>{each.property_address}</Text>
                  <Text style={styles.pdf}>Signed on: {each.property_signedon}</Text>
                </TouchableOpacity>
              );
            })
        }
      </ScrollView>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Spinner visible={this.state.spinner} />
        <View style={styles.headerContainer}>
          <Header title={this.state.client.client_fullname.toUpperCase()} titleColor={Colors.blackColor} onPressBack={() => this.props.navigation.goBack(null)} rightIcon={this.state.tab === 'viewed' ? Images.iconLocation : null} onPressRightIcon={() => this.props.navigation.navigate('ClientViewedPropertyMap', {clientName: this.state.client.client_fullname, viewedData: this.state.viewedData})} />
        </View>
        <View style={styles.topContainer}>
          <View style={styles.imgContainer}>
            <Image style={styles.img} source={{ uri: this.state.client.client_photo_url }} resizeMode='stretch' />
          </View>
          <View style={styles.txtContainer}>
            <Text style={styles.txt}>Email: {this.state.client.client_email}</Text>
            <Text style={styles.txt}>Telephone: {this.state.client.client_telephone}</Text>
            <Text style={styles.txt}>Activity: {this.state.client.client_last_activity}</Text>
          </View>
        </View>
        <View style={styles.tabContainer}>
          <TouchableOpacity onPress={() => this.onTab('preference')}>
            <Image style={styles.tabIcon} source={Images.iconClientPreference} resizeMode='cover' />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.onTab('searched')}>
            <Image style={styles.tabIcon} source={Images.iconClientSearched} resizeMode='cover' />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.onTab('viewed')}>
            <Image style={styles.tabIcon} source={Images.iconClientViewed} resizeMode='cover' />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.onTab('pdf')}>
            <Image style={styles.tabIcon} source={Images.iconClientPDF} resizeMode='cover' />
          </TouchableOpacity>
        </View>
        <View style={styles.mainContainer}>
          {
            this.state.tab === 'preference' ? this.renderPreference()
              : this.state.tab === 'searched' ? this.renderSearched()
                : this.state.tab === 'viewed' ? this.renderViewed()
                  : this.state.tab === 'pdf' ? this.renderPDF()
                    : null
          }
        </View>
      </View>
    );
  }

}

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255,255,255,1)",
    flex: 1,
    width: width,
    height: height
  },
  headerContainer: {
    width: '100%',
    height: normalize(70, 'height'),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.borderColor,
    borderBottomWidth: normalize(0.5, 'height'),
  },
  topContainer: {
    width: '100%',
    height: '14%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.borderColor,
    borderBottomWidth: normalize(0.5, 'height'),
  },
  imgContainer: {
    width: '20%',
    height: '73%',
    //borderWidth: 1
  },
  img: {
    width: '100%',
    height: '100%',
    borderRadius: normalize(15),
    //borderColor: Colors.borderColor,
    //borderWidth: normalize(1)
  },
  txtContainer: {
    width: '72%',
    height: '80%',
    justifyContent: 'center',
    padding: normalize(10),
    paddingTop: normalize(15),
    //borderWidth: 1
  },
  txt: {
    fontFamily: 'SFProText-Regular',
    fontSize: RFPercentage(1.6),
    color: Colors.blackColor,
    marginBottom: normalize(5, 'height'),
    //borderWidth: 1
  },
  tabContainer: {
    width: '100%',
    height: '10%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderColor: Colors.borderColor,
    borderBottomWidth: normalize(0.5, 'height'),
  },
  tabIcon: {
    width: normalize(40),
    height: normalize(40)
  },
  mainContainer: {
    width: '100%',
    height: '65%',
    alignItems: 'center',
    padding: normalize(10),
    //borderWidth: 3
  },
  preferenceItemContainer: {
    width: '100%',
    height: normalize(52, 'height'),
    marginBottom: normalize(8, 'height'),
    borderColor: Colors.borderColor,
    borderWidth: normalize(0.5),
    justifyContent: 'space-between',
    padding: normalize(8),
  },
  preference: {
    fontFamily: 'SFProText-Regular',
    fontSize: RFPercentage(1.6),
    color: Colors.blackColor,
    //borderWidth: 1
  },
  searchedItemContainer: {
    width: '100%',
    height: normalize(52, 'height'),
    marginBottom: normalize(8, 'height'),
    borderColor: Colors.borderColor,
    borderWidth: normalize(0.5),
    justifyContent: 'space-between',
    padding: normalize(8),
  },
  searched: {
    fontFamily: 'SFProText-Regular',
    fontSize: RFPercentage(1.6),
    color: Colors.blackColor,
    //borderWidth: 1
  },
  pdfItemContainer: {
    width: '100%',
    height: normalize(70, 'height'),
    marginBottom: normalize(8, 'height'),
    borderColor: Colors.borderColor,
    borderWidth: normalize(0.5),
    justifyContent: 'space-between',
    padding: normalize(8),
  },
  pdf: {
    fontFamily: 'SFProText-Regular',
    fontSize: RFPercentage(1.6),
    color: Colors.blackColor,
    //borderWidth: 1
  },
  emptyContainer: {
    width: '100%',
    height: height * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    //borderWidth: 1
  },
  emptyTxt: {
    fontFamily: 'SFProText-Semibold',
    fontSize: 14,
    color: Colors.blackColor
  },
});