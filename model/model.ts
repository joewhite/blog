import {allPosts, Post} from 'contentlayer/generated';
import _ from 'lodash';

export interface DatedEntry {
  readonly yyyy: string;
  readonly mm: string;
  readonly dd: string;
  readonly sort: number | undefined;
  readonly path: string;
  readonly title: string;
}

function toDatedEntry(post: Post): DatedEntry {
  return {
    yyyy: post.yyyy,
    mm: post.mm,
    dd: post.dd,
    sort: post.sort,
    path: post.path,
    title: post.title,
  };
}

function getSortedEntries(): readonly Post[] {
  return _.sortBy(allPosts, p => p._raw.sourceFileDir, p => p.sort, p => p._raw.sourceFileName);
}

export function getDatedEntries(): readonly DatedEntry[] {
  return getSortedEntries()
    .filter(e => Boolean(e.yyyy))
    .map(toDatedEntry);
}

export function getPost(path: string): Post | null {
  return allPosts.find(post => post.path === path) ?? null;
}
