// api/tracks.js  — Vercel serverless function
// Scans the /music folder and returns track filenames
// so you never have to update a playlist manually

const fs   = require('fs');
const path = require('path');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=60');

  try {
    const musicDir = path.join(process.cwd(), 'music');

    if (!fs.existsSync(musicDir)) {
      return res.status(200).json({ tracks: [] });
    }

    const files = fs
      .readdirSync(musicDir)
      .filter(f => /\.(mp3|m4a|ogg|wav|flac|aac)$/i.test(f))
      .sort()
      .map(f => `music/${f}`);

    return res.status(200).json({ tracks: files });
  } catch (e) {
    return res.status(200).json({ tracks: [], error: e.message });
  }
};