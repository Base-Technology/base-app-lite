import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Input, Button,Text } from '@ui-kitten/components';
import { BaseForm, BaseVCInput } from "../../components/Base";
const Form = BaseForm;
const FormItem = BaseForm.Item;
const Login = () => {
  const handleSubmit = (formData) => {
    // 处理提交逻辑，formData 包含所有输入项的值
    console.log(formData);
  };

  return (
    <View>
      <View>
        <Text style={styles.title} category='h4'>登录</Text>
      </View>
      <Form style={styles.form} onSubmit={handleSubmit}>
        <FormItem name="phone" rule={{ rule: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/, message: '手机号码' }}>
          <Input placeholder="请输入手机号码" />
        </FormItem>
        <FormItem name="password" rule={{ rule: /.+/, message: '请输入密码' }}>
          <Input placeholder="请输入密码" secureTextEntry />
        </FormItem>
        <FormItem>
          <Button type="submit">登录</Button>
        </FormItem>
      </Form>
    </View>
  );
};

const styles = StyleSheet.create({
  title:{
    marginTop:80,
    textAlign:'center'
  },
  form: {
    marginTop:40,
    padding: 20,
  },
  formItem: {
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  error: {
    color: 'red',
  },
});

export default Login;
