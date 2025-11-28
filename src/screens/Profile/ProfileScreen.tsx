// src/screens/Profile/ProfileScreen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export const ProfileScreen: React.FC = () => {
  const { signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>我的</Text>
      <Text>后续可以展示：姓名、手机号、常用地址、司机申请入口等。</Text>

      <Button title="退出登录" onPress={signOut} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 16 },
});
