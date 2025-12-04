// src/utils/geo.ts
import { MapLocation } from '../data/locations';

// 粗略估算两地距离（单位：公里），用于费用预估。
export const calculateDistanceKm = (a: MapLocation, b: MapLocation): number => {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371; // 地球半径，km
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const haversine =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // 保留 1 位小数
};
