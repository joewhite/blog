import {DatedEntry} from 'model/model';
import Link from 'next/link';

export interface StepNavParams {
  readonly index: readonly DatedEntry[];
  readonly currentPath: string;
}

export function StepNav({index, currentPath}: StepNavParams) {
  const postIndex = index.findIndex(e => e.path === currentPath);
  if (postIndex < 0) {
    return undefined;
  }

  const postsToLink = [
    {
      key: 'older',
      label: 'Older: ',
      path: index[postIndex - 1]?.path,
      title: index[postIndex - 1]?.title,
    },
    {
      key: 'newer',
      label: 'Newer: ',
      path: index[postIndex + 1]?.path,
      title: index[postIndex + 1]?.title,
    },
  ];

  return <nav className='step'>
    {postsToLink.map(p =>
      <div key={p.key} className='step'>
        {p.path
         && <Link href={'/' + p.path}>
           <a className={p.key} title={p.title}>
             <span style={{fontWeight: 500}}>{p.label}</span>
             {p.title}
           </a>
         </Link>
        }
      </div>,
    )}
  </nav>;
}
