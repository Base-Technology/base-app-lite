import axios from 'axios';
import { Alert } from "react-native";

const api = axios.create({
  baseURL: 'https://movie.jdd001.top', // 设置基础URL
  timeout: 5000, // 设置请求超时时间
});

// 封装GET请求方法
export const get = async (url, params) => {
  try {
    const response = await api.get(url, { params });
    return response.data;
  } catch (error) {
    // 处理请求错误
    console.error('GET request error:', error);
    throw error;
  }
};

// 封装POST请求方法
export const post = async (url, data) => {
  try {
    const response = await api.post(url, data);
    return response.data;
  } catch (error) {
    // 处理请求错误
    console.error('POST request error:', error);
    Alert.alert('提示', JSON.stringify(error));
    throw error;
  }
  // return fetch('https://movie.jdd001.top' + url, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(data),
  // })
  //   .then(response => response.json())
  //   .then(data => {
  //     // 处理响应数据
  //     console.log(data);
  //     return data;
  //   })
  //   .catch(error => {
  //     // 处理错误
  //     console.error(error);
  //     Alert.alert('提示', JSON.stringify(error));
  //   });
};

export default api;
