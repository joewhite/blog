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
    ..._.uniqBy(postSummaries, e => e.yyyy).map(e => [e.yyyy]),
    ...postSummaries.filter(e => Boolean(e.path)).map(e => e.path.split('/')),
  ];

  return {
    paths: slugs.map(segments => ({params: {slug: segments}})),
    fallback: false,
  };
}

export async function getStaticProps({params: {slug}}: GetStaticPropsContext): Promise<GetStaticPropsResult<HomeProps>> {
  const slugAsArray = typeof slug === 'string' ? [slug] : slug ?? [];

  return {
    props: {
      slug: slugAsArray,
      post: getPost(slugAsArray.join('/')),
      postSummaries: getDatedEntries(),
    },
  };
}

export default function Home({postSummaries, post}: HomeProps) {
  return <>
    <BlogPage postSummaries={postSummaries} post={post} />
  </>;
}
