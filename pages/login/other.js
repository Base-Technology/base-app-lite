import React, { Component, useState, useEffect } from "react";
import { View, TouchableWithoutFeedback, ScrollView, Image, TextInput } from "react-native";
import Text from "../../components/BaseText";
import ArrowRightIcon from "../../assets/icon_arrow_right.svg";

import BackIcon from "../../assets/icon_close.svg";
import CheckIcon from "../../assets/icon_check.svg";
import ImagePicker from 'react-native-image-crop-picker';
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

  useEffect(() => {
    let intervalId;

    if (countdown > 0) {
      intervalId = setInterval(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [countdown]);
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
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 18, textAlign: 'center', lineHeight: 30 }}>注册</Text>
      </View>
      <View style={{ marginHorizontal: 20, borderBottomColor: 'rgba(0,0,0,0.5)', borderBottomWidth: 1 }}>
        <TextInput  placeholder="请输入手机号" secureTextEntry={true} value={password} onChangeText={password => onChangePassword(password)} />
      </View>
      <View style={{ marginHorizontal: 20, borderBottomColor: 'rgba(0,0,0,0.5)', borderBottomWidth: 1 }}>
        <TextInput  placeholder="请输入密码" secureTextEntry={true} value={password} onChangeText={password => onChangePassword(password)} />
      </View>
      <View style={{ marginHorizontal: 20, borderBottomColor: 'rgba(0,0,0,0.5)', borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center' }}>
        <TextInput style={{ flex: 1 }} placeholderTextColor="#8c8c8c" color="#000" placeholder="请输入验证码" value={verificationCode} onChangeText={verificationCode => onChangeverificationCode(verificationCode)} />
        <TouchableWithoutFeedback onPress={() => {
          countdown == 0 && setCountdown(60);
          sendVerificationCode(mail);
        }}>
          <Text>{countdown == 0 && '发送' || `${countdown}s后重发`} </Text>
        </TouchableWithoutFeedback>

      </View>

      {/* <View style={{ marginHorizontal: 20, borderBottomColor: 'rgba(0,0,0,0.5)', borderBottomWidth: 1 }}>
        <TextInput placeholder="请输入昵称" value={mail} onChangeText={mail => onChangeMail(mail)} />
      </View>
      <View style={{ marginHorizontal: 20, borderBottomColor: 'rgba(0,0,0,0.5)', borderBottomWidth: 1 }}>
        <TextInput  placeholder="请输入密码" secureTextEntry={true} value={password} onChangeText={password => onChangePassword(password)} />
      </View>
      <View style={{ marginHorizontal: 20, borderBottomColor: 'rgba(0,0,0,0.5)', borderBottomWidth: 1 }}>
        <TextInput  placeholder="请选择生日" secureTextEntry={true} value={password} onChangeText={password => onChangePassword(password)} />
      </View>
      <View style={{ marginHorizontal: 20, borderBottomColor: 'rgba(0,0,0,0.5)', borderBottomWidth: 1 }}>
        <TextInput  placeholder="请选择学校" secureTextEntry={true} value={password} onChangeText={password => onChangePassword(password)} />
      </View> */}
      <View style={{ padding: 20, justifyContent: 'center', flexDirection: 'row' }}>
        <TouchableWithoutFeedback onPress={() => {
          // if (password != confirmPassword) {
          //   throw new Error("password and confirm password not match");
          // }
          // await register(mail, password, verificationCode);
          navigation.navigate('UserInfo');
        }}>
          <View style={{ backgroundColor: '#422ddd', padding: 15, borderRadius: 100, width: 300 }}>
            <Text style={{ textAlign: 'center', color: '#fff', fontSize: 18 }}>注册</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
      <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
        <TouchableWithoutFeedback onPress={() => {
          // if (password != confirmPassword) {
          //   throw new Error("password and confirm password not match");
          // }
          // await register(mail, password, verificationCode);
         navigation.navigate('Login');
         
        }}>
          <View style={{  padding: 15, borderRadius: 100, width: 300 }}>
            <Text style={{ textAlign: 'center', color: '#000', fontSize: 18 }}>登录</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
      {/* <TouchableWithoutFeedback onPress={() => navigation.navigate('Login')}>
        <View style={{ marginTop: 30, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <View>
            <Text style={{ textAlign: 'center', lineHeight: 20 }}>登录</Text>
          </View>
          <View style={{ paddingTop: 2 }}>
            <ArrowRightIcon width={15} height={15} fill="#000" />
          </View>
        </View>
      </TouchableWithoutFeedback> */}
      {/* <View style={{ paddingHorizontal: 20 }}>
        <Text style={{ marginTop: 10, }}>如果登录成功，未注册的电话号码将自动注册

</Text>

      </View> */}
      <View style={{ position: 'absolute', bottom: 20, justifyContent: 'center', right: 0, left: 0, flexDirection: 'row', alignItems: 'center' }}>
        <TouchableWithoutFeedback onPress={() => setChecked(data => !data)}>
          <View style={{ width: 14, height: 14, borderColor: '#8c8c8c', borderWidth: 1, borderRadius: 100, alignItems: 'center', justifyContent: 'center', backgroundColor: checked && '#422ddd' || 'rgba(0,0,0,0)', marginRight: 5 }}>
            {checked && <CheckIcon width={10} height={10} fill="#fff" />}
          </View>
        </TouchableWithoutFeedback>
        <Text>我同意《用户协议》
        </Text>
      </View>
    </View>
  )
}
export default Login;

