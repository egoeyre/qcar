// src/utils/pricing.ts
interface PriceResult {
  price: number;
  base: number;
  distanceCharge: number;
  capped: boolean;
}

/**
 * 预估费用：起步价 10 元，每增加 1km 加 3 元，封顶 35 元。
 * 约定：起步价包含首公里，超过 1km 后向上取整计算附加。
 */
export const estimateRidePrice = (distanceKm: number): PriceResult => {
  const base = 10;
  const extraDistance = Math.max(distanceKm - 1, 0);
  const distanceCharge = Math.ceil(extraDistance) * 3;
  const raw = base + distanceCharge;
  const price = Math.min(raw, 35);

  return { price, base, distanceCharge, capped: raw > 35 };
};
