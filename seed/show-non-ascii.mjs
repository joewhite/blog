import fs, {readdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'url';
import {StringDecoder} from 'node:string_decoder';

const counts = {};
const utf8Decoder = new StringDecoder('utf8');

async function handleFile(p) {
  const file = await fs.readFile(p);
  for (let i = 0; i < file.length; ++i) {
    if (file[i] >= 127) {
      const spanStart = i;
      do {
        ++i;
      } while (file[i] >= 127);

      const spanEnd = i;
      const spanBytes = file.subarray(spanStart, spanEnd);
      const span = utf8Decoder.write(spanBytes);
      // Const span = [...spanBytes].map(b => String.fromCodePoint(b)).join('');
      counts[span] = (counts[span] || 0) + 1;

      const snippetBytes = file.subarray(Math.max(spanStart - 30, 0), spanEnd + 30);
      const snippet = utf8Decoder.write(snippetBytes);
      // Const snippet = [...snippetBytes].map(b => String.fromCodePoint(b)).join('');
      console.log(`---\n${p}\n  ${span} = [...]${snippet}[...]`);
    }
  }
}

async function handleEntry(entry) {
  const stat = await fs.stat(entry);
  if (stat.isDirectory()) {
    await scanDirectory(entry);
  } else {
    await handleFile(entry);
  }
}

async function scanDirectory(dir) {
  const entries = await readdir(dir);
  const fullPaths = entries.map(p => path.join(dir, p));

  await Promise.all(fullPaths.map(handleEntry));
}

const dirName = path.dirname(fileURLToPath(import.meta.url));
const postsDirectory = path.join(dirName, '../posts');
await scanDirectory(postsDirectory);
console.log('#####');
console.log(JSON.stringify(counts, null, 2));
