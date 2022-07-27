import {
  defineDocumentType,
  makeSource,
} from 'contentlayer/source-files';

function getDate(document) {
  const regex = /^(?<yyyy>\d{4})\/(?<mm>\d{2})\/(?<dd>\d{2})\//;
  return regex.exec(document._raw.flattenedPath)?.groups;
}

const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: '**/*.mdx',
  contentType: 'mdx',
  fields: {
    draft: {
      type: 'boolean',
      required: false,
    },
    title: {
      type: 'string',
      required: true,
    },
    sort: {
      type: 'number',
      required: false,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: doc =>
        `/${doc._raw.flattenedPath}`,
    },
    yyyy: {
      type: 'string',
      resolve: doc => getDate(doc)?.yyyy,
    },
    mm: {
      type: 'string',
      resolve: doc => getDate(doc)?.mm,
    },
    dd: {
      type: 'string',
      resolve: doc => getDate(doc)?.dd,
    },
  },
}));
export default makeSource({
  contentDirPath: 'posts',
  documentTypes: [Post],
});
