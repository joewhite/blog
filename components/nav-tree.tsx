import {Post} from 'contentlayer/generated';
import _ from 'lodash';
import {DatedEntry} from 'model/model';

export interface NavTreeParams {
  readonly currentPost?: Post;
  readonly postSummaries: readonly DatedEntry[];
}

export function NavTree({postSummaries, currentPost}: NavTreeParams) {
  return <>
    <div><b>All posts by date</b></div>
    {
      _(postSummaries)
        .filter(post => Boolean(post.yyyy))
        .groupBy(post => post.yyyy)
        .toPairs()
        .sortBy(pair => pair[0])
        .value()
        .map(pair => <div key={pair[0]}>{pair[0]} ({pair[1].length})</div>)
    }
  </>;
}
