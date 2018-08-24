import React from 'react';
import styled from 'styled-components';
import { ms } from '../../../styles/helpers';
import { wrapComponent } from '../../../utils/i18n';

const Container = styled.div`
  color: ${({ theme: { colors } }) => colors.primary};
  font-weight: ${({ theme: { typo } }) => typo.weights.light};
  font-size: ${ms(-1)};
  max-width: ${ms(13)};
  position
`;

const Title = styled.p`
  font-weight: ${({ theme: { typo } }) => typo.weights.bold};
  font-size: ${ms(0)};
  margin: 0 0 ${ms(-4)} 0;
`;

type Props = {
  t: () => {}
};

function ManagerAddressTooltip(props: Props) {
  const { t } = props;
  return (
    <Container>
      <Title>{t("components.address.manager_address")}</Title>
      {t("components.tooltips.manager_tooltips_description")}
    </Container>
  );
}

export default wrapComponent(ManagerAddressTooltip);
