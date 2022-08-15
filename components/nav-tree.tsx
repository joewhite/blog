import {Post} from 'contentlayer/generated';
import _ from 'lodash';
import {DatedEntry} from 'model/model';
import {ReactElement} from 'react';
import styles from './nav-tree.module.css';

function getMonthLongName(month: string): string {
  const monthNumber = parseInt(month, 10);
  const date = new Date(2000, monthNumber - 1, 1);
  return date.toLocaleString('en-US', {month: 'long'});
}

type SortKey = string | number | undefined | (string | number | undefined)[];

interface Group<T> {
  readonly key: string;
  readonly items: readonly T[];
}

function groupBy<T>(items: readonly T[], getKey: (_item: T) => SortKey): readonly Group<T>[] {
  return _(items)
    .filter(item => Boolean(getKey(item)))
    .groupBy(getKey)
    .toPairs()
    .map(pair => ({key: pair[0], items: pair[1]}))
    .sortBy(pair => pair.key)
    .value();
}

interface TimeListParams {
  readonly postSummaries: readonly DatedEntry[];
  readonly getKey: (_postSummary: DatedEntry) => SortKey;
  readonly getPath: (_postSummary: DatedEntry) => string;
  readonly getText: (_postSummary: DatedEntry, _childCount: number) => string;
  readonly renderChildren: (_postSummaries: readonly DatedEntry[]) => ReactElement;
  readonly currentPost: Post;
}

function TimeList({postSummaries, getKey, getPath, getText, renderChildren, currentPost}: TimeListParams) {
  return <ul>
    {
      groupBy(postSummaries, getKey).map(slice => {
        const firstPost = slice.items[0];
        const active = currentPost.path.startsWith(getPath(firstPost));
        return <li key={slice.key} className={active ? styles.active : ''}>
          {getText(firstPost, slice.items.length)}
          {active && renderChildren(slice.items)}
        </li>;
      })
    }
  </ul>;
}

export interface NavTreeParams {
  readonly currentPost?: Post;
  readonly postSummaries: readonly DatedEntry[];
}

export function NavTree({postSummaries, currentPost}: NavTreeParams) {
  return <div className={styles.navTree}>
    <div className={styles.majorHeader}>All posts by date</div>
    <TimeList postSummaries={postSummaries} getKey={p => [p.yyyy]} getPath={p => p.yyyy} getText={(p, c) => `${p.yyyy} (${c})`} currentPost={currentPost} renderChildren={yearSummaries =>
      <TimeList postSummaries={yearSummaries} getKey={p => [p.mm]} getPath={p => `${p.yyyy}/${p.mm}`} getText={(p, c) => `${getMonthLongName(p.mm)} (${c})`} currentPost={currentPost} renderChildren={monthSummaries =>
        <TimeList postSummaries={monthSummaries} getKey={p => [p.dd]} getPath={p => `${p.yyyy}/${p.mm}/${p.dd}`} getText={(p, c) => `${p.dd} (${c})`} currentPost={currentPost} renderChildren={daySummaries =>
          <TimeList postSummaries={daySummaries} getKey={p => [p.sort, p.path]} getPath={p => p.path} getText={p => p.title} currentPost={currentPost} renderChildren={_ => undefined} />
        } />
      } />
    } />
  </div>;
}
