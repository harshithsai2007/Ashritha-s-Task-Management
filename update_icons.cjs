const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  { file: 'MLModule.tsx', defaultIcon: 'Brain' },
  { file: 'ProjectModule.tsx', defaultIcon: 'Rocket' },
  { file: 'ToolsModule.tsx', defaultIcon: 'Wand2' },
  { file: 'DSAModule.tsx', defaultIcon: 'Terminal' },
  { file: 'CloudModule.tsx', defaultIcon: 'Cloud' }
];

filesToUpdate.forEach(({ file, defaultIcon }) => {
  const filePath = path.join(__dirname, 'src', 'components', file);
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Add icon to interface
  if (!content.includes('icon?: React.ElementType;')) {
    content = content.replace(
      'description?: string;\n}',
      'description?: string;\n  icon?: React.ElementType;\n}'
    );
  }

  // 2. Add icon to function signature
  if (!content.includes('icon }:')) {
    content = content.replace(
      'title, description }:',
      'title, description, icon: CustomIcon }:'
    );
  }

  // 3. Replace the hardcoded Icon component rendering with the dynamic one
  // It looks like: `<Brain className="h-6 w-6" />` or similar
  const regex = new RegExp(`<${defaultIcon} className="([^"]+)" \\/>`, 'g');
  if (content.match(regex)) {
    content = content.replace(
      regex,
      `{CustomIcon ? <CustomIcon className="$1" /> : <${defaultIcon} className="$1" />}`
    );
  }
  
  // also handle the empty state icon
  const emptyRegex = new RegExp(`<${defaultIcon} className="([^"]+)" \\/>`, 'g');
  // wait, the first replace with 'g' already replaces all occurrences!
  
  // also handle the create task modal icon
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated ${file}`);
});
