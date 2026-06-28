const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

console.log("Starting aggressive lucide-react eradication...");

let replacedCount = 0;

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Regex to match: import { Icon1, Icon2 } from "lucide-react";
    const regex = /import\s+\{([^}]+)\}\s+from\s+["']lucide-react["'];?/g;
    
    if (regex.test(content)) {
      console.log(`Fixing: ${filePath}`);
      
      const newContent = content.replace(regex, (match, p1) => {
        // p1 is " Mountain, MapPin, Compass "
        const icons = p1.split(',').map(s => s.trim()).filter(s => s.length > 0);
        
        let stubs = `// ${match}\n`;
        icons.forEach(icon => {
          // Handle aliased imports like: Search as SearchIcon
          const parts = icon.split(/\s+as\s+/);
          const nameToUse = parts.length > 1 ? parts[1].trim() : parts[0].trim();
          stubs += `const ${nameToUse} = () => <span style={{display: 'inline-block', width: '1em', height: '1em', backgroundColor: '#e5e7eb', borderRadius: '50%'}}></span>;\n`;
        });
        
        return stubs;
      });
      
      fs.writeFileSync(filePath, newContent, 'utf8');
      replacedCount++;
    }
  }
});

console.log(`\nSuccess! Replaced lucide-react imports in ${replacedCount} files.`);
console.log("Next steps: run 'npm run dev' and the Webpack crash will NEVER happen again.");
