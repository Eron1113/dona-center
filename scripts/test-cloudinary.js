/**
 * Diagnostic: verifies the Cloudinary credentials in .env.local actually work.
 * Usage: node scripts/test-cloudinary.js
 */
const fs = require("fs");
const path = require("path");

function loadEnv(file) {
  const env = {};
  if (!fs.existsSync(file)) return env;
  const content = fs.readFileSync(file, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const m = trimmed.match(/^(?:export\s+)?([A-Z0-9_]+)\s*=\s*(.*)$/i);
    if (!m) continue;
    let value = m[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[m[1]] = value;
  }
  return env;
}

const env = loadEnv(path.join(__dirname, "..", ".env.local"));
const secret = env.CLOUDINARY_API_SECRET || "";
const key = env.CLOUDINARY_API_KEY || "";
const cloud = env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";

console.log("cloud_name:", cloud || "(EMPTY)");
console.log("api_key:", key || "(EMPTY)");
console.log("secret length:", secret.length);
console.log("secret first char:", JSON.stringify(secret[0]));
console.log("secret has whitespace:", /\s/.test(secret));
console.log("secret looks like key (not secret):", /^[0-9]{15,}$/.test(secret));

const cloudinary = require("cloudinary").v2;
cloudinary.config({ cloud_name: cloud, api_key: key, api_secret: secret });

// 1x1 transparent PNG
const png =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

cloudinary.uploader
  .upload(png, { folder: "dona-center/test", quality: "auto", fetch_format: "auto" })
  .then((r) => console.log("UPLOAD OK:", r.secure_url))
  .catch((e) => console.log("UPLOAD FAILED:", e.message));
