# Assets Checklist - MandryCabrio

## 📁 Structure Required

```
public/
├─ logo/
│  ├─ logo.svg ✅ (Main logo - light background)
│  ├─ logo-dark.svg ✅ (Logo for dark backgrounds - optional)
│  └─ favicon.png ✅ (32x32 or 16x16)
├─ hero/
│  └─ hero.jpg ✅ (1920x1080, optimized < 400KB)
└─ cars/
   ├─ jeep-wrangler-sahara-4xe-2022-sky-top/
   │  ├─ 1.jpg ✅ (Main image)
   │  ├─ 2.jpg (Optional)
   │  └─ 3.jpg (Optional)
   ├─ audi-a5-cabrio-2022/
   │  └─ 1.jpg ✅
   ├─ audi-q7-quattro-2020/
   │  └─ 1.jpg ✅
   ├─ volkswagen-t-roc-cabrio-2022/
   │  └─ 1.jpg ✅
   ├─ toyota-yaris-cross-2024/
   │  └─ 1.jpg ✅
   ├─ mercedes-benz-e450-mhev-cabrio-2022/
   │  └─ 1.jpg ✅
   ├─ toyota-yaris-2021/
   │  └─ 1.jpg ✅
   ├─ kia-ev6-2024/
   │  └─ 1.jpg ✅
   ├─ lexus-rx450h-2023-white-pano/
   │  └─ 1.jpg ✅
   ├─ lexus-rx450h-2023-dark-blue/
   │  └─ 1.jpg ✅
   ├─ chevrolet-camaro-cabrio-2019/
   │  └─ 1.jpg ✅
   ├─ ford-mustang-cabrio-2018/
   │  └─ 1.jpg ✅
   ├─ bmw-320d-cabrio-e93-2010/
   │  └─ 1.jpg ✅
   ├─ mercedes-slk-200-2006/
   │  └─ 1.jpg ✅
   ├─ indian-chieftain-1-8-motorcycle-2019/
   │  └─ 1.jpg ✅
   ├─ volkswagen-t-roc-cabrio-2020-manual/
   │  └─ 1.jpg ✅
   ├─ hyundai-i20/
   │  └─ 1.jpg ✅
   ├─ mercedes-benz-e200-w211-kompressor-2005/
   │  └─ 1.jpg ✅
   └─ mini-cooper-s-countryman-2015/
      └─ 1.jpg ✅
```

## ✅ Requirements

### Logo
- [ ] `logo.svg` - SVG format, optimized
- [ ] `logo-dark.svg` - Optional variant for dark backgrounds
- [ ] `favicon.png` - 32x32 or 16x16 PNG

### Hero Image
- [ ] `hero.jpg` - 1920x1080 recommended, < 400KB
- [ ] Optimized for web (compressed)
- [ ] Good contrast for text overlay

### Car Images
- [ ] All 19 car slugs have at least `1.jpg`
- [ ] Format: JPG or WebP
- [ ] Size: Max 300-400KB per image
- [ ] Dimensions: Recommended 1200x800
- [ ] Optimized for web

## 📝 Notes

- Car slugs must match exactly those in `src/data/cars.ts`
- Images are automatically lazy-loaded except hero and first 3 car cards
- Alt tags are auto-generated based on locale
- If logo not found, falls back to text
- If car image not found, shows placeholder

## 🔍 Verification

After adding assets, verify:
1. Logo appears in Navbar
2. Hero image loads on Home page
3. Car images load on `/en/cars` and `/en/cars/[slug]`
4. Favicon appears in browser tab
5. OG image works in social previews



