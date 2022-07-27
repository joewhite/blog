import _ from 'lodash';
import {IndexEntry} from 'model/model';
import Head from 'next/head';
import Link from 'next/link';
import {PropsWithChildren} from 'react';

export interface BlogPostParams extends PropsWithChildren {
  readonly index: readonly IndexEntry[];
}

export function BlogPage({index, children}: BlogPostParams) {
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
        {children}
      </main>
      <nav>
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
