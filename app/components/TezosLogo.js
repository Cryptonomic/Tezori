// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import Button from './Button';
import tezosLogo from '../../resources/tezosLogo.png';
import { goHomeAndClearState } from '../reducers/walletInitialization.duck';

const Logo = styled.img`
  height: 50px;
  width: 50px;
  cursor: pointer;
  margin-left: -10px;
`;

type Props = {
  goHomeAndClearState: Function
};

class TezosLogo extends Component<Props> {
  render() {
    const { goHomeAndClearState } = this.props;
    return (
      <Button
        onClick={goHomeAndClearState}
        theme="plain"
        children={<Logo src={tezosLogo} />}
      />
    );
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ goHomeAndClearState }, dispatch);

export default connect(null, mapDispatchToProps)(TezosLogo);
