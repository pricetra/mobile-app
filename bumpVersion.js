#!/usr/bin/env node

import fs from 'fs';

// --- Helper: bump semver ---
function bumpVersion(version, type = 'patch') {
  const parts = version.split('.').map(Number);
  if (type === 'major') {
    parts[0] += 1;
    parts[1] = 0;
    parts[2] = 0;
  } else if (type === 'minor') {
    parts[1] += 1;
    parts[2] = 0;
  } else {
    // patch by default
    parts[2] += 1;
  }
  return parts.join('.');
}

// --- Update package.json ---
const pkgPath = './package.json';
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const oldVersion = pkg.version;
const newVersion = bumpVersion(oldVersion, process.argv[2] || 'patch');

pkg.version = newVersion;

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

console.log(`✅ package.json version bumped: ${oldVersion} → ${newVersion}`);
