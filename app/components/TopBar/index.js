/* eslint flowtype-errors/show-errors: 0 */
import React, { Fragment } from 'react';
import styled from 'styled-components';
import SettingsController from '../SettingsController';
import TotalBalance from '../TotalBalance';
import TezosLogo from '../TezosLogo';
import TezosAmount from '../TezosAmount';
import { ms } from '../../styles/helpers'


const Contaier = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px 40px;
  flex-shrink: 0;
  background-color: ${ ({ theme: { colors } }) => colors.gray4 };
`;

const InfoContainer = styled.div`
  display: flex;
`;

const TopBar = () => (
  <Contaier>
    {window.location.hash === '#/' ? (
      <TezosLogo />
    ) : (
      <Fragment>      
        <InfoContainer key="info">
          <TezosLogo />
          <TotalBalance />
        </InfoContainer>
        <SettingsController key="settings" />
      </Fragment> 
    )}
  </Contaier>
);

export default TopBar;
