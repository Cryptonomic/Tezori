import React, { Component } from 'react'
import styled from 'styled-components'
import { H3 } from '../Heading'
import Button from '../Button'
import { ms } from '../../styles/helpers'

const Overlay = styled.div`
  display: flex;
  flex: 1;
  background-color: ${ ({ theme: { colors } }) => colors.gray5 };
  opacity: 0.7;
  z-index: -100;
  align-items: flex-end;
`

const Container = styled.div`
  height: 70%;
  background-color: ${ ({ theme: { colors } }) => colors.white };
  display: flex;
  justify-content: center;
  align-items: center;
`

const Title = styled(H3)`
  margin-bottom: ${ms(1)};
  color: ${({ theme: { colors } }) => colors.primary };
`

const Description = styled.p`
  color: ${({ theme: { colors } }) => colors.primary };
  font-weight: ${({theme: { typo: { weights } } }) => weights.light }
`

const Link = styled.span`
  color: ${({ theme: { colors } }) => colors.accent };
`

export default class Terms Modal extends Component {
  state = {
    isOpen: true
  }
  
  agreeTermsAndPolicy = () => {
    this.setState({ isOpen: false })
    localStorage.setItem('isTezosTermsAndPolicyAgreementAccepted', true)
  }

  render () {
    return (
      <Overlay>
        <Container>
          <Title></Title>
          <Description>
            Before we get started, please read our 
            <Link onClick={() => {}}>Terms of Service</Link>
            and
            <Link onClick={() => {}}>Pivacy Policy</Link>
          </Description>
          <Button
            buttonTheme="primary"
            onClick={this.props.agreeTermsAndPolicy}
          >
            I agree
          </Button>
        </Container>
      </Overlay>
    )
  }
}

