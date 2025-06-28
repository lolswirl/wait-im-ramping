const fs = require('fs');
const path = require('path');

const env = process.env.NODE_ENV || 'development';

// Handle HTML template
const htmlTemplate = path.join(__dirname, '..', 'public', 'index.template.html');
const htmlDest = path.join(__dirname, '..', 'public', 'index.html');

try {
  if (fs.existsSync(htmlTemplate)) {
    let htmlContent = fs.readFileSync(htmlTemplate, 'utf8');
    
    if (env === 'development') {
      const timestamp = Date.now();
      htmlContent = htmlContent.replace('%FAVICON%', `favicon.dev.svg?v=${timestamp}`);
    } else {
      htmlContent = htmlContent.replace('%FAVICON%', 'favicon.svg');
    }
    
    fs.writeFileSync(htmlDest, htmlContent);
    console.log(`✅ Generated index.html with ${env === 'development' ? 'favicon.dev.svg' : 'favicon.svg'}`);
  }
} catch (error) {
  console.error('❌ Error updating HTML:', error.message);
  process.exit(1);
}