import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Dialog, TextField } from 'material-ui';
import classNames from 'classnames';
import styled from 'styled-components'
import { lighten } from 'polished'
import { ms } from '../../styles/helpers'
import { shell } from 'electron'

import Button from '../../components/Button/';
import { H4 } from '../../components/Heading/'
import * as ADD_ADDRESS_TYPES from '../../constants/AddAddressTypes';
import Loader from '../../components/Loader';

import Tooltip from '../../components/Tooltip/';
import TezosIcon from '../../components/TezosIcon/';

import CreateAccountSlide from '../../components/CreateAccountSlide/';
import { importAddress } from '../../reduxContent/wallet/thunks';
import styles from './styles.css';

const Container = styled.div`
  width: 80%;
  margin: ${ms(1)} auto 0;
  padding: ${ms(3)} ${ms(4)};
`;

const InputWithTooltip = styled.div`
  position: relative;
  
  & button {
    position: absolute;
    top: 50%;
    right: ${ms(-2)};
  }
`

const FormTitle = styled(H4)`
  font-size: ${ms(1)};
`

const HelpIcon = styled(TezosIcon)`
  padding: 0 0 0 ${ms(-4)};
`;

const TooltipContainer = styled.div`
  font-size: ${ms(-1)};
  color: ${({ theme: { colors } }) => colors.primary };
  max-width: ${ms(15.5)};
  font-weight: ${({theme: {typo}}) => typo.weights.light };
`

const TooltipTitle = styled.p`
  font-weight: ${({theme: {typo}}) => typo.weights.bold };
  margin: 0 0 ${ms(-1)} 0;
`

const RowInputs = styled.div`
  display: grid;
  grid-column-gap: ${ms(1)};
  grid-template-columns: 3fr 4fr;
`

const ImportButton = styled(Button)`
  margin: ${ms(6)} 0 0 0;
`

const StyledTooltip = styled(Tooltip)`
  &__tooltip-inner {
    background-color: ${({theme: {colors}}) => lighten(0.2, colors.secondary)};
  }
`

const Link = styled.span`
  cursor: pointer;
  text-decoration: underline;
  color: ${ ({ theme: { colors } }) => colors.blue2 };
`

const PasswordTooltip = () => {
  return (
    <TooltipContainer>
      <TooltipTitle>Fundraiser Password</TooltipTitle>
      This is the password that you used when generating a Tezos paper wallet to participate in the Fundraiser.
    </TooltipContainer>
  )
}

const EmailTooltip = () => {
  return (
    <TooltipContainer>
      <TooltipTitle>Fundraiser Email Address</TooltipTitle>
      This is the email address that you used when generating a Tezos paper wallet to participate in the Fundraiser
    </TooltipContainer>
  )
}

const ActivationTooltip = () => {
  const openLink = () => shell.openExternal('https://verification.tezos.com/')
  return (
    <TooltipContainer>
      <TooltipTitle>Activation Code</TooltipTitle>
      This is the activation code that you received after completing the KYC/AML process. An activation code corresponds
      to a public key hash and is required if you participated in the Fundraiser.
      You may complete the process at <Link onClick={openLink}>verification.tezos.com</Link> if you have not done so already.
    </TooltipContainer>
  )
}

const PkhTooltip = () => {
  return (
    <TooltipContainer>
      <TooltipTitle>Public key hash</TooltipTitle>
      This is the public key hash as provided in the paper wallet.
    </TooltipContainer>
  )
}

const ActivationTooltipStyled = styled(ActivationTooltip)`
  max-width: ${ms(14)}
`

type Props = {
  importAddress: Function,
  isLoading: boolean
};

class AddAddress extends Component<Props> {
  props: Props;

  state = {
    activeTab: ADD_ADDRESS_TYPES.FUNDRAISER,
    seed: '',
    pkh: '',
    activationCode: '',
    username: '',
    passPhrase: ''
  };

  renderTab = (tabName) => {
    const { activeTab } = this.state;
    const tabClasses = classNames({
      [styles.tab]: true,
      [styles.inactiveTab]: tabName !== activeTab,
      [styles.activeTab]: tabName === activeTab
    });

    return (
      <div
        key={tabName}
        className={tabClasses}
        onClick={() => this.setState({ activeTab: tabName })}
      >
        {tabName}
      </div>
    );

  };

  renderTabController = () => {
    return (
      <div className={styles.tabContainer}>
        {Object.values(ADD_ADDRESS_TYPES).map(this.renderTab)}
      </div>
    );
  };

