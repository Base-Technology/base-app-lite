import React, { useState } from "react";
import { View, TouchableWithoutFeedback, Alert } from "react-native";
import { Input as TextInput } from '@ui-kitten/components';
import Text from "../../components/BaseText";
import ArrowRightIcon from "../../assets/icon_arrow_right.svg";

import { post } from '../../utils/request';
const Item = (props) => <View style={{ marginHorizontal: 20, marginVertical: 5 }}>
  {props.children}
</View>
const Login = ({ navigation }) => {
  const [tel, setTel] = useState('13121758943');
  const [password, onChangePassword] = useState('123456');
  // Login
  const handleLogin = () => {
    const data = {
      "password": password,
      "phone": tel
    }
    post('/api/v1/login', data).then(response => {
      console.log('response', response);
      if (response.code == "0") {
        navigation.push('Chat');
      }
      else {
        Alert.alert(response.message);
      }
    })
  }
  return (
    <View style={{ height: 760 }}>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 24, textAlign: 'center', lineHeight: 30 }}>登录</Text>
      </View>
      <Item>
        <TextInput style={{}} placeholder="请输入手机号" value={tel} onChangeText={tel => setTel(tel)} />
      </Item>
      <Item>
        <TextInput placeholder="请输入密码" secureTextEntry={true} value={password} onChangeText={password => onChangePassword(password)} />
      </Item>
      <View style={{ paddingHorizontal: 20, justifyContent: 'center', flexDirection: 'row', marginTop: 20 }}>
        <TouchableWithoutFeedback onPress={handleLogin}>
          <View style={{ backgroundColor: '#422ddd', padding: 15, borderRadius: 100, width: 300 }}>
            <Text style={{ textAlign: 'center', color: '#fff', fontSize: 18 }}>登录</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
      <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
        <TouchableWithoutFeedback onPress={() => {
          // if (password != confirmPassword) {
          //   throw new Error("password and confirm password not match");
          // }
          // await register(mail, password, verificationCode);
         navigation.navigate('Register');
         
        }}>
          <View style={{  padding: 15, borderRadius: 100, width: 300 }}>
            <Text style={{ textAlign: 'center', color: '#000', fontSize: 18 }}>注册</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
      <View>
        <TouchableWithoutFeedback onPress={() => Alert.alert('未开启')}>
          <View style={{ marginTop: 30, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <View>
              <Text style={{ textAlign: 'center', lineHeight: 20, }}>忘记密码</Text>
            </View>
            <View style={{ paddingTop: 2 }}>
              <ArrowRightIcon width={15} height={15} fill="#000" />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
      
    </View>
  )
}
export default Login;

