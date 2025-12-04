// src/data/locations.ts
// 模拟的高德地图地点列表，方便在本地不依赖真实地图 SDK 也能选择起终点。
export interface MapLocation {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

export const mockLocations: MapLocation[] = [
  {
    id: 'l1',
    name: '人民广场',
    address: '上海市黄浦区人民大道200号',
    latitude: 31.232275,
    longitude: 121.469207,
  },
  {
    id: 'l2',
    name: '陆家嘴',
    address: '上海市浦东新区陆家嘴环路',
    latitude: 31.240105,
    longitude: 121.51441,
  },
  {
    id: 'l3',
    name: '外滩',
    address: '上海市黄浦区中山东一路',
    latitude: 31.240985,
    longitude: 121.490317,
  },
  {
    id: 'l4',
    name: '虹桥火车站',
    address: '上海市闵行区申虹路',
    latitude: 31.197646,
    longitude: 121.321564,
  },
  {
    id: 'l5',
    name: '浦东国际机场',
    address: '上海市浦东新区迎宾大道6000号',
    latitude: 31.144343,
    longitude: 121.808349,
  },
  {
    id: 'l6',
    name: '徐家汇',
    address: '上海市徐汇区虹桥路1号',
    latitude: 31.19053,
    longitude: 121.43687,
  },
];
