import {BlogPage} from 'components/blog-page';
import {GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult} from 'next';
import {DatedEntry, getDatedEntries, getPost} from 'model/model';
import _ from 'lodash';
import {Post} from 'contentlayer/generated';

interface HomeProps {
  readonly slug: readonly string[];
  readonly post: Post | null;
  readonly index: readonly DatedEntry[];
}

export function getStaticPaths(): GetStaticPathsResult {
  const index = getDatedEntries();
  const slugs: string[][] = [
    [], // '/'
    ..._.uniqBy(index, e => e.yyyy).map(e => [e.yyyy]),
    ...index.filter(e => Boolean(e.path)).map(e => e.path.split('/')),
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
      index: getDatedEntries(),
    },
  };
}

export default function Home({slug, index, post}: HomeProps) {
  return <>
    <BlogPage index={index} post={post}>
      <article>
        <h1>Slug = {JSON.stringify(slug)}</h1>
        {index.map((entry, idx) => <div key={idx}>{entry.yyyy}</div>)}
      </article>
    </BlogPage>
  </>;
}
