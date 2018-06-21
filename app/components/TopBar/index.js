/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import styled from 'styled-components';
import SettingsController from '../SettingsController';
import TotalBalance from '../TotalBalance';
import TezosLogo from '../TezosLogo';

const Contaier = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px 40px;
  flex-shrink: 0;
`;

const InfoContainer = styled.div`
  display: flex;
`;

const TopBar = () => (
  <Contaier>
    {window.location.hash === '#/' ? (
      <TezosLogo />
    ) : (
      [
        <InfoContainer key="info">
          <TezosLogo />
          <TotalBalance />
        </InfoContainer>,
        <SettingsController key="settings" />
      ]
    )}
  </Contaier>
);

export default TopBar;
