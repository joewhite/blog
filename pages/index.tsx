import Head from 'next/head';
import Link from 'next/link';
import {allPosts} from 'contentlayer/generated';

export async function getStaticProps() {
  const posts = allPosts/* .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date))) */;
  return {props: {posts}};
}

export default function Home({posts}) {
  return <>
    <Head>
      <title>Joe White&apos;s Blog</title>
    </Head>

    <h1>Joe White&apos;s Blog</h1>

    <ul>
      {posts.map((post, index) => <li key={index}>
        <Link href={post.url}>
          <a>{post.title}</a>
        </Link>
      </li>)}
    </ul>
  </>;
}
