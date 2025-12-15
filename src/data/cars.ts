export type CarCategory = 'cabrio' | 'suv' | 'economy' | 'ev' | 'motorcycle' | 'luxury';

export type Car = {
  id: string;
  slug: string;
  name: string;
  category: CarCategory;
  specs: string[];
  color?: string;
  pricing: {
    d1_3?: number;
    d4_7?: number;
    d8_plus?: number;
    d8_14?: number;
    month?: number;
    onRequestMonth?: boolean;
  };
  deposit: number;
  image?: string;
};

export const cars: Car[] = [
  {
    id: '1',
    slug: 'jeep-wrangler-sahara-4xe-2022-sky-top',
    name: 'Jeep Wrangler Sahara 4XE 2022 (SKY TOP)',
    category: 'suv',
    specs: ['Plug-in Hybrid', '2.0 petrol + electric', '380 hp', 'Automatic', '4x4'],
    color: 'Red',
    pricing: {
      d1_3: 160,
      d4_7: 140,
      d8_plus: 120,
      month: 2500,
    },
    deposit: 1000,
    image: '/cars/placeholder.jpg',
  },
  {
    id: '2',
    slug: 'audi-a5-cabrio-2022',
    name: 'Audi A5 Cabrio 2022',
    category: 'cabrio',
    specs: ['2.0 diesel', 'Automatic', 'Cabrio'],
    color: 'White',
    pricing: {
      d1_3: 145,
      d4_7: 120,
      d8_plus: 95,
      month: 1900,
    },
    deposit: 600,
    image: '/cars/placeholder.jpg',
  },
  {
    id: '3',
    slug: 'audi-q7-quattro-2020',
    name: 'Audi Q7 Quattro 2020',
    category: 'suv',
    specs: ['3.0 petrol', 'Automatic', 'Quattro/4WD'],
    color: 'Grey',
    pricing: {
      d1_3: 120,
      d4_7: 100,
      d8_plus: 80,
      month: 1600,
    },
    deposit: 1000,
    image: '/cars/placeholder.jpg',
  },
  {
    id: '4',
    slug: 'volkswagen-t-roc-cabrio-2022',
    name: 'Volkswagen T-Roc Cabrio 2022',
    category: 'cabrio',
    specs: ['1.5 petrol', 'Automatic', 'Cabrio'],
    color: 'Red',
    pricing: {
      d1_3: 85,
      d4_7: 80,
      d8_plus: 75,
      month: 1450,
    },
    deposit: 600,
    image: '/cars/placeholder.jpg',
  },
  {
    id: '5',
    slug: 'toyota-yaris-cross-2024',
    name: 'Toyota Yaris Cross 2024',
    category: 'economy',
    specs: ['1.5 hybrid', 'Automatic'],
    color: 'White',
    pricing: {
      d1_3: 60,
      d4_7: 50,
      d8_plus: 40,
      month: 1100,
    },
    deposit: 300,
    image: '/cars/placeholder.jpg',
  },
  {
    id: '6',
    slug: 'mercedes-benz-e450-mhev-cabrio-2022',
    name: 'Mercedes-Benz E450 MHEV Cabrio 2022',
    category: 'cabrio',
    specs: ['3.0 mild-hybrid petrol', '367 hp', 'Automatic', 'Cabrio'],
    pricing: {
      d1_3: 190,
      d4_7: 150,
      d8_14: 120,
      month: 2800,
    },
    deposit: 1000,
    image: '/cars/placeholder.jpg',
  },
  {
    id: '7',
    slug: 'toyota-yaris-2021',
    name: 'Toyota Yaris 2021',
    category: 'economy',
    specs: ['1.5 hybrid', 'Automatic'],
    color: 'Grey',
    pricing: {
      d1_3: 40,
      d4_7: 37,
      d8_plus: 35,
      month: 800,
    },
    deposit: 300,
    image: '/cars/placeholder.jpg',
  },
  {
    id: '8',
    slug: 'kia-ev6-2024',
    name: 'Kia EV6 2024',
    category: 'ev',
    specs: ['Electric', 'Automatic'],
    color: 'Pearl White',
    pricing: {
      d1_3: 100,
      d4_7: 85,
      d8_plus: 75,
      month: 1200,
    },
    deposit: 600,
    image: '/cars/placeholder.jpg',
  },
  {
    id: '9',
    slug: 'lexus-rx450h-2023-white-pano',
    name: 'Lexus RX450h 2023 (white, pano)',
    category: 'suv',
    specs: ['Hybrid', 'Automatic', 'Panoramic roof'],
    color: 'White',
    pricing: {
      d1_3: 120,
      d4_7: 100,
      d8_plus: 90,
      month: 1500,
    },
    deposit: 600,
    image: '/cars/placeholder.jpg',
  },
  {
    id: '10',
    slug: 'lexus-rx450h-2023-dark-blue',
    name: 'Lexus RX450h 2023 (dark blue)',
    category: 'suv',
    specs: ['Hybrid', 'Automatic'],
    color: 'Dark Blue',
    pricing: {
      d1_3: 120,
      d4_7: 100,
      d8_plus: 90,
      month: 1500,
    },
    deposit: 600,
    image: '/cars/placeholder.jpg',
  },
  {
    id: '11',
    slug: 'chevrolet-camaro-cabrio-2019',
    name: 'Chevrolet Camaro Cabrio 2019',
    category: 'cabrio',
    specs: ['3.7 petrol', 'Automatic', 'Cabrio'],
    color: 'Blue',
    pricing: {
      d1_3: 170,
      d4_7: 150,
      d8_plus: 130,
      onRequestMonth: true,
    },
    deposit: 600,
    image: '/cars/placeholder.jpg',
  },
  {
    id: '12',
    slug: 'ford-mustang-cabrio-2018',
    name: 'Ford Mustang Cabrio 2018',
    category: 'cabrio',
    specs: ['2.3 EcoBoost', 'Automatic', 'Cabrio'],
    color: 'Black',
    pricing: {
      d1_3: 150,
      d4_7: 130,
      d8_plus: 110,
      onRequestMonth: true,
    },
    deposit: 600,
    image: '/cars/placeholder.jpg',
  },
  {
    id: '13',
    slug: 'bmw-320d-cabrio-e93-2010',
    name: 'BMW 320d Cabrio e93 (2010)',
    category: 'cabrio',
    specs: ['Diesel', 'Automatic', 'Cabrio'],
    pricing: {
      d1_3: 70,
      d4_7: 60,
      d8_plus: 50,
    },
    deposit: 200,
    image: '/cars/placeholder.jpg',
  },
  {
    id: '14',
    slug: 'mercedes-slk-200-2006',
    name: 'Mercedes SLK 200 (2006)',
    category: 'cabrio',
    specs: ['2.0 petrol', '163 hp', 'Automatic'],
    pricing: {
      d1_3: 50,
      d4_7: 40,
      d8_plus: 30,
    },
    deposit: 300,
    image: '/cars/placeholder.jpg',
  },
  {
    id: '15',
    slug: 'indian-chieftain-1-8-motorcycle-2019',
    name: 'Indian Chieftain 1.8 (Motorcycle) 2019',
    category: 'motorcycle',
    specs: ['1811 cc', '76 hp', '6-speed manual', 'Cruiser'],
    pricing: {
      d1_3: 250,
      d4_7: 170,
      d8_plus: 150,
      onRequestMonth: true,
    },
    deposit: 1000,
    image: '/cars/placeholder.jpg',
  },
  {
    id: '16',
    slug: 'volkswagen-t-roc-cabrio-2020-manual',
    name: 'Volkswagen T-Roc Cabrio 2020 (manual)',
    category: 'cabrio',
    specs: ['1.0 petrol', 'Manual', 'Cabrio'],
    color: 'White',
    pricing: {
      d1_3: 60,
      d4_7: 55,
      d8_plus: 50,
      onRequestMonth: true,
    },
    deposit: 300,
    image: '/cars/placeholder.jpg',
  },
  {
    id: '17',
    slug: 'hyundai-i20',
    name: 'Hyundai i20',
    category: 'economy',
    specs: ['Petrol', 'Automatic', '5 seats'],
    color: 'Blue',
    pricing: {
      d1_3: 40,
      d4_7: 35,
      d8_plus: 30,
      onRequestMonth: true,
    },
    deposit: 300,
    image: '/cars/placeholder.jpg',
  },
  {
    id: '18',
    slug: 'mercedes-benz-e200-w211-kompressor-2005',
    name: 'Mercedes-Benz E200 W211 Kompressor (2005)',
    category: 'economy',
    specs: ['1.8 petrol', '170 hp', 'Automatic 5G-Tronic', 'Panoramic roof'],
    color: 'Grey',
    pricing: {
      d1_3: 50,
      d4_7: 40,
      d8_plus: 30,
    },
    deposit: 300,
    image: '/cars/placeholder.jpg',
  },
  {
    id: '19',
    slug: 'mini-cooper-s-countryman-2015',
    name: 'Mini Cooper S Countryman 2015',
    category: 'suv',
    specs: ['1.6 Turbo', '184 hp', '4x4'],
    pricing: {
      d1_3: 65,
      d4_7: 55,
      d8_plus: 45,
    },
    deposit: 300,
    image: '/cars/placeholder.jpg',
  },
];



