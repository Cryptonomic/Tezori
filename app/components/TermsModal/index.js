import React, { Component } from 'react'
import styled from 'styled-components'
import { Dialog } from 'material-ui'
import { H3 } from '../Heading'
import Button from '../Button'
import { ms } from '../../styles/helpers'

const Container = styled.div`
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

class TermsModal extends Component {
  render () {
    const { isOpen, agreeTermsAndPolicy } = this.props
    return (
      <Dialog open={isOpen} bodyStyle={{ padding: '0px' }}>
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
            onClick={this.agreeTermsAndPolicy}
          >
            I agree
          </Button>
        </Container>
      </Dialog>
    )
  }
}

export default TermsModal

