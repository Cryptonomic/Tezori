// @flow
import React, { Component } from 'react';
import { clipboard } from 'electron';
import QRCode from 'qrcode';
import styled from 'styled-components';
import Button from './Button';
import { ms } from '../styles/helpers';
import { H4 } from './Heading';

type Props = {
  address: string
};

const CopyConfirmationTooltip = styled.div`
  background: ${({ theme: { colors } }) => colors.accent};
  color: ${({ theme: { colors } }) => colors.white};
  position: absolute;
  font-size: ${ms(-1)};
  border-radius: ${ms(0)};
  padding: ${ms(-4)};
  top: 34px;
  left: 160px;
  opacity: ${({ show }) => (show ? 1 : 0)};
  transition: opacity 0.4s;

  @media (max-width: 1200px) {
    left: 310px;
  }
`;

const HashContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: ${({ theme: { colors } }) => colors.primary};
  position: relative;

  @media (max-width: 1200px) {
    align-items: center;
  }
`;

const Hash = styled(H4)`
  margin: 0 0 ${ms(2)} 0;
`;

const ReceiveContainer = styled.div`
  display: flex;
  width: 100%;
  padding: ${ms(2)} 0 ${ms(6)} 0;

  @media (max-width: 1200px) {
    flex-direction: column;
    align-items: center;
  }
`;

const QRCodeContainer = styled.canvas`
  border: 1px solid ${({ theme: { colors } }) => colors.gray1};
  width: ${ms(9)};
  height: ${ms(9)};
  margin: 0 ${ms(5)} 0 0;

  @media (max-width: 1200px) {
    margin: 0;
  }
`;

export default class Receive extends Component<Props> {
  props: Props;

  state = {
    showCopyConfirmation: false
  };

  componentDidMount() {
    this.renderQRCode();
  }

  componentDidUpdate(newProps) {
    const { address } = this.props;
    if (newProps.address !== address) {
      this.renderQRCode();
    }
  }

  renderQRCode() {
    try {
      QRCode.toCanvas(
        this.canvasRef.current,
        this.props.address,
        { width: 190 },
        err => {
          if (err) console.error(err);
        }
      );
    } catch (e) {
      console.error(e);
    }
  }

  canvasRef = React.createRef();
  copyToClipboard = () => {
    try {
      clipboard.writeText(this.props.address);
      this.setState(
        {
          showCopyConfirmation: true
        },
        () => {
          setTimeout(() => {
            this.setState({
              showCopyConfirmation: false
            });
          }, 2500);
        }
      );
    } catch (e) {
      console.error(e);
    }
  };

  render() {
    const { address } = this.props;

    return (
      <ReceiveContainer>
        <QRCodeContainer innerRef={this.canvasRef} />
        <HashContainer>
          <Hash>{address}</Hash>
          <CopyConfirmationTooltip show={this.state.showCopyConfirmation}>
            Copied!
          </CopyConfirmationTooltip>
          <Button onClick={this.copyToClipboard} buttonTheme="secondary" small>
            Copy Address
          </Button>
        </HashContainer>
      </ReceiveContainer>
    );
  }
}
