export type ExtraId = 'child_seat' | 'second_driver_south' | 'second_driver_north' | 'island_delivery';

export type Extra = {
  id: ExtraId;
  label: string;
  description: string;
  pricingRule: 'free' | 'fixed' | 'by_agreement';
  price?: number; // Fixed price for fixed pricing rule
};

export const extras: Extra[] = [
  {
    id: 'child_seat',
    label: 'Child seat / bassinet / booster',
    description: 'Free child seat, bassinet, or booster seat for your rental',
    pricingRule: 'free',
    price: 0,
  },
  {
    id: 'second_driver_south',
    label: 'Second driver — South (€30)',
    description: 'Additional driver authorization for South zone (South Airport TFS, Los Cristianos)',
    pricingRule: 'fixed',
    price: 30,
  },
  {
    id: 'second_driver_north',
    label: 'Second driver — North (€80)',
    description: 'Additional driver authorization for North zone (North Airport TFN, Puerto de la Cruz, Santa Cruz)',
    pricingRule: 'fixed',
    price: 80,
  },
  {
    id: 'island_delivery',
    label: 'Delivery / pickup across the island',
    description: 'Delivery and pickup service across Tenerife (by agreement)',
    pricingRule: 'by_agreement',
  },
];

export function getExtra(id: ExtraId): Extra | undefined {
  return extras.find((e) => e.id === id);
}

