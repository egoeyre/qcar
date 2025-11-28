// src/screens/Auth/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export const LoginScreen: React.FC = () => {
  const { signInWithOtp } = useAuth();
  const [phone, setPhone] = useState('');

  const handleLogin = async () => {
    if (!phone) {
      Alert.alert('提示', '请输入手机号');
      return;
    }

    // 这里先简单调用 OTP 登录，后续可以增加验证码输入等流程
    const { error } = await signInWithOtp(phone);
    if (error) {
      console.log(error);
      Alert.alert('登录失败', error.message || '请稍后重试');
      return;
    }
    Alert.alert('验证码已发送', '请查收短信并完成登录（后续可以增加验证码输入页）');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>代驾服务</Text>
      <Text style={styles.subtitle}>使用手机号登录</Text>

      <TextInput
        style={styles.input}
        placeholder="请输入手机号（带区号，如 +86...）"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      <Button title="获取验证码并登录" onPress={handleLogin} />

      <Text style={styles.tip}>
        MVP 阶段可以只允许测试手机号登录，或先用邮箱密码登录，之后再替换为真实短信通道。
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  tip: {
    marginTop: 16,
    fontSize: 12,
    color: '#999',
  },
});
