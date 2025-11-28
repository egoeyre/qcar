// src/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export const HomeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>代驾下单</Text>
      <Text>这里后续会放：起点 / 终点 / 预估价格 / 提交订单等组件。</Text>
      <Button title="模拟创建订单" onPress={() => {}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 16 },
});
