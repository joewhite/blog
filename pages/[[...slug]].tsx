import {BlogPage} from 'components/blog-page';
import {GetStaticPathsResult, GetStaticPropsResult} from 'next';
import {DatedEntry, getDatedEntries} from 'model/model';
import _ from 'lodash';

interface HomeParams {
  readonly index: readonly DatedEntry[];
}

export function getStaticPaths(): GetStaticPathsResult {
  const index = getDatedEntries();
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
  return {props: {index: getDatedEntries()}};
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
