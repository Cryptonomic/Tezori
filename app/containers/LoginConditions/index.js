// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { goBack as back } from 'react-router-redux';
import styled from 'styled-components';
import BackCaret from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import { ms } from '../../styles/helpers';
import { H2 } from '../../components/Heading/';
import PdfReader from '../../components/PdfReader/';
import { termsService, privacyPolicy } from '../../config.json';

type Props = {
  match?: object,
  goBack: () => {}
};

const BackToWallet = styled.div`
  display: flex;
  align-items: center;
  align-self: flex-start;
  color: #4486f0;
  cursor: pointer;
  margin-bottom: 1rem;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${ms(3)} ${ms(10)};
  align-items: center;
  flex-grow: 1;
`;

class LoginConditions extends Component<Props> {
  props: Props;

  render() {
    const { match, goBack } = this.props;
    const { type } = match.params;

    let title = 'Privacy Policy';
    let url = privacyPolicy;
    if (type === 'termsOfService') {
      title = 'Terms Of Service';
      url = termsService;
    }
    return (
      <Container>
        <BackToWallet onClick={goBack}>
          <BackCaret
            style={{
              fill: '#4486f0',
              height: '28px',
              width: '28px',
              marginRight: '5px',
              marginLeft: '-9px',
              marginTop: '4px'
            }}
          />
          <span>Back</span>
        </BackToWallet>

        <H2>{title}</H2>
        <PdfReader pdfUrl={url} />
      </Container>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      goBack: () => dispatch => dispatch(back())
    },
    dispatch
  );
}

export default connect(null, mapDispatchToProps)(LoginConditions);
