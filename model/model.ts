import {allPosts, Post} from 'contentlayer/generated';
import _ from 'lodash';

export interface IndexEntry {
  readonly yyyy: string;
}

function toIndexEntry(post: Post): IndexEntry {
  return {
    yyyy: post.yyyy,
  };
}

function getSortedPosts(): readonly Post[] {
  return _.sortBy(allPosts, p => p._raw.sourceFileDir, p => p.sort, p => p._raw.sourceFileName);
}

export function getIndex(): readonly IndexEntry[] {
  return getSortedPosts().map(toIndexEntry);
}
