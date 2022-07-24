import {
  defineDocumentType,
  makeSource,
} from 'contentlayer/source-files';

const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: '**/*.mdx',
  contentType: 'mdx',
  fields: {
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
  },
}));
export default makeSource({
  contentDirPath: 'posts',
  documentTypes: [Post],
});
