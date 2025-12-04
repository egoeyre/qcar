// src/screens/HomeScreen.tsx
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrdersContext';
import { MapLocation, mockLocations } from '../data/locations';
import { calculateDistanceKm } from '../utils/geo';
import { estimateRidePrice } from '../utils/pricing';

type PickerTarget = 'pickup' | 'dropoff' | null;

const MapPlaceholder: React.FC<{
  pickup?: MapLocation | null;
  dropoff?: MapLocation | null;
}> = ({ pickup, dropoff }) => {
  return (
    <View style={styles.map}>
      <Text style={styles.mapTitle}>高德地图（示意）</Text>
      <Text style={styles.mapHint}>在接入正式 SDK 前，这里展示静态示意图</Text>
      {pickup && (
        <View style={styles.markerRow}>
          <View style={[styles.markerDot, { backgroundColor: '#10b981' }]} />
          <Text style={styles.markerText}>起点：{pickup.name}</Text>
        </View>
      )}
      {dropoff && (
        <View style={styles.markerRow}>
          <View style={[styles.markerDot, { backgroundColor: '#ef4444' }]} />
          <Text style={styles.markerText}>终点：{dropoff.name}</Text>
        </View>
      )}
      <View style={styles.mapFooter}>
        <Text style={styles.mapFooterText}>可替换为高德地图 SDK / WebView 组件</Text>
      </View>
    </View>
  );
};

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { session } = useAuth();
  const { createOrder } = useOrders();
  const [pickup, setPickup] = useState<MapLocation | null>(mockLocations[0]);
  const [dropoff, setDropoff] = useState<MapLocation | null>(mockLocations[1]);
  const [note, setNote] = useState('');
  const [pickerTarget, setPickerTarget] = useState<PickerTarget>(null);

  const distanceKm = useMemo(() => {
    if (!pickup || !dropoff) return 0;
    return calculateDistanceKm(pickup, dropoff);
  }, [pickup, dropoff]);

  const priceInfo = useMemo(
    () => estimateRidePrice(distanceKm),
    [distanceKm]
  );

  const onSubmit = async () => {
    if (!pickup || !dropoff) {
      Alert.alert('提示', '请先选择起点和终点');
      return;
    }
    if (!session) {
      Alert.alert('提示', '请先登录');
      return;
    }

    const order = await createOrder({
      passengerId: session.user.id,
      pickupAddress: pickup.address,
      dropoffAddress: dropoff.address,
      estimatedDistanceKm: distanceKm,
      estimatedPrice: priceInfo.price,
    });

    Alert.alert('下单成功', '已创建订单，进入详情查看进度', [
      {
        text: '查看订单',
        onPress: () =>
          navigation.navigate('Orders', {
            screen: 'OrderDetail',
            params: { orderId: order.id },
          }),
      },
    ]);
  };

  const renderPicker = () => (
    <Modal visible={!!pickerTarget} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>选择{pickerTarget === 'pickup' ? '起点' : '终点'}</Text>
          <ScrollView>
            {mockLocations.map((loc) => (
              <TouchableOpacity
                key={loc.id}
                style={styles.locationItem}
                onPress={() => {
                  if (pickerTarget === 'pickup') setPickup(loc);
                  if (pickerTarget === 'dropoff') setDropoff(loc);
                  setPickerTarget(null);
                }}
              >
                <Text style={styles.locationName}>{loc.name}</Text>
                <Text style={styles.locationAddress}>{loc.address}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.closeBtn} onPress={() => setPickerTarget(null)}>
            <Text style={styles.closeText}>关闭</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>代驾下单</Text>
      <Text style={styles.subtitle}>高德地图选点 · 费用预估 · 本地订单流转</Text>

      <MapPlaceholder pickup={pickup} dropoff={dropoff} />

      <View style={styles.formCard}>
        <Text style={styles.sectionTitle}>行程信息</Text>

        <TouchableOpacity
          style={styles.field}
          onPress={() => setPickerTarget('pickup')}
        >
          <Text style={styles.label}>起点</Text>
          <Text style={styles.value}>{pickup ? pickup.address : '选择起点（高德 POI）'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.field}
          onPress={() => setPickerTarget('dropoff')}
        >
          <Text style={styles.label}>终点</Text>
          <Text style={styles.value}>{dropoff ? dropoff.address : '选择终点（高德 POI）'}</Text>
        </TouchableOpacity>

        <View style={[styles.field, styles.rowBetween]}>
          <View>
            <Text style={styles.label}>预估距离</Text>
            <Text style={styles.value}>
              {pickup && dropoff ? `${distanceKm} km` : '-'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.swapBtn}
            onPress={() => {
              setPickup(dropoff);
              setDropoff(pickup);
            }}
          >
            <Text style={styles.swapText}>交换起终点</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.sectionTitle}>费用预估</Text>
        <Text style={styles.price}>¥ {priceInfo.price.toFixed(2)}</Text>
        <Text style={styles.priceHint}>
          起步 ¥{priceInfo.base}，每公里 +¥3（封顶 ¥35），
          {priceInfo.capped ? '已达封顶价' : '向上取整计费'}
        </Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.sectionTitle}>备注</Text>
        <TextInput
          style={styles.input}
          placeholder="可以写：上车点描述、车牌号等（不影响费用计算）"
          value={note}
          onChangeText={setNote}
          multiline
        />
      </View>

      <TouchableOpacity style={styles.submitBtn} onPress={onSubmit}>
        <Text style={styles.submitText}>提交订单</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.linkBtn}
        onPress={() => navigation.navigate('Orders')}
      >
        <Text style={styles.linkText}>查看订单列表</Text>
      </TouchableOpacity>

      {renderPicker()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 4 },
  subtitle: { color: '#6b7280', marginBottom: 12 },
  map: {
    height: 180,
    borderRadius: 12,
    backgroundColor: '#0ea5e9',
    padding: 12,
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  mapTitle: { color: '#fff', fontWeight: '700', fontSize: 16 },
  mapHint: { color: '#e0f2fe' },
  markerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  markerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  markerText: { color: '#fff', fontWeight: '600' },
  mapFooter: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 8,
    borderRadius: 8,
  },
  mapFooterText: { color: '#e0f2fe', fontSize: 12 },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  field: { marginBottom: 12 },
  label: { color: '#6b7280', marginBottom: 4 },
  value: { fontSize: 15, color: '#111827' },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  swapBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  swapText: { color: '#2563eb', fontWeight: '600' },
  price: { fontSize: 28, fontWeight: '700', color: '#16a34a' },
  priceHint: { color: '#6b7280', marginTop: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 12,
    minHeight: 60,
  },
  submitBtn: {
    backgroundColor: '#111827',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  linkBtn: { alignItems: 'center', marginTop: 10 },
  linkText: { color: '#2563eb', fontWeight: '600' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '70%',
    padding: 16,
  },
  modalTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  locationItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  locationName: { fontWeight: '600' },
  locationAddress: { color: '#6b7280', marginTop: 2 },
  closeBtn: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#111827',
  },
  closeText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});
