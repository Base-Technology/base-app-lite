import React, { Component, useState } from "react";
import { View, TextInput, TouchableWithoutFeedback, ScrollView, Image } from "react-native";
import Text from "../../components/BaseText";
import BackIcon from "../../assets/icon_close.svg";
import ArrowRightIcon from "../../assets/icon_arrow_right.svg";
import CheckIcon from "../../assets/icon_check.svg";
import VideoScreen from "../../components/BaseVideo";
import MembersScreen from "../me/members";
import { Radio } from '@ui-kitten/components';
import { login } from "../../mail/service";
import { addIdentity } from "../../database/identity";
import {} from '../../utils/request'
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
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [checked, setChecked] = React.useState(true);
  const [mail, onChangeMail] = React.useState('');
  const [password, onChangePassword] = React.useState('');
  // Login
  const handleLogin=()=>{
    // /api/v1/login
  }
  return (
    <View style={{ height: 760 }}>
      
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 24, textAlign: 'center', lineHeight: 30 }}>登录</Text>

      </View>
      <View style={{ marginHorizontal: 20, borderBottomColor: 'rgba(0,0,0,0.5)', borderBottomWidth: 1 }}>
        <TextInput  style={{}} placeholder="请输入手机号" value={mail} onChangeText={mail => onChangeMail(mail)} />
      </View>
      <View style={{ marginHorizontal: 20, borderBottomColor: 'rgba(0,0,0,0.5)', borderBottomWidth: 1 }}>
        <TextInput placeholder="请输入密码" secureTextEntry={true} value={password} onChangeText={password => onChangePassword(password)} />
      </View>
      <View style={{ paddingHorizontal: 20, justifyContent: 'center', flexDirection: 'row', marginTop: 20 }}>
        <TouchableWithoutFeedback onPress={async () => {
          await login(mail, password);
          addIdentity(mail, password);
          navigation.navigate('WalletCreate');
        }}>

          <View style={{ backgroundColor: '#422ddd', padding: 15, borderRadius: 100, width: 300 }}>
            <Text style={{ textAlign: 'center', color: '#fff', fontSize: 18 }}>登录</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
      <View>
      
      <TouchableWithoutFeedback onPress={() => navigation.navigate('LoginOther')}>
        <View style={{marginTop:30,flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <View>
            <Text style={{ textAlign: 'center', lineHeight: 20,}}>忘记密码</Text>
          </View>
          <View style={{ paddingTop: 2 }}>
            <ArrowRightIcon width={15} height={15} fill="#000" />
          </View>
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

