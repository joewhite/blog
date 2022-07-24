import Head from 'next/head';
import Link from 'next/link';
import {PropsWithChildren} from 'react';

export interface BlogPostParams extends PropsWithChildren {
}

export function BlogPage({children}: BlogPostParams) {
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
        Nav goes here.
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
