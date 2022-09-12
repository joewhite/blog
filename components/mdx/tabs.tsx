import {useState} from 'react';
import {isArray} from 'lodash';
import {PropsWithChildren, ReactElement, ReactNode} from 'react';
import styles from './tabs.module.css';

export interface TabParams extends PropsWithChildren {
  readonly title: ReactNode;
}

export function Tab({children}: TabParams) {
  return children;
}

function isProbableTab(o: any): o is ReactElement {
  return Boolean((o as ReactElement).props?.title);
}

export interface TabsParams {
  readonly children: ReactNode | ReactNode[];
}

export function Tabs({children}: TabsParams) {
  const [currentTab, setCurrentTab] = useState(0);

  const tabs: ReactElement[] = isArray(children)
    ? children.filter(isProbableTab)
    : isProbableTab(children)
      ? [children]
      : [];

  if (!isArray(children)) {
    children = [children];
  }

  return <div className={styles.tabs}>
    <div className={styles.tabBar}>
      <div className={styles.tabBarLeft} />
      {tabs.map((tab, index) => {
        const className = styles.tab + (index === currentTab ? ` ${styles.active}` : '');
        return <div key={index} className={className} onClick={() => setCurrentTab(index)}>
          {tab.props.title}
        </div>;
      })}
      <div className={styles.tabBarRight} />
    </div>
    <div className={styles.tabBackground}>
      <div className={styles.tabBody}>
        {tabs[currentTab]}
      </div>
    </div>
  </div>;
}

/*
Export function Tabs({selected, onChange, children}: TabsParams) {
  return <a href={href} className={styles.brokenLink}>
    {children}
    <sup>[broken link]</sup>
  </a>;
}
*/
