import {allPosts, Post} from 'contentlayer/generated';
import {BlogPage, IndexEntry} from 'components/blog-page';
import _ from 'lodash';
import {GetStaticPropsResult} from 'next';

interface HomeParams {
  readonly index: readonly IndexEntry[];
}

function getIndexData(post: Post): IndexEntry {
  return {
    yyyy: post.yyyy,
  };
}

export async function getStaticProps(): Promise<GetStaticPropsResult<HomeParams>> {
  const posts = _.sortBy(allPosts, p => p._raw.sourceFileDir, p => p.sort, p => p._raw.sourceFileName);
  return {props: {index: posts.map(getIndexData)}};
}

export default function Home({index}: HomeParams) {
  return <>
    <BlogPage index={index}>
      <article>
        {index.map((entry, idx) => <div key={idx}>{entry.yyyy}</div>)}
      </article>
    </BlogPage>
  </>;
}
