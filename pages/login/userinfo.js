import React, { Component, useState, useEffect } from "react";
import { View, TouchableWithoutFeedback, ScrollView, Image, TextInput } from "react-native";
import Text from "../../components/BaseText";
import ArrowRightIcon from "../../assets/icon_arrow_right.svg";
import AddIcon from "../../assets/icon_add_big.svg";
import BackIcon from "../../assets/icon_close.svg";
import CheckIcon from "../../assets/icon_check.svg";
import * as ImagePicker from 'react-native-image-picker';
import { register, verificationCode as sendVerificationCode } from "../../mail/service";

const Login = ({ navigation }) => {
  const [tabsData, setTabsData] = useState([
    {
      active: false,
      name: 'Posts'
    },
    {
      active: false,
      name: 'Users'
    }
  ]);
  const [checked, setChecked] = React.useState(true);
  const [countdown, setCountdown] = React.useState(0);
  const [mail, onChangeMail] = React.useState('');
  const [verificationCode, onChangeverificationCode] = React.useState('');
  const [password, onChangePassword] = React.useState('');
  const [confirmPassword, onChangeconfirmPassword] = React.useState('');
  const [imgHeader, setImgHeader] = useState('');
  useEffect(() => {
    let intervalId;

    if (countdown > 0) {
      intervalId = setInterval(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [countdown]);
  const onButtonPress = React.useCallback((type, options) => {
    // setModalVisible(true);
    // return;
    type = 'capture2';
    options = {
      saveToPhotos: true,
      mediaType: 'photo',
      includeBase64: false,
      includeExtra: true,
    };
    console.log(options)
    if (type === 'capture') {
      ImagePicker.launchCamera(options, setResponse);
    } else {
      ImagePicker.launchImageLibrary(options, (response) => {
        setImgHeader(img => response?.assets[0]?.uri)
      });
    }
    // console.log("12345asdfqwerzxcv", imgList)
  }, []);
  return (
    <View style={{ height: 760 }}>
      {/* Search */}
      {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 10 }}>
        <View>
          <BackIcon width={20} height={20} fill={"#fff"} />
        </View>
        <View>
          <Text style={{ color: '#8c8c8c' }}>Help</Text>
        </View>
      </View> */}

      {/* <View style={{ marginHorizontal: 20, borderBottomColor: 'rgba(0,0,0,0.5)', borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center' }}>
        <TextInput style={{ flex: 1 }} placeholderTextColor="#8c8c8c" color="#000" placeholder="请输入验证码" value={verificationCode} onChangeText={verificationCode => onChangeverificationCode(verificationCode)} />
        <TouchableWithoutFeedback onPress={() => {
          countdown == 0 && setCountdown(60);
          sendVerificationCode(mail);
        }}>
          <Text>{countdown == 0 && '发送' || `${countdown}s后重发`} </Text>
        </TouchableWithoutFeedback>

      </View> */}

      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 18, textAlign: 'center', lineHeight: 30 }}>完善个人信息</Text>
      </View>
      <View style={{ marginHorizontal: 20}}>
        <TouchableWithoutFeedback onPress={onButtonPress}>
          {!imgHeader&&<View style={{ width: 100, height: 100, borderRadius: 5, backgroundColor: 'rgba(0,0,0,0.05)', justifyContent: 'center', alignItems: 'center' }}>
            <AddIcon width={40} height={40} fill="#8c8c8c" />
          </View>||<Image style={{ width: 100, height: 100,borderRadius:100 }} resizeMode="cover" source={{ uri: imgHeader }} />}
        </TouchableWithoutFeedback>
      </View>
      <View style={{ marginHorizontal: 20, borderBottomColor: 'rgba(0,0,0,0.5)', borderBottomWidth: 1 }}>
        <TextInput placeholder="请输入昵称" value={mail} onChangeText={mail => onChangeMail(mail)} />
      </View>
      <View style={{ marginHorizontal: 20, borderBottomColor: 'rgba(0,0,0,0.5)', borderBottomWidth: 1 }}>
        <TextInput placeholder="请选择性别" value={password} onChangeText={password => onChangePassword(password)} />
      </View>
      <View style={{ marginHorizontal: 20, borderBottomColor: 'rgba(0,0,0,0.5)', borderBottomWidth: 1 }}>
        <TextInput placeholder="请选择生日" value={password} onChangeText={password => onChangePassword(password)} />
      </View>
      <View style={{ marginHorizontal: 20, borderBottomColor: 'rgba(0,0,0,0.5)', borderBottomWidth: 1 }}>
        <TextInput placeholder="请选择学校"  value={password} onChangeText={password => onChangePassword(password)} />
      </View>
      <View style={{ padding: 20, justifyContent: 'center', flexDirection: 'row' }}>
        <TouchableWithoutFeedback onPress={async () => {
          if (password != confirmPassword) {
            throw new Error("password and confirm password not match");
          }
          await register(mail, password, verificationCode);
          navigation.navigate('Login');
        }}>
          <View style={{ backgroundColor: '#422ddd', padding: 15, borderRadius: 100, width: 300 }}>
            <Text style={{ textAlign: 'center', color: '#fff', fontSize: 18 }}>完成</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  )
}
export default Login;

