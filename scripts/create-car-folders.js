/**
 * Script to create car image folders based on car slugs
 * Run with: node scripts/create-car-folders.js
 */

const fs = require('fs');
const path = require('path');

const carSlugs = [
  'jeep-wrangler-sahara-4xe-2022-sky-top',
  'audi-a5-cabrio-2022',
  'audi-q7-quattro-2020',
  'volkswagen-t-roc-cabrio-2022',
  'toyota-yaris-cross-2024',
  'mercedes-benz-e450-mhev-cabrio-2022',
  'toyota-yaris-2021',
  'kia-ev6-2024',
  'lexus-rx450h-2023-white-pano',
  'lexus-rx450h-2023-dark-blue',
  'chevrolet-camaro-cabrio-2019',
  'ford-mustang-cabrio-2018',
  'bmw-320d-cabrio-e93-2010',
  'mercedes-slk-200-2006',
  'indian-chieftain-1-8-motorcycle-2019',
  'volkswagen-t-roc-cabrio-2020-manual',
  'hyundai-i20',
  'mercedes-benz-e200-w211-kompressor-2005',
  'mini-cooper-s-countryman-2015',
];

const publicCarsDir = path.join(process.cwd(), 'public', 'cars');

// Create cars directory if it doesn't exist
if (!fs.existsSync(publicCarsDir)) {
  fs.mkdirSync(publicCarsDir, { recursive: true });
}

// Create folders for each car slug
carSlugs.forEach((slug) => {
  const carDir = path.join(publicCarsDir, slug);
  if (!fs.existsSync(carDir)) {
    fs.mkdirSync(carDir, { recursive: true });
    console.log(`✅ Created folder: ${slug}`);
  } else {
    console.log(`⏭️  Folder already exists: ${slug}`);
  }
});

console.log(`\n✨ Done! Created ${carSlugs.length} car folders in public/cars/`);
console.log(`📝 Next step: Add images (1.jpg, 2.jpg, etc.) to each folder`);




