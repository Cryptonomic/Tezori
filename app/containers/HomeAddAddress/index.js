import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Dialog, TextField } from 'material-ui';
import classNames from 'classnames';
import styled from 'styled-components'
import { lighten } from 'polished'
import { ms } from '../../styles/helpers'

import Button from '../../components/Button/';
import { H4 } from '../../components/Heading/'
import * as ADD_ADDRESS_TYPES from '../../constants/AddAddressTypes';
import Loader from '../../components/Loader';

import Tooltip from '../../components/Tooltip/';
import TezosIcon from '../../components/TezosIcon/';

import { importAddress } from '../../redux/wallet/thunks';
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
  color: ${({ theme: { colors } }) => colors.secondary};
  max-width: ${ms(16)};
`

const TooltipTitle = styled.p`
  font-weight: ${({theme: {typo}}) => typo.weights.bold};
  margin: 0 0 ${ms(-1)} 0;
`

const TwoColumnsInputs = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-column-gap: ${ms(1)};
`

const ImportButton = styled(Button)`
  margin: ${ms(6)} 0 0 0;
`

const StyledTooltip = styled(Tooltip)`
  &__tooltip-inner {
    background-color: ${({theme: {colors}}) => lighten(0.2, colors.secondary)};
  }
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
  return (
    <TooltipContainer>
      <TooltipTitle>Activation Code</TooltipTitle>
      This is the activation code that you received after completing the KYC/AML process. An activation code corresponds
      to a public key hash and is required if you participated in the Fundraiser.
      You may complete the process at verification.tezos.com if you have not done so already.
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

  renderAddBody() {
    const { activeTab, seed, passPhrase, pkh, username, activationCode } = this.state;
    switch (activeTab) {
      case ADD_ADDRESS_TYPES.GENERATE_MNEMONIC:
        return (
          <div>
            <TextField
              floatingLabelText="Seed Words"
              style={{ width: '100%' }}
              value={ seed }
              onChange={(_, newSeed) => this.setState({ seed: newSeed })}
            />
            <TextField
              floatingLabelText="Password"
              style={{ width: '100%' }}
              value={passPhrase}
              onChange={(_, newPassPhrase) => this.setState({ passPhrase: newPassPhrase })}
            />
          </div>
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
            <TwoColumnsInputs>
              <InputWithTooltip>
                <TextField
                  floatingLabelText="Fundraiser Password"
                  type="password"
                  style={{ width: '100%' }}
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
                  style={{ width: '100%' }}
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
            </TwoColumnsInputs>

            <TwoColumnsInputs>
              <InputWithTooltip>
                <TextField
                  floatingLabelText="Fundraiser Email Address"
                  style={{ width: '100%' }}
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
                  style={{ width: '100%' }}
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
            </TwoColumnsInputs>
          </Fragment>
        );
    }
  }

  importAddress = () => {
    const { activeTab, seed, passPhrase, pkh, username, activationCode } = this.state;
    this.props.importAddress(activeTab, seed, pkh, activationCode, username, passPhrase);
  };

  render() {
    const { activeTab } = this.state;
    const { isLoading } = this.props;
    return (
      <Container>
        {this.renderAppBar()}
        {this.renderTabController()}
        <div className={styles.addAddressBodyContainer}>
          {this.renderAddBody()}
          <ImportButton
            buttonTheme="primary"
            onClick={this.importAddress}
            disabled={isLoading}
          >
            {
              activeTab === ADD_ADDRESS_TYPES.FUNDRAISER
                ? 'Import'
                : 'Create'
            }
          </ImportButton>
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
