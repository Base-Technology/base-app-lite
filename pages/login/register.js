import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { Input, Button } from '@ui-kitten/components';
import { BaseForm,BaseVCInput } from "../../components/Base";
const Form = BaseForm;
const FormItem = BaseForm.Item;
const Register = () => {
  const handleSubmit = (formData) => {
    // 处理提交逻辑，formData 包含所有输入项的值
    console.log(formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormItem name="name" rule={{ rule: /^[a-zA-Z\s]+$/, message: '请输入姓名' }}>
        <Input placeholder="姓名" />
      </FormItem>
      <FormItem name="name" rule={{ rule: /^[a-zA-Z\s]+$/, message: '请输入姓名' }}>
        <BaseVCInput />
      </FormItem>
      <FormItem name="email" rule={{ rule: /^[\w.-]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,})+$/, message: '请输入邮箱' }}>
        <Input placeholder="邮箱" />
      </FormItem>
      <FormItem name="password" rule={{ rule: /^[a-zA-Z\s]+$/, message: '请输入姓名' }}>
        <Input placeholder="密码" secureTextEntry />
      </FormItem>
      <FormItem>
        <Button type="submit">注册</Button>
      </FormItem>
    </Form>
  );
};

const styles = StyleSheet.create({
  form: {
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

export default Register;
