import {allPosts, Post} from 'contentlayer/generated';
import _ from 'lodash';

export interface DatedEntry {
  readonly yyyy: string;
  readonly path: string;
}

function toDatedEntry(post: Post): DatedEntry {
  return {
    yyyy: post.yyyy,
    path: post.path,
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
