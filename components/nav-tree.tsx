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

function Day({dd, posts, currentPost}: TimeUnitParams<'dd'>) {
  return <div className={currentPost.dd === dd ? styles.active : ''}>
    {dd} ({posts.length})
    {currentPost.dd === dd
      && <ul className={styles.childItems}>
        {posts.map(post =>
          <li key={post.path}>
            <div className={`${styles.postTitle} ${currentPost.path === post.path ? styles.active : ''}`}>
              {post.title}
            </div>
          </li>,
        )}
      </ul>
    }
  </div>;
}

function Month({mm, posts, currentPost}: TimeUnitParams<'mm'>) {
  return <div className={currentPost.mm === mm ? styles.active : ''}>
    {getMonthLongName(mm)} ({posts.length})
    {currentPost.mm === mm
      && <ul className={styles.childItems}>
        {groupBy(posts, post => post.dd).map(day =>
          <li key={day.key}>
            <Day dd={day.key} posts={day.items} currentPost={currentPost} />
          </li>,
        )}
      </ul>
    }
  </div>;
}

function Year({yyyy, posts, currentPost}: TimeUnitParams<'yyyy'>) {
  return <div className={currentPost.yyyy === yyyy ? styles.active : ''}>
    {yyyy} ({posts.length})
    {currentPost.yyyy === yyyy
      && <ul className={styles.childItems}>
        {groupBy(posts, post => post.mm).map(month =>
          <li key={month.key}>
            <Month mm={month.key} posts={month.items} currentPost={currentPost} />
          </li>,
        )}
      </ul>
    }
  </div>;
}

export interface NavTreeParams {
  readonly currentPost?: Post;
  readonly postSummaries: readonly DatedEntry[];
}

export function NavTree({postSummaries, currentPost}: NavTreeParams) {
  return <div className={styles.navTree}>
    <div className={styles.header}>All posts by date</div>
    <ul className={styles.childItems}>
      {
        groupBy(postSummaries, post => post.yyyy).map(year =>
          <Year key={year.key} yyyy={year.key} posts={year.items} currentPost={currentPost} />,
        )
      }
    </ul>
  </div>;
}
