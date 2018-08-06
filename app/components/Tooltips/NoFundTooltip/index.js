import React from 'react'
import styled from "styled-components";
import { ms } from "../../../styles/helpers";

const Container = styled.div`
  color: ${ ({ theme: { colors } }) => colors.primary };
  font-weight: ${ ({ theme: { typo } }) => typo.weights.light };
  font-size: ${ms(-1)};
  max-width: ${ms(12)};
`;

type Props = {
  content: string
};

const NoFundTooltip = (props: Props) => (
  <Container>
    {props.content}
  </Container>
);

export default NoFundTooltip
