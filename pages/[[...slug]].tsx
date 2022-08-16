import {BlogPage} from 'components/blog-page';
import {GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult} from 'next';
import {DatedEntry, getDatedEntries, getPost} from 'model/model';
import _ from 'lodash';
import {Post} from 'contentlayer/generated';

interface HomeProps {
  readonly slug: readonly string[];
  readonly post: Post | null;
  readonly postSummaries: readonly DatedEntry[];
}

export function getStaticPaths(): GetStaticPathsResult {
  const postSummaries = getDatedEntries();
  const slugs: string[][] = [
    [], // '/'
    ...postSummaries.filter(e => Boolean(e.path)).map(e => e.path.split('/')),
  ];

  return {
    paths: slugs.map(segments => ({params: {slug: segments}})),
    fallback: 'blocking',
  };
}

export async function getStaticProps({params: {slug}}: GetStaticPropsContext): Promise<GetStaticPropsResult<HomeProps>> {
  const slugAsArray = typeof slug === 'string' ? [slug] : slug ?? [];
  const slugAsString = slugAsArray.join('/');
  const post = getPost(slugAsString);
  const postSummaries = getDatedEntries();

  if (!post) {
    // We advertised a route for this path, but it wasn't a post; therefore,
    // it was further up the directory structure. Redirect to the newest post
    // that fits that directory structure.
    const lastPost = _.findLast(postSummaries, post => post.path.startsWith(slugAsString + '/'));
    if (!lastPost) {
      return {notFound: true};
    }

    return {
      redirect: {
        destination: '/' + lastPost.path,
        permanent: false,
      },
    };
  }

  return {
    props: {
      slug: slugAsArray,
      post,
      postSummaries,
    },
  };
}

export default function Home({postSummaries, post}: HomeProps) {
  return <>
    <BlogPage postSummaries={postSummaries} post={post} />
  </>;
}
