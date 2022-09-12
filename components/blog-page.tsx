import {Post} from 'contentlayer/generated';
import {DatedEntry} from 'model/model';
import Head from 'next/head';
import Link from 'next/link';
import {useMDXComponent} from 'next-contentlayer/hooks';
import {OlderNewerNav} from './older-newer-nav';
import {unicode} from './unicode';
import {NavTree} from './nav-tree';
import {BrokenLink} from './mdx/broken-link';
import {Tab, Tabs} from './mdx/tabs';

interface PostContentParams {
  post: Post;
}

function PostContent({post}: PostContentParams) {
  const MDXContent = useMDXComponent(post.body.code);
  const components = {
    BrokenLink,
    Tab,
    Tabs,
  };
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
  readonly postSummaries: readonly DatedEntry[];
}

export function BlogPage({postSummaries, post}: BlogPostParams) {
  const title
    = (post ? `${post.title} ${unicode.emDash} ` : '')
    + `Joe White${unicode.rightSingleQuote}s Blog`;

  return <>
    <Head>
      <title>{title}</title>
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
        {post && <>
          <PostContent post={post}/>
          <OlderNewerNav postSummaries={postSummaries} currentPath={post.path}/>
        </>}
      </main>
      <nav className='full'>
        <NavTree postSummaries={postSummaries} currentPost={post}/>
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
