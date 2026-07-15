const fs = require('fs');
const path = require('path');
const https = require('https');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    }, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (status code: ${response.statusCode})`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {}); // Delete the file async if failure
      reject(err);
    });
  });
}

async function downloadScreens() {
  // Input file path
  const inputPath = path.join('C:', 'Users', 'Harshit', '.gemini', 'antigravity-ide', 'brain', '8ebbb437-3d54-4849-a96b-6484f6ab4374', '.system_generated', 'steps', '66', 'output.txt');
  // Output directory
  const outputDir = path.join(__dirname, '..', '.tmp', 'screens');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  if (!fs.existsSync(inputPath)) {
    console.error(`Error: input file ${inputPath} not found.`);
    return;
  }

  const fileData = fs.readFileSync(inputPath, 'utf8');
  const data = JSON.parse(fileData);
  const screens = data.screens || [];
  console.log(`Found ${screens.length} screens to download.`);

  for (let i = 0; i < screens.length; i++) {
    const screen = screens[i];
    const screenId = screen.name.split('/').pop();
    const title = screen.title || `Screen_${screenId}`;
    const downloadUrl = screen.htmlCode ? screen.htmlCode.downloadUrl : null;

    if (!downloadUrl) {
      console.log(`[${i + 1}/${screens.length}] Screen ${screenId} ('${title}') has no HTML download URL.`);
      continue;
    }

    console.log(`[${i + 1}/${screens.length}] Downloading '${title}' (${screenId})...`);

    // Sanitize title for filename
    const safeTitle = title.replace(/[^a-zA-Z0-9\s_-]/g, '_').trim();
    const filename = `${screenId}_${safeTitle}.html`;
    const filepath = path.join(outputDir, filename);

    try {
      await download(downloadUrl, filepath);
      console.log(`Saved to ${filepath}`);
    } catch (err) {
      console.error(`Failed to download ${screenId}: ${err.message}`);
    }
  }
}

downloadScreens();
