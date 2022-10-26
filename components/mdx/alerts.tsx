import {PropsWithChildren} from 'react';
import styles from './alerts.module.css';

interface AlertProps extends PropsWithChildren {
  readonly className: string;
  readonly icon: string;
}

export function Alert({className, icon, children}: AlertProps) {
  return <div className={`${styles.alert} ${className}`}>
    <div className={styles.icon}>{icon}</div>
    <div className={styles.body}>{children}</div>
  </div>;
}

export function Info({children}: PropsWithChildren) {
  return <Alert className={styles.info} icon='&#x1F6C8;'>{children}</Alert>;
}
