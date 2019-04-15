import React from 'react';
import styled from 'styled-components';
import { wrapComponent } from '../../utils/i18n';
import comingSoon from '../../../resources/imgs/Coming-Soon.svg';

const Container = styled.div`
  width: 100%;
  padding: 0 20px 20px 20px;
`;

const MainContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  margin-top: 30px;
`;

const MainTitle = styled.div`
  font-size: 24px;
  line-height: 34px;
  letter-spacing: 1px;
  font-weight: 300;
  color: ${({ theme: { colors } }) => colors.primary};
`;

const ComingSvg = styled.img`
  width: 463px;
  height: 147px;
  flex: none;
`;

const ComingTitle = styled.div`
  font-size: 24px;
  color: ${({ theme: { colors } }) => colors.blue6};
  margin-top: 10px;
  text-align: center;
`;

const ComingTxt = styled.div`
  color: ${({ theme: { colors } }) => colors.blue6};
  font-size: 18px;
  line-height: 26px;
  font-weight: 300;
`;

type Props = {
  label: string,
  t: () => {}
};

const ComingSoon = (props: Props) => {
  const { label, t } = props;
  return (
    <Container>
      <MainTitle>{label}</MainTitle>
      <MainContainer>
        <ComingSvg src={comingSoon} />
        <ComingTitle>{t('components.comingSoon.coming_soon')}</ComingTitle>
        <ComingTxt>{t('components.comingSoon.working_hard')}</ComingTxt>
      </MainContainer>
    </Container>
  );
};

export default wrapComponent(ComingSoon);
