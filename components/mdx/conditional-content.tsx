import _ from 'lodash';
import {useRouter} from 'next/router';
import React, {PropsWithChildren} from 'react';
import styles from './conditional-content.module.css';

function getHash(url: string): string {
  const params = new URL(url, 'https://example.com').searchParams;
  return params.toString();
}

interface Conditions {
  readonly [key: string]: string | boolean | undefined;
}

function parseConditions(hash: string): Conditions {
  const params = new URLSearchParams(hash);
  const pairs = [...params].map(([key, value]) =>
    [key, value === '' ? true : value],
  );
  return _.fromPairs(pairs);
}

function formatConditions(conditions: Conditions): string {
  // Filter out blank/false, then sort by key
  const pairs = _(conditions)
    .toPairs()
    .filter(pair => Boolean(pair[1]))
    .sortBy(pair => pair[0])
    .value();

  const params = new URLSearchParams({});
  for (const [key, value] of pairs) {
    params.set(key, typeof value === 'boolean' ? '' : value);
  }

  // Represent true values as 'value' instead of 'value='
  return params.toString().replaceAll('=&', '&').replace(/=$/, '');
}

function useConditions(): [Conditions, (_: Conditions) => void] {
  const router = useRouter();
  const conditions = parseConditions(getHash(router.asPath));

  function setConditions(newConditions: Conditions) {
    const path = new URL(router.asPath, 'https://example.com').pathname;
    const query = formatConditions({...conditions, ...newConditions});
    const newUrl = path + (query ? `?${query}` : '');
    router.replace(newUrl, undefined, {scroll: false, shallow: true});
  }

  return [conditions, setConditions];
}

export interface ContentCheckBoxParams extends PropsWithChildren {
  readonly name: string;
}

export function ContentCheckBox({name, children}: ContentCheckBoxParams) {
  const [conditions, setConditions] = useConditions();
  return <label>
    <input type='checkbox'
      className={styles.checkBox}
      checked={Boolean(conditions[name])}
      onChange={() => setConditions({[name]: !conditions[name]})} />
    {children}
  </label>;
}

export interface ContentRadioButtonParams extends PropsWithChildren {
  readonly name: string;
  readonly value: string;
}

export function ContentRadioButton({name, value, children}: ContentRadioButtonParams) {
  const [conditions, setConditions] = useConditions();
  return <label>
    <input type='radio'
      className={styles.checkBox}
      checked={conditions[name] === value || (!conditions[name] && !value)}
      onChange={() => setConditions({[name]: value})} />
    {children}
  </label>;
}

export interface IfParams extends PropsWithChildren {
  readonly condition: string;
}

export function If({condition, children}: IfParams) {
  const [conditions] = useConditions();

  if (condition.startsWith('!')) {
    const key = condition.replace(/^!/, '');
    const match = !conditions[key];
    return match && children;
  }

  if (condition.includes('=')) {
    const [k, v] = condition.split('=', 2);
    const match = conditions[k] === v;
    return match && children;
  }

  const match = conditions[condition];
  return match && children;
}
