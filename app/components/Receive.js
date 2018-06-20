// @flow
import React, { Component } from 'react';
import { clipboard } from 'electron';
import QRCode from 'qrcode';
import Button from './Button'
import styled from 'styled-components'
import {ms} from '../styles/helpers'
import {H4} from './Heading'

type Props = {
  address: string
};

const CopyConfirmationTooltip = styled.div`
   background: ${({theme: {colors}}) => colors.accent};
   color: ${({theme: {colors}}) => colors.white};
   position: absolute;
   font-size: ${ms(-1)};
   border-radius: ${ms(0)};
   padding: ${ms(-2)};
   top: 34px;
   left: 160px;
   opacity: ${({show}) => show ? 1 : 0};
   transition: opacity 0.4s;
`

const HashContainer = styled.div`
   display: flex;
   flex-direction: column;
   align-items: flex-start;
   color: ${({theme: {colors}}) => colors.primary};
   font-size: ${ms(3)};
   position: relative;
`

const Hash = styled(H4)`
  margin: 0 0 ${ms(2)} 0
`

const ReceiveContainer = styled.div`
   display: flex;
   justify-content: flex-start;
   width: 100%;
   padding: ${ms(2)} 0 ${ms(6)} 0;
`

const QRCodeContainer = styled.canvas`
   border: 1px solid ${({theme: {colors}}) => colors.gray1};
   width: ${ms(9)};
   height: ${ms(9)};
   margin-right: ${ms(5)};
`

export default class Receive extends Component<Props> {
  props: Props;

  state = {
    showCopyConfirmation: false,
  };

  componentDidMount() {
    try {
      QRCode.toCanvas(this.canvasRef.current, this.props.address, {width: 190}, (err) => {
        if (err) console.error(err);
      })
    } catch (e) {
      console.error(e);
    }
  }

  canvasRef = React.createRef();
  copyToClipboard = () => {
    try {
      clipboard.writeText(this.props.address);
      this.setState({
        showCopyConfirmation: true,
      }, () => {
        setTimeout(() => {
          this.setState({
            showCopyConfirmation: false,
          });
        }, 2500);
      });
    } catch (e) {
      console.error(e);
    }
  };

  render() {
    const { address } = this.props;

    return (
      <ReceiveContainer>
        <QRCodeContainer
          innerRef={this.canvasRef}
        />
        <HashContainer>
          <Hash>{address}</Hash>
          <CopyConfirmationTooltip show={this.state.showCopyConfirmation}>
            Copied!
          </CopyConfirmationTooltip>
          <Button onClick={this.copyToClipboard} theme="secondary" small>Copy Address</Button>
        </HashContainer>
      </ReceiveContainer>
    );
  }
}
