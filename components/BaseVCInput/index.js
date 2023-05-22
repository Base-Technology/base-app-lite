import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, Button } from '@ui-kitten/components';
const VerificationCodeInput = ({ value, onChangeText }) => {
  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    let interval = null;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setIsDisabled(false);
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [timer]);

  const handleInputChange = (text) => {
    setCode(text);
    if (onChangeText) {
      onChangeText(text);
    }
  };

  const handleSendCode = () => {
    // 发送验证码逻辑
    setIsDisabled(true);
    setTimer(60);
  };

  return (
    <View style={styles.container}>
      <Input
        style={styles.input}
        value={value || code}
        onChangeText={handleInputChange}
        placeholder="验证码"
        keyboardType="numeric"
      />
      <Button
        disabled={isDisabled || timer > 0}
        onPress={handleSendCode}
      >{timer > 0 ? `${timer}秒后重发` : '发送验证码'}</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    marginRight: 10,
    height: 40,
  },
});

export default VerificationCodeInput;
