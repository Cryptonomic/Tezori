// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

import { H3 } from '../../components/Heading/';
import { wrapComponent } from '../../utils/i18n';

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
    const { t } = this.props;
    return (
      <SectionContainer>
        <DefaultContainer>
          <WalletContainers>
            <H3>{t("containers.walletNodesRequired.configuration_missing")}</H3>
            <p>
              {t("containers.walletNodesRequired.close_wallet_description")}
              <br />
              {t("containers.walletNodesRequired.default_wallet_shape")}
            </p>
            <StyledPre>
              { preContent }
            </StyledPre>
          </WalletContainers>
        </DefaultContainer>
      </SectionContainer>
    );
  }
}

export default wrapComponent(WalletNodesRequired);
