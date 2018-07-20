// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TextField } from 'material-ui';

import { H3 } from '../../components/Heading/';
import styled from 'styled-components';

const SectionContainer = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const DefaultContainer = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  padding: 0px 50px;
`;

const WalletContainers = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 30px;
`;

const StyledPre = styled.pre`
  border: 1px solid #d0d0d0;
  background: white;
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
        <DefaultContainer>
          <WalletContainers>
            <H3>Node configuration is missing</H3>
            <p>Please close the wallet and edit "defaultWalletNodes.json" and open the wallet again. <br/>
              defaultWalletNodes should look like: </p>
            <StyledPre>
              { preContent }
            </StyledPre>
          </WalletContainers>
        </DefaultContainer>
      </SectionContainer>
    );
  }
}

export default connect()(WalletNodesRequired);
