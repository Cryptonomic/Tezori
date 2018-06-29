import React from 'react'
import styled from "styled-components";
import { ms } from "../../../styles/helpers";

const Container = styled.div`
  color: ${ ({ theme: { colors } }) => colors.primary };
  font-weight: ${ ({ theme: { typo } }) => typo.weights.light };
  font-size: ${ms(-1)};
  max-width: ${ms(14)};
`

const Title = styled.p`
  font-weight: ${ ({ theme: { typo } }) => typo.weights.bold };
  font-size: ${ms(0)};
  margin: 0 0 ${ms(0)} 0;
`

function ManagerAddressTooltip() {
  return (
    <Container>
      <Title>
        Manager address
      </Title>
      The Manager Address is the primary address of your account and can be used to send and receive tez.
    </Container>
  )
}

export default ManagerAddressTooltip
