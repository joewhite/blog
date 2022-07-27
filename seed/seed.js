const {readFileSync, writeFileSync} = require('fs');
const path = require('path');
const {Parser} = require('xml2js');
const _ = require('lodash');
const mkdirp = require('mkdirp');

(async () => {
  const xml = readFileSync(path.join(__dirname, 'wp.xml'));
  const parser = new Parser({
    attrkey: '@',
    trim: true,
  });
  const data = await parser.parseStringPromise(xml);
  const posts = data.rss.channel[0].item;
  const rawResultPromises = posts.map(handleRawPost);
  const rawResults = await Promise.all(rawResultPromises);
  const results = rawResults.filter(r => r);

  let lastValue;
  let count = 0;
  let chunks = 0;
  const uniqueValues = new Set();
  // Deliberately go past the end of the array, so that our last result
  // will be undefined and we won't need to care about displaying it
  for (let i = 0; i <= results.length; ++i) {
    const value = results[i];
    if (value === lastValue) {
      ++count;
    } else {
      if (count > 0) {
        console.log(`(${count}x) ${JSON.stringify(lastValue)}`);
        ++chunks;
      }

      lastValue = value;
      count = 1;
      if (value !== undefined) {
        uniqueValues.add(value);
      }
    }
  }

  console.log(`${chunks} chunk(s), ${results.length} value(s), ${uniqueValues.size} unique`);
})();

const expectedKeys = ['title', 'content:encoded', 'wp:post_id'];
const ignoredKeys = [
  'wp:status', // Used in handleRawPost. Filtered on before we call handlePost.
  'link', // Used in handleRawPost. Transformed to 'path' property.
  'wp:post_type', // The two values we filter to - 'page' and 'post' - won't be handled any differently.
  'guid', // Either same as link (but http: instead of https:), or /?page_id= URL. Neither is useful.
  'pubDate', // Doesn't always match the date in the URL
  'dc:creator', // Always 'admin'
  'wp:menu_order', // Always '0'
  'description', // Always empty
  'wp:comment_status', // We won't have comments
  'excerpt:encoded', // Always empty
  'wp:post_parent', // Always '0'
  'wp:post_date', // We don't actually need this as long as link is correct
  'wp:post_date_gmt', // We don't actually need this as long as link is correct
  'wp:ping_status', // We no longer accept comments or pingbacks
  'wp:post_name', // Link consistently ends with '/' + this + '/', so we don't need both
  'wp:post_password', // Always blank
  'wp:status', // Always '0'
  'wp:postmeta', // Nothing here looks useful
  'wp:is_sticky', // Always '0'
  'wp:comment', // We no longer accept contents
  'category', // We manually parse this out and pass it in as an array
];
async function handleRawPost(post) {
  const postType = post['wp:post_type'][0];
  // We *could* include postType === 'page', but that would only include the privacy policy,
  // which will be very different with no comments and no contact form.
  if (postType !== 'post') {
    return;
  }

  const status = post['wp:status'][0]; // Dude don't change this line from wp:status
  if (status !== 'publish') {
    return;
  }

  const data = _.pick(post, expectedKeys);
  const unexpectedKeys = Object.keys(_.omit(_.omit(post, expectedKeys), ignoredKeys));
  if (unexpectedKeys.length) {
    throw new Error('Unexpected keys in post: ' + unexpectedKeys);
  }

  const linkMatch = /^https:\/\/blog\.excastle\.com\/(.*)\//.exec(post.link[0]);
  if (!linkMatch) {
    throw new Error(`Invalid link: ${post.link}`);
  }

  const categories = _(post.category).filter(c => c['@'].domain === 'category').map(c => c._).value();
  if (categories.includes('.NET') || categories.includes('Delphi')) {
    _.pull(categories, 'Programming');
  }

  const tags = _(post.category).filter(c => c['@'].domain !== 'category').map(c => c._).value();

  data.path = linkMatch[1];
  data.categories = categories.length ? JSON.stringify(categories) : ['Life'];
  data.tags = tags;

  const result = await handlePost({
    id: data['wp:post_id'][0],
    title: data.title[0],
    postPath: linkMatch[1],
    categories: categories.length ? categories : ['Life'],
    tags,
    content: await massageContent(post['content:encoded'][0]),
  });
  return result;
}

async function handlePost(post) {
  const {id, title, postPath, categories, tags, content} = post;

  const hashTags = [...categories, ...tags].map(t => `#${t}`);
  const titleAndTags = [title, ...hashTags].join('  ');

  const filePath = path.join(__dirname, '..', 'pages', postPath + '.mdx');
  await mkdirp(path.dirname(filePath));
  writeFileSync(filePath, `---
Draft: true
Title: ${titleAndTags}
Sort: ${id}
---
${content}`);

  throw new Error('Stopping after first post');

  return id;
}

async function massageContent(content) {
  return content.replace(/<!--.*?-->/, '');
}