  renderAppBar = () => {
    return (
      <div className={styles.titleContainer}>
        <div>Add an Address</div>
      </div>
    );
  };

  importAddress = () => {
    const { activeTab, seed, passPhrase, pkh, username, activationCode } = this.state;
    this.props.importAddress(activeTab, seed, pkh, activationCode, username, passPhrase);
  };

  renderAddBody() {
    const { activeTab, seed, passPhrase, pkh, username, activationCode } = this.state;
    const { isLoading } = this.props;
    switch ( activeTab ) {
      case ADD_ADDRESS_TYPES.GENERATE_MNEMONIC:
        return (
          <CreateAccountSlide />
        );
      case ADD_ADDRESS_TYPES.FUNDRAISER:
      default:
        return (
          <Fragment>
            <FormTitle>Please refer to the PDF document that you created during the Fundraiser.</FormTitle>
            <TextField
              floatingLabelText="15 Word Secret Key"
              style={{ width: '100%' }}
              value={ seed }
              onChange={(_, newSeed) => this.setState({ seed: newSeed })}
            />
            <RowInputs>
              <InputWithTooltip>
                <TextField
                  floatingLabelText="Fundraiser Password"
                  type="password"
                  style={{ width: '100%', padding: `0 ${ms(3)} 0 0` }}
                  value={passPhrase}
                  onChange={(_, newPassPhrase) => this.setState({ passPhrase: newPassPhrase })}
                />

                <StyledTooltip position="bottom" content={PasswordTooltip}>
                  <Button buttonTheme="plain">
                    <HelpIcon
                      iconName="help"
                      size={ms(0)}
                      color="secondary"
                    />
                  </Button>
                </StyledTooltip>
              </InputWithTooltip>

              <InputWithTooltip>
                <TextField
                  floatingLabelText="Public key hash"
                  style={{ width: '100%', padding: `0 ${ms(3)} 0 0` }}
                  value={ pkh }
                  onChange={(_, newPkh) => this.setState({ pkh: newPkh })}
                />
                <StyledTooltip position="bottom" content={PkhTooltip}>
                  <Button buttonTheme="plain">
                    <HelpIcon
                      iconName="help"
                      size={ms(0)}
                      color="secondary"
                    />
                  </Button>
                </StyledTooltip>
              </InputWithTooltip>
            </RowInputs>

            <RowInputs>
              <InputWithTooltip>
                <TextField
                  floatingLabelText="Fundraiser Email Address"
                  style={{ width: '100%', padding: `0 ${ms(3)} 0 0` }}
                  value={username}
                  onChange={(_, newUsername) => this.setState({ username: newUsername })}
                />

                <StyledTooltip position="bottom" content={EmailTooltip}>
                  <Button buttonTheme="plain">
                    <HelpIcon
                      iconName="help"
                      size={ms(0)}
                      color="secondary"
                    />
                  </Button>
                </StyledTooltip>
              </InputWithTooltip>

              <InputWithTooltip>
                <TextField
                  floatingLabelText="Activation Code"
                  style={{ width: '100%', padding: `0 ${ms(3)} 0 0` }}
                  value={activationCode}
                  onChange={(_, newActivationCode) => this.setState({ activationCode: newActivationCode })}
                />
                <StyledTooltip position="bottom" content={ActivationTooltip}>
                  <Button buttonTheme="plain">
                    <HelpIcon
                      iconName="help"
                      size={ms(0)}
                      color="secondary"
                    />
                  </Button>
                </StyledTooltip>
              </InputWithTooltip>
              </RowInputs>
            <ImportButton
              buttonTheme="primary"
              onClick={this.importAddress}
              disabled={isLoading}
            >
              Import
            </ImportButton>
          </Fragment>
        );
    }
  }

  render() {
    const { activeTab } = this.state;
    const { isLoading, goBack } = this.props;
    return (
      <Container>
        {this.renderAppBar()}
        {this.renderTabController()}
        <div className={styles.addAddressBodyContainer}>
          {this.renderAddBody()}
          {isLoading && <Loader />}
        </div>
      </Container>
    );
  }
}

function mapStateToProps({ wallet, message }) {
  return {
    isLoading: wallet.get('isLoading'),
    message: message.get('message')
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    importAddress
  }, dispatch );
}

export default connect(mapStateToProps, mapDispatchToProps)(AddAddress);

