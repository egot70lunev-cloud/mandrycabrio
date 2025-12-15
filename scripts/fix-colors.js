const fs = require('fs');
const path = require('path');

const replacements = [
  // Text colors
  { from: /text-\[#2B2B2B\]/g, to: 'text-[var(--text)]' },
  { from: /text-\[#6B6B6B\]/g, to: 'text-[var(--text-muted)]' },
  { from: /text-\[#9B9B9B\]/g, to: 'text-[var(--text-muted)]' },
  { from: /text-white/g, to: 'text-[var(--text)]' },
  { from: /text-black/g, to: 'text-[var(--text)]' },
  
  // Background colors
  { from: /bg-\[#F5F5F5\]/g, to: 'bg-[var(--surface-2)]' },
  { from: /bg-\[#E5E5E5\]/g, to: 'bg-[var(--surface-2)]' },
  { from: /bg-white/g, to: 'bg-[var(--surface)]' },
  { from: /bg-\[#2B2B2B\]/g, to: 'bg-[var(--navy-950)]' },
  { from: /bg-\[#1A1A1A\]/g, to: 'bg-[var(--navy-950)]' },
  { from: /bg-\[#3A3A3A\]/g, to: 'bg-[var(--surface-2)]' },
  
  // Border colors
  { from: /border-\[#E5E5E5\]/g, to: 'border-[var(--border)]' },
  { from: /border-\[#3A3A3A\]/g, to: 'border-[var(--border)]' },
  { from: /border-gray/g, to: 'border-[var(--border)]' },
  
  // Gold accents
  { from: /bg-\[#FFF9C4\]/g, to: 'bg-[var(--accent)]' },
  { from: /text-\[#FFF9C4\]/g, to: 'text-[var(--accent)]' },
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  replacements.forEach(({ from, to }) => {
    if (from.test(content)) {
      content = content.replace(from, to);
      changed = true;
    }
  });
  
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !filePath.includes('node_modules')) {
      walkDir(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      processFile(filePath);
    }
  });
}

// Process src/app directory
const appDir = path.join(__dirname, '../src/app');
walkDir(appDir);

console.log('Color replacement complete!');

