import {BlogPage} from 'components/blog-page';
import {GetStaticPathsResult, GetStaticPropsResult} from 'next';
import {getIndex, IndexEntry} from 'model/model';
import _ from 'lodash';

interface HomeParams {
  readonly index: readonly IndexEntry[];
}

export function getStaticPaths(): GetStaticPathsResult {
  const index = getIndex();
  const slugs: string[][] = [
    [], // '/'
    ..._.uniqBy(index, e => e.yyyy).map(e => [e.yyyy]),
  ];

  return {
    paths: slugs.map(segments => ({params: {slug: segments}})),
    fallback: false,
  };
}

export async function getStaticProps(): Promise<GetStaticPropsResult<HomeParams>> {
  return {props: {index: getIndex()}};
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
