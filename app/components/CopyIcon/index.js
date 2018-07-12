import React, { Component } from 'react';
import { clipboard } from 'electron';
import styled, { withTheme } from 'styled-components';
import ContentCopy from 'material-ui/svg-icons/content/content-copy';
import { ms } from '../../styles/helpers';

const CopyConfirmationTooltip = styled.div`
  position: absolute;
  top: -35px;
  right: -55px;
  background: ${({ theme: { colors } }) => colors.white};
  color: ${({ theme: { colors } }) => colors.accent};
  font-size: ${ms(-1)};
  border-radius: ${ms(0)};
  border: 1px solid ${({ theme: { colors } }) => colors.accent};
  padding: ${ms(-5)};
  opacity: ${({ show }) => (show ? 1 : 0)};
  transition: opacity 0.4s;
  z-index: 1000;
`;

const Container = styled.div`
  position: relative;
`;

class CopyIcon extends Component<Props> {
  state = {
    showCopyConfirmation: false
  };

  copyToClipboard = text => {
    try {
      clipboard.writeText(text);
      this.setState({ showCopyConfirmation: true }, () => {
        setTimeout(() => {
          this.setState({ showCopyConfirmation: false });
        }, 1000);
      });
    } catch (e) {
      console.error(e);
    }
  };

  render() {
    const {
      text,
      color,
      theme: { colors },
      className
    } = this.props;
    return (
      <Container>
        <ContentCopy
          onClick={() => this.copyToClipboard(text)}
          style={{
            width: ms(1),
            height: ms(1),
            color: colors[color],
            cursor: 'pointer',
            marginLeft: ms(0)
          }}
          className={className}
        />
        <CopyConfirmationTooltip show={this.state.showCopyConfirmation}>
          Copied!
        </CopyConfirmationTooltip>
      </Container>
    );
  }
}

CopyIcon.defaultProps = {
  color: 'white'
};

export default withTheme(CopyIcon);
