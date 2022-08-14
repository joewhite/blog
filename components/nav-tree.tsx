import {Post} from 'contentlayer/generated';
import _ from 'lodash';
import {DatedEntry} from 'model/model';
import styles from './nav-tree.module.css';

function getMonthLongName(month: string): string {
  const monthNumber = parseInt(month, 10);
  const date = new Date(2000, monthNumber - 1, 1);
  return date.toLocaleString('en-US', {month: 'long'});
}

interface Group<T> {
  readonly key: string;
  readonly items: readonly T[];
}

function groupBy<T>(items: readonly T[], getKey: (_item: T) => string): readonly Group<T>[] {
  return _(items)
    .filter(item => Boolean(getKey(item)))
    .groupBy(getKey)
    .toPairs()
    .map(pair => ({key: pair[0], items: pair[1]}))
    .sortBy(pair => pair.key)
    .value();
}

type TimeUnitParams<Name extends string> = {
  // eslint-disable-next-line no-unused-vars
  readonly [key in Name]: string;
} & {
  readonly posts: readonly DatedEntry[];
  readonly currentPost: Post;
}

function PostEntry({path, post, currentPost}: {path: string, post: DatedEntry, currentPost: Post}) {
  const active = currentPost.path === path;
  return <li className={active ? styles.active : ''}>
    {post.title}
  </li>;
}

function Day({dd, posts, currentPost}: TimeUnitParams<'dd'>) {
  const active = currentPost.dd === dd;
  return <li className={active ? styles.active : ''}>
    {dd} ({posts.length})
    {currentPost.dd === dd
      && <ul>
        {posts.map(post =>
          <PostEntry key={post.path} path={post.path} post={post} currentPost={currentPost} />,
        )}
      </ul>
    }
  </li>;
}

function Month({mm, posts, currentPost}: TimeUnitParams<'mm'>) {
  const active = currentPost.mm === mm;
  return <li className={active ? styles.active : ''}>
    {getMonthLongName(mm)} ({posts.length})
    {currentPost.mm === mm
      && <ul>
        {groupBy(posts, post => post.dd).map(day =>
          <Day key={day.key} dd={day.key} posts={day.items} currentPost={currentPost} />,
        )}
      </ul>
    }
  </li>;
}

function Year({yyyy, posts, currentPost}: TimeUnitParams<'yyyy'>) {
  const active = currentPost.yyyy === yyyy;
  return <li className={active ? styles.active : ''}>
    {yyyy} ({posts.length})
    {currentPost.yyyy === yyyy
      && <ul>
        {groupBy(posts, post => post.mm).map(month =>
          <Month key={month.key} mm={month.key} posts={month.items} currentPost={currentPost} />,
        )}
      </ul>
    }
  </li>;
}

export interface NavTreeParams {
  readonly currentPost?: Post;
  readonly postSummaries: readonly DatedEntry[];
}

export function NavTree({postSummaries, currentPost}: NavTreeParams) {
  return <div className={styles.navTree}>
    <div className={styles.majorHeader}>All posts by date</div>
    <ul>
      {
        groupBy(postSummaries, post => post.yyyy).map(year =>
          <Year key={year.key} yyyy={year.key} posts={year.items} currentPost={currentPost} />,
        )
      }
    </ul>
  </div>;
}
