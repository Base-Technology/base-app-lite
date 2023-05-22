import axios from 'axios';

const api = axios.create({
  baseURL: 'https://119.45.212.83:8080', // 设置基础URL
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
    throw error;
  }
};

export default api;
