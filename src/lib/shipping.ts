// Client-safe shipping constants — this file has NO server-only imports.

export interface ShippingInfo {
  country: string;
  cost: number;
  deliveryTime: string;
}

export const SHIPPING_RULES: ShippingInfo[] = [
  { country: 'Kosovë', cost: 2, deliveryTime: '48 orë' },
  { country: 'Shqipëri', cost: 6, deliveryTime: 'Përafërsisht 5 ditë' },
  { country: 'Maqedonia e Veriut', cost: 6, deliveryTime: 'Përafërsisht 6 ditë' },
];

export function getShippingInfo(country: string): ShippingInfo | undefined {
  return SHIPPING_RULES.find(s => s.country === country);
}
