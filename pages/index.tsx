import {allPosts} from 'contentlayer/generated';
import {BlogPage} from 'components/blog-page';
import _ from 'lodash';

export async function getStaticProps() {
  const posts = _.sortBy(allPosts, p => p._raw.sourceFileDir, p => p.sort, p => p._raw.sourceFileName);
  return {props: {posts}};
}

export default function Home({posts}) {
  return <>
    <BlogPage>
      <article>
        {JSON.stringify(posts, null, 2)}
        {' aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'}
      </article>
    </BlogPage>
  </>;
}
