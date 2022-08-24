import {PropsWithChildren} from 'react';
import styles from './broken-link.module.css';

export interface BrokenLinkParams extends PropsWithChildren {
  readonly href: string;
}

export function BrokenLink({href, children}: BrokenLinkParams) {
  return <a href={href} className={styles.brokenLink}>
    {children}
    <sup>[broken link]</sup>
  </a>;
}
