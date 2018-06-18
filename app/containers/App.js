// @flow
import * as React from 'react';
import styles from './App.css'

type Props = {
  children: React.Node
};

export default class App extends React.Component<Props> {
  props: Props;

  render() {
    return <div className={styles.appContainer}>{this.props.children}</div>;
  }
}
