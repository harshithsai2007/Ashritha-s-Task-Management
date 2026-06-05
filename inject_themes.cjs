const fs = require('fs');
const path = require('path');

const indexCssPath = path.join(__dirname, 'src', 'index.css');
let cssContent = fs.readFileSync(indexCssPath, 'utf8');

const newCss = `
/* --- DYNAMIC THEME SYSTEM --- */
.theme-login {
  --bg-main: #F0E7D5;
  --bg-panel: #E8DECC;
  --text-main: #212842;
  --text-sub: #4A5568;
  --border-color: rgba(33, 40, 66, 0.1);
  background-color: var(--bg-main) !important;
}

.theme-harshith {
  --bg-main: #7F011F;
  --bg-panel: #6B0018;
  --text-main: #F5EBD0;
  --text-sub: #DCCFA8;
  --border-color: rgba(245, 235, 208, 0.1);
  background-color: var(--bg-main) !important;
}

.theme-ashritha {
  --bg-main: #FFE4E1;
  --bg-panel: #F5D3D0; 
  --text-main: #BF7E81;
  --text-sub: #9C6568;
  --border-color: rgba(191, 126, 129, 0.15);
  background-color: var(--bg-main) !important;
}

/* Base Overrides for Themes */
body.theme-login *, body.theme-harshith *, body.theme-ashritha * {
  border-color: var(--border-color);
}

body.theme-login .bg-\\[\\#0B1120\\],
body.theme-harshith .bg-\\[\\#0B1120\\],
body.theme-ashritha .bg-\\[\\#0B1120\\] {
  background-color: var(--bg-main) !important;
}

body.theme-login .bg-\\[\\#111827\\],
body.theme-harshith .bg-\\[\\#111827\\],
body.theme-ashritha .bg-\\[\\#111827\\] {
  background-color: var(--bg-panel) !important;
}

/* Safely override Text colors (only for specific text colors, avoiding inverted button text) */
body.theme-login .text-white:not(button .text-white):not(.bg-indigo-600 .text-white),
body.theme-harshith .text-white:not(button .text-white):not(.bg-indigo-600 .text-white),
body.theme-ashritha .text-white:not(button .text-white):not(.bg-indigo-600 .text-white) {
  color: var(--text-main) !important;
}

body.theme-login .text-slate-400, body.theme-login .text-slate-500,
body.theme-harshith .text-slate-400, body.theme-harshith .text-slate-500,
body.theme-ashritha .text-slate-400, body.theme-ashritha .text-slate-500 {
  color: var(--text-sub) !important;
}

body.theme-login .text-indigo-400,
body.theme-harshith .text-indigo-400,
body.theme-ashritha .text-indigo-400 {
  color: var(--text-main) !important;
}

body.theme-login .text-cyan-400,
body.theme-harshith .text-cyan-400,
body.theme-ashritha .text-cyan-400 {
  color: var(--text-main) !important;
}
`;

if (!cssContent.includes("DYNAMIC THEME SYSTEM")) {
  fs.writeFileSync(indexCssPath, cssContent + "\n" + newCss);
  console.log("CSS themes injected.");
} else {
  console.log("Themes already exist.");
}
