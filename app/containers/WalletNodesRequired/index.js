// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TextField } from 'material-ui';

import { H3 } from '../../components/Heading/';
import styled from 'styled-components';
import styles from './styles.css';

const SectionContainer = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const preContent = `
  {
    "tezosSelectedNode": "tezosName",
    "conseilSelectedNode": "conseilName",
    "list": [
      {
        "name": "tezosName",
        "type": "TEZOS",
        "url": "https://127.0.0.1:19731/",
        "apiKey": "apiKey"
      },
      {
        "name": "conseilName",
        "type": "CONSEIL",
        "url": "https://127.0.0.1:19731/",
        "apiKey": "apiKey"
      }
    ]
  }
`;

class WalletNodesRequired extends Component<Props> {
  props: Props;

  render() {
    return (
      <SectionContainer>
        <div className={styles.defaultContainer}>
          <div className={styles.walletContainers}>
            <H3>Node configuration is missing</H3>
            <p>Please close the wallet and edit "defaultWalletNodes.json" and open the wallet again. <br/>
              defaultWalletNodes should look like: </p>
            <pre className={styles.styledPre}>
              { preContent }
            </pre>
          </div>
        </div>
      </SectionContainer>
    );
  }
}

export default connect()(WalletNodesRequired);
