import React, { useEffect, useState } from "react";
import { View,KeyboardAvoidingView, TouchableWithoutFeedback, Alert, Image } from "react-native";
import {
  Input as TextInput, Popover, List, ListItem, Datepicker,
  Select, SelectItem
} from '@ui-kitten/components';
import ImagePicker from 'react-native-image-crop-picker';
import SplashScreen from "react-native-splash-screen";
import { CommonActions } from '@react-navigation/native';
import AddIcon from "../../assets/icon_add_big.svg";

import Text from "../../components/BaseText";
import CheckIcon from "../../assets/icon_check.svg";
import SchoolData from "./schoolData";
import { get,post } from '../../utils/request';
import { ScrollView } from "react-native-gesture-handler";
const Item = (props) => <View style={{ marginHorizontal: 20, marginVertical: 5, flexDirection: 'row', alignItems: 'center', ...props.style }}>
  {props.children}
</View>
const Login = ({ navigation }) => {


  const [visible, setVisible] = useState(false);
  const [checked, setChecked] = useState(true);
  const [data, setData] = useState(SchoolData);
  const [countdown, setCountdown] = useState(0);
  const [tel, setTel] = useState('');
  const [school, setSchool] = useState('');
  const [verificationCode, onChangeverificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [imgHeader, setImgHeader] = useState('');
  const [nickName, setNickName] = useState('');
  const [selectedIndex, setSelectedIndex] = useState();
  const [date, setDate] = useState();

  useEffect(() => {
    let intervalId;

    if (countdown > 0) {
      intervalId = setInterval(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [countdown]);
  // Register
  const handleRegister = () => {
    const data = {
      "username": nickName,
      "password": password,
      "phone": tel,
      "area": "default",
      "school": school,
      "validate_code": verificationCode,
      "avatar":imgHeader
    }
    console.log('注册数据',data);
    // return ;
    post('/api/v1/register', data).then(response => {
      console.log('response', response);
      if (response.code == "0") {
        navigation.navigate('Login');
      }
      else {
        // navigation.navigate('UserInfo');
        Alert.alert('提示', response.message);
      }
    })
  }
  const handleSend = () => {
    ///api/v1/validate_code
    const data = {
      "phone": tel,
    }
    post('/api/v1/validate_code', data).then(response => {
      console.log('response', response);
      if (response.code * 1 == "0") {
        // navigation.navigate('UserInfo');
        countdown == 0 && setCountdown(60);
      }
      else {
        Alert.alert('提示', response.message);
      }
    })
  }
  const renderItem = ({ item, index }) => (
    <ListItem title={`${item.name}`} onPress={() => { setVisible(false); setSchool(item.name) }} />
  );
  const onButtonPress = React.useCallback((type, options) => {

    ImagePicker.openPicker({
      width: 120,
      height: 120,
      cropping: true,
      includeBase64: true
    }).then(image => {
      // console.log("图像参数返回",image);
      setImgHeader(() => `data:${image.mime};base64,${image.data}`)
    });

  }, []);
  const getUserInfo = async () => {
    // /api/v1/info
    const response =await get('/api/v1/info');
    // console.log('首页',response);
    if(response.code == "0"){
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            { name: 'Chat' } // 替换为你要跳转的目标页面的名称
          ],
        })
      );
    }
    else{
      SplashScreen.hide();
    }
   
    //  .then(response => {
    //       console.log('response', response);
    //       if (response.code == "0") {
    //         AsyncStorage.setItem('token', response.token)
    //         navigation.navigate('Chat');
    //       }
    //       else {
    //         Alert.alert('提示', response.message);
    //       }
    //     })
  }
  useEffect(()=>{
    getUserInfo();
  },[]);
  return (
    <KeyboardAvoidingView style={{flex:1, flexDirection:'column',justifyContent:'space-between'}}>
      <ScrollView style={{flex:1}}>
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 18, textAlign: 'center', lineHeight: 30 }}>注册</Text>
        </View>
        <Item style={{ justifyContent: 'center' }}>
          <TouchableWithoutFeedback onPress={onButtonPress}>
            {!imgHeader && <View style={{ width: 100, height: 100, borderRadius: 100, backgroundColor: 'rgba(0,0,0,0.05)', justifyContent: 'center', alignItems: 'center' }}>
              <AddIcon width={40} height={40} fill="#8c8c8c" />
            </View> || <Image style={{ width: 100, height: 100, borderRadius: 100 }} resizeMode="cover" source={{ uri: imgHeader }} />}
          </TouchableWithoutFeedback>
        </Item>
        <Item>
          <TextInput style={{ flex: 1 }} placeholder="请输入昵称" value={nickName} onChangeText={nickName => setNickName(nickName)} />
        </Item>
        <Item>
          <Select
            style={{ flex: 1 }}
            placeholder="请选择性别"
            value={['女', '男'][selectedIndex - 1]}
            selectedIndex={selectedIndex}
            onSelect={(index) => setSelectedIndex(index)}
          >
            <SelectItem title='女' />
            <SelectItem title='男' />
          </Select>
        </Item>
        <Item>
          <Datepicker
            style={{ flex: 1 }}
            placeholder="请选择生日"
            min={new Date(new Date().getFullYear() - 100, new Date().getMonth(), new Date().getDate())}
            date={date}
            initialVisibleDate={new Date('1991-01-01T00:00:00.000Z')}
            onSelect={nextDate =>{ setDate(nextDate);console.log('nextDate',nextDate);}}
          />
        </Item>
        <Item>
          <Popover
            anchor={() => <TextInput style={{ flex: 1 }} placeholder="请输入学校" value={school} onChangeText={v => { setVisible(true); setSchool(v); setData(() => { return SchoolData.filter(item => item.name.indexOf(v) > -1) }); }} />}
            visible={visible}
            fullWidth={true}
            placement="bottom start"
            onBackdropPress={() => setVisible(false)}
          >
            <ScrollView style={{ maxHeight: 300 }}>
              <List
                data={data}
                renderItem={renderItem}
              />
            </ScrollView>

          </Popover>
        </Item>
        <Item>
          <TextInput style={{ flex: 1 }} placeholder="请输入手机号" value={tel} onChangeText={tel => setTel(tel)} />
        </Item>
        <Item>
          <TextInput style={{ flex: 1 }} placeholder="请输入密码" secureTextEntry={true} value={password} onChangeText={password => setPassword(password)} />
        </Item>
        <Item>
          <TextInput style={{ flex: 1 }} placeholder="请输入验证码" value={verificationCode} onChangeText={verificationCode => onChangeverificationCode(verificationCode)} />
          <View style={{ flex: 0.5 }}>
            <TouchableWithoutFeedback onPress={() => {

              handleSend(tel);
            }}>
              <Text style={{ textAlign: 'center' }}>{countdown == 0 && '发送验证码' || `${countdown}s后重发`} </Text>
            </TouchableWithoutFeedback>
          </View>
        </Item>
        <View style={{ padding: 20, justifyContent: 'center', flexDirection: 'row' }}>
          <TouchableWithoutFeedback onPress={handleRegister}>
            <View style={{ backgroundColor: '#422ddd', padding: 15, borderRadius: 100, width: 300 }}>
              <Text style={{ textAlign: 'center', color: '#fff', fontSize: 18 }}>注册</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View>
        </View>
        <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
          <TouchableWithoutFeedback onPress={() => {
            navigation.navigate('Login');
          }}>
            <View style={{ padding: 15, borderRadius: 100, width: 300 }}>
              <Text style={{ textAlign: 'center', color: '#000', fontSize: 18 }}>登录</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </ScrollView>
      
    </KeyboardAvoidingView >
  )
}
export default Login;

