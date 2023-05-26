import React, { Component, useState, useEffect } from "react";
import { View, TouchableWithoutFeedback, Image } from "react-native";
import { Input as TextInput, Datepicker } from '@ui-kitten/components';

import Text from "../../components/BaseText";
import ArrowRightIcon from "../../assets/icon_arrow_right.svg";
import AddIcon from "../../assets/icon_add_big.svg";
import BackIcon from "../../assets/icon_close.svg";
import CheckIcon from "../../assets/icon_check.svg";
import { IndexPath, Layout, Select, SelectItem } from '@ui-kitten/components';

// import * as ImagePicker from 'react-native-image-picker';
import { register, verificationCode as sendVerificationCode } from "../../mail/service";
import ImagePicker from 'react-native-image-crop-picker';
const Data=['清华大学','北京大学'];
const Item = (props) => <View style={{ marginHorizontal: 20, marginVertical: 5 }}>
  {props.children}
</View>
const UserInfo = ({ navigation }) => {
  const [selectedIndex, setSelectedIndex] = React.useState();
  const [selectedIndexSchool, setSelectedIndexSchool] = React.useState();
  const [date, setDate] = React.useState();
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

    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true
    }).then(image => {
      setImgHeader(() => image.path)
    });
    // setModalVisible(true);
    // return;
    // type = 'capture2';
    // options = {
    //   saveToPhotos: true,
    //   mediaType: 'photo',
    //   includeBase64: false,
    //   includeExtra: true,
    // };
    // console.log(options)
    // if (type === 'capture') {
    //   ImagePicker.launchCamera(options, setResponse);
    // } else {
    //   ImagePicker.launchImageLibrary(options, (response) => {
    //     setImgHeader(img => response?.assets[0]?.uri)
    //   });
    // }
    // console.log("12345asdfqwerzxcv", imgList)
  }, []);
  return (
    <View>

      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 18, textAlign: 'center', lineHeight: 30 }}>完善个人信息</Text>
      </View>
      <Item>
        <TouchableWithoutFeedback onPress={onButtonPress}>
          {!imgHeader && <View style={{ width: 100, height: 100, borderRadius: 100, backgroundColor: 'rgba(0,0,0,0.05)', justifyContent: 'center', alignItems: 'center' }}>
            <AddIcon width={40} height={40} fill="#8c8c8c" />
          </View> || <Image style={{ width: 100, height: 100, borderRadius: 100 }} resizeMode="cover" source={{ uri: imgHeader }} />}
        </TouchableWithoutFeedback>
      </Item>
      <Item>
        <TextInput placeholder="请输入昵称" value={mail} onChangeText={mail => onChangeMail(mail)} />
      </Item>
      <Item>
        {/* <Select
          placeholder="请选择性别"
          value={['女','男'][selectedIndex-1]}
          selectedIndex={selectedIndex}
          onSelect={(index) => setSelectedIndex(index)}
        >
          <SelectItem title='女' />
          <SelectItem title='男' />
        </Select> */}
      </Item>
      <Item>
        <Datepicker
          placeholder="请选择生日"
          date={date}
          onSelect={nextDate => setDate(nextDate)}
        />
      </Item>
      <Item>
        {/* <Select
          placeholder="请选择学校"
          value={Data[selectedIndexSchool.row]}
          selectedIndex={selectedIndexSchool}
          onSelect={index => setSelectedIndexSchool(index)}
        >
          {
            Data.map(item=><SelectItem title={item} />)
          }
        </Select> */}
      </Item>
      <View style={{ padding: 20, justifyContent: 'center', flexDirection: 'row' }}>
        <TouchableWithoutFeedback onPress={async () => {
          // if (password != confirmPassword) {
          //   throw new Error("password and confirm password not match");
          // }
          // await register(mail, password, verificationCode);
          navigation.navigate('Chat');
        }}>
          <View style={{ backgroundColor: '#422ddd', padding: 15, borderRadius: 100, width: 300 }}>
            <Text style={{ textAlign: 'center', color: '#fff', fontSize: 18 }}>完成</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  )
}
export default UserInfo;

