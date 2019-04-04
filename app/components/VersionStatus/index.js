/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import styled from 'styled-components';
import { ms } from '../../styles/helpers';
import TezosIcon from '../TezosIcon/';
import { wrapComponent } from '../../utils/i18n';

import { openLink } from '../../utils/general';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${ms(-1)} ${ms(3)};
  background-color: ${({ theme: { colors } }) => colors.error1};
  color: ${({ theme: { colors } }) => colors.white};
  font-size: ${ms(-0.5)};
  position: ${({ isAbsolute }) => (isAbsolute ? 'absolute' : 'initial')};
  left: 0;
  top: 92px;
  width: 100%;
`;

const WarningIcon = styled(TezosIcon)`
  font-size: ${ms(0.5)};
  margin-right: ${ms(-1.5)};
`;

const Strong = styled.span`
  color: ${({ theme: { colors } }) => colors.accent};
  font-weight: 400;
`;

const Link = styled(Strong)`
  cursor: pointer;
  margin-left: 5px;
`;

const url = 'https://galleon-wallet.tech';

type Props = {
  version: string,
  isAbsolute?: boolean,
  t: () => {}
};

const VersionStatus = (props: Props) => {
  const { version, isAbsolute, t } = props;

  return (
    <Container isAbsolute={isAbsolute}>
      <WarningIcon color="white" iconName="warning" />
      <span>{t('components.versionStatus.version_update', { version })}</span>
      <Link onClick={() => openLink(url)}>{url}</Link>
    </Container>
  );
};

export default wrapComponent(VersionStatus);
