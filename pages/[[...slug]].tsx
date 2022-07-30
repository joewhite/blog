import {BlogPage} from 'components/blog-page';
import {GetStaticPathsResult, GetStaticPropsResult} from 'next';
import {DatedEntry, getDatedEntries} from 'model/model';
import _ from 'lodash';

interface HomeProps {
  readonly slug: readonly string[];
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

export async function getStaticProps({params: {slug}}): Promise<GetStaticPropsResult<HomeProps>> {
  return {
    props: {
      slug: slug ?? [],
      index: getDatedEntries(),
    },
  };
}

export default function Home({slug, index}: HomeProps) {
  return <>
    <BlogPage index={index}>
      <article>
        <h1>Slug = {JSON.stringify(slug)}</h1>
        {index.map((entry, idx) => <div key={idx}>{entry.yyyy}</div>)}
      </article>
    </BlogPage>
  </>;
}
