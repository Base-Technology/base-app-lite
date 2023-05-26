import React, { useEffect } from "react";
import { View, TouchableWithoutFeedback,Alert } from "react-native";
import { Input as TextInput } from '@ui-kitten/components';

import Text from "../../components/BaseText";
import CheckIcon from "../../assets/icon_check.svg";
import { verificationCode as sendVerificationCode } from "../../mail/service";
import { post } from '../../utils/request';
const Item = (props) => <View style={{ marginHorizontal: 20, marginVertical: 5, flexDirection: 'row', alignItems: 'center' }}>
  {props.children}
</View>
const Login = ({ navigation }) => {


  const [checked, setChecked] = React.useState(true);
  const [countdown, setCountdown] = React.useState(0);
  const [tel, setTel] = React.useState('');
  const [verificationCode, onChangeverificationCode] = React.useState('');
  const [password, setPassword] = React.useState('');

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
      "username": "12",
      "password": password,
      "phone": tel,
      "area": "1",
      "school": "2"
    }
    post('/api/v1/register', data).then(response => {
      console.log('response', response);
      if (response.code == "0") {
        navigation.navigate('UserInfo');
      }
      else {
        Alert.alert('提示',response.message);
      }
    })
  }
  return (
    <View style={{ height: 760 }}>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 18, textAlign: 'center', lineHeight: 30 }}>注册</Text>
      </View>
      <Item>
        <TextInput style={{ flex: 1 }} placeholder="请输入手机号" value={tel} onChangeText={tel => setTel(tel)} />
      </Item>
      <Item>
        <TextInput style={{ flex: 1 }} placeholder="请输入密码" secureTextEntry={true} value={password} onChangeText={password => setPassword(password)} />
      </Item>
      <Item>
        <TextInput style={{ flex: 1 }} placeholderTextColor="#8c8c8c" color="#000" placeholder="请输入验证码" value={verificationCode} onChangeText={verificationCode => onChangeverificationCode(verificationCode)} />
        <View style={{flex:0.5}}>
          <TouchableWithoutFeedback onPress={() => {
            countdown == 0 && setCountdown(60);
            sendVerificationCode(tel);
          }}>
            <Text style={{textAlign:'center'}}>{countdown == 0 && '发送验证码' || `${countdown}s后重发`} </Text>
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
      <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
        <TouchableWithoutFeedback onPress={() => {
          navigation.navigate('Login');
        }}>
          <View style={{ padding: 15, borderRadius: 100, width: 300 }}>
            <Text style={{ textAlign: 'center', color: '#000', fontSize: 18 }}>登录</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>

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

