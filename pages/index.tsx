import {BlogPage} from 'components/blog-page';
import {GetStaticPropsResult} from 'next';
import {getIndex, IndexEntry} from 'model/model';

interface HomeParams {
  readonly index: readonly IndexEntry[];
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
