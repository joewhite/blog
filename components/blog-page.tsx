import {Post} from 'contentlayer/generated';
import _ from 'lodash';
import {DatedEntry} from 'model/model';
import Head from 'next/head';
import Link from 'next/link';
import {useMDXComponent} from 'next-contentlayer/hooks';
import {PropsWithChildren} from 'react';
import {StepNav} from './step-nav';

interface PostContentParams {
  post: Post;
}

function PostContent({post}: PostContentParams) {
  const MDXContent = useMDXComponent(post.body.code);
  const components = {};
  return <article>
    <h1>{post.title}</h1>
    <MDXContent components={components}/>
    {/* Make sure we have paragraph padding at the bottom, even if the last
        element is an <a> instead of a <p> */}
    <p/>
  </article>;
}

export interface BlogPostParams {
  readonly post?: Post;
  readonly index: readonly DatedEntry[];
}

export function BlogPage({index, post}: BlogPostParams) {
  return <>
    <Head>
      <title>Joe White&apos;s Blog</title>
    </Head>

    <div id='layout'>
      <header>
        <Link href='/'>
          <a>Joe White&apos;s Blog</a>
        </Link>
        {' '}
        <small>Life, .NET, and cats</small>
      </header>
      <main>
        {post && <PostContent post={post}/>}
        <StepNav index={index} currentPath={post.path}/>
      </main>
      <nav className='full'>
        <div><b>All posts by date</b></div>
        {
          _(index)
            .filter(post => Boolean(post.yyyy))
            .groupBy(post => post.yyyy)
            .toPairs()
            .sortBy(pair => pair[0])
            .value()
            .map(pair => <div key={pair[0]}>{pair[0]} ({pair[1].length})</div>)
        }
      </nav>
      <footer>
        Copyright &copy; Joe White. You are welcome to redistribute this content
        under the conditions of the{' '}
        <a href='https://creativecommons.org/licenses/by-nc/4.0/'>CC BY-NC</a>
        {' '}license. You may also use any source code under the terms of the{' '}
        <a href='https://opensource.org/licenses/MIT'>MIT license</a>
        .
      </footer>
    </div>
  </>;
}
