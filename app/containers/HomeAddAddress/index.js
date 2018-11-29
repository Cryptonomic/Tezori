import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { Trans } from 'react-i18next';
import styled, { css } from 'styled-components';
import { lighten } from 'polished';
import { ms } from '../../styles/helpers';
import TextField from '../../components/TextField';

import Button from '../../components/Button/';
import { H4 } from '../../components/Heading/';
import * as ADD_ADDRESS_TYPES from '../../constants/AddAddressTypes';
import Loader from '../../components/Loader/';

import Tooltip from '../../components/Tooltip/';
import TezosIcon from '../../components/TezosIcon/';
import RestoreBackup from '../../components/RestoreBackup';

import CreateAccountSlide from '../../components/CreateAccountSlide/';
import { importAddress } from '../../reduxContent/wallet/thunks';
import { openLink } from '../../utils/general';
import { wrapComponent } from '../../utils/i18n';

import SeedInput from '../../components/RestoreBackup/SeedInput';
import seedJson from '../../components/RestoreBackup/seed.json';

const Container = styled.div`
  width: 80%;
  margin: ${ms(1)} auto 0;
  padding: ${ms(3)} ${ms(4)};
`;

const InputWithTooltip = styled.div`
  position: relative;
  & button {
    position: absolute;
    top: 24px;
    right: ${ms(-2)};
  }
`;

const FormTitle = styled(H4)`
  font-size: ${ms(1)};
  margin-bottom: 30px;
  color: ${({ theme: { colors } }) => colors.gray0};
`;

const HelpIcon = styled(TezosIcon)`
  padding: 0 0 0 ${ms(-4)};
`;

const TooltipContainer = styled.div`
  font-size: ${ms(-1)};
  color: ${({ theme: { colors } }) => colors.primary};
  max-width: ${ms(15.5)};
  font-weight: ${({ theme: { typo } }) => typo.weights.light};
`;

const TooltipTitle = styled.p`
  font-weight: ${({ theme: { typo } }) => typo.weights.bold};
  margin: 0 0 ${ms(-1)} 0;
`;

const RowInputs = styled.div`
  display: grid;
  grid-column-gap: ${ms(1)};
  grid-template-columns: 3fr 4fr;
  margin-top: 22px;
`;

const ImportButton = styled(Button)`
  margin: 25px 0 0 0;
`;

const StyledTooltip = styled(Tooltip)`
  &__tooltip-inner {
    background-color: ${({ theme: { colors } }) =>
      lighten(0.2, colors.secondary)};
  }
`;

const Link = styled.span`
  cursor: pointer;
  text-decoration: underline;
  color: ${({ theme: { colors } }) => colors.blue2};
`;

const TitleContainer = styled.div`
  background-color: #417def;
  color: white;
  font-size: 24px;
  width: 100%;
  height: 80px;
  padding: 20px 60px;
  display: flex;
  align-items: center;
`;

const TabContainer = styled.div`
  display: flex;
  align-items: center;
  height: 60px;
  width: 100%;
  justify-content: space-around;
`;

const Tab = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  width: 100%;
  height: 100%;
  ${({ isActive }) => {
    if (isActive) {
      return css`
        color: #1a325f;
        background-color: white;
        text-align: center;
        padding: 0 10px;
      `;
    }
    return css`
      background-color: #417def;
      color: white;
      text-align: center;
      padding: 0 10px;
    `;
  }};
`;

const AddAddressBodyContainer = styled.div`
  background-color: white;
  padding: 2rem;
`;

const ShowHidePwd = styled.div`
  position: absolute;
  top: 22px;
  right: ${ms(4)};
  color: ${({ theme: { colors } }) => colors.accent};
  font-size: 12px;
  font-weight: 500;
`;

const PasswordTooltip = t => {
  return (
    <TooltipContainer>
      <TooltipTitle>
        {t('containers.homeAddAddress.fundraiser_password')}
      </TooltipTitle>
      {t('containers.homeAddAddress.tooltips.password_tooltip')}
    </TooltipContainer>
  );
};

const EmailTooltip = t => {
  return (
    <TooltipContainer>
      <TooltipTitle>
        {t('containers.homeAddAddress.fundraiser_email_address')}
      </TooltipTitle>
      {t('containers.homeAddAddress.tooltips.email_tooltip')}
    </TooltipContainer>
  );
};

const ActivationTooltip = t => {
  const openALink = () => openLink('https://verification.tezos.com/');
  return (
    <TooltipContainer>
      <TooltipTitle>
        {t('containers.homeAddAddress.activation_code')}
      </TooltipTitle>
      <Trans i18nKey="containers.homeAddAddress.tooltips.activation_code_tooltip">
        This is the activation code that you received after completing the
        KYC/AML process. An activation code corresponds to a public key hash and
        is required if you participated in the Fundraiser. You may complete the
        process at <Link onClick={openALink}>verification.tezos.com</Link> if
        you have not done so already.
      </Trans>
    </TooltipContainer>
  );
};

const PkhTooltip = t => {
  return (
    <TooltipContainer>
      <TooltipTitle>
        {t('containers.homeAddAddress.public_key_hash')}
      </TooltipTitle>
      {t('containers.homeAddAddress.tooltips.public_key_hash_tooltip')}
    </TooltipContainer>
  );
};

type Props = {
  importAddress: () => {},
  isLoading: boolean,
  t: () => {}
};

class AddAddress extends Component<Props> {
  props: Props;

  state = {
    activeTab: ADD_ADDRESS_TYPES.FUNDRAISER,
    inputValue: '',
    pkh: '',
    activationCode: '',
    username: '',
    passPhrase: '',
    isShowedPwd: false,
    seeds: [],
    error: false,
    errorText: ''
  };

  renderTab = tabName => {
    const { activeTab } = this.state;
    const { t } = this.props;
    return (
      <Tab
        key={tabName}
        isActive={tabName === activeTab}
        onClick={() => this.setState({ activeTab: tabName })}
      >
        {t(tabName)}
      </Tab>
    );
  };

  renderTabController = () => {
    return (
      <TabContainer>
        {Object.values(ADD_ADDRESS_TYPES).map(this.renderTab)}
      </TabContainer>
    );
  };

  renderAppBar = () => {
    const { t } = this.props;
    return (
      <TitleContainer>
        <div>{t('containers.homeAddAddress.add_account')}</div>
      </TitleContainer>
    );
  };

  importAddress = () => {
    const {
      activeTab,
      seeds,
      passPhrase,
      pkh,
      username,
      activationCode
    } = this.state;
    const input = seeds.toString();
    const words = input.replace(/["\s]/g, '');
    const inputVal = words.replace(/,/g, ' ');
    this.props.importAddress(
      activeTab,
      inputVal,
      pkh,
      activationCode,
      username,
      passPhrase
    );
  };

  seedPhraseConvert = inputValue => {
    if (inputValue.indexOf('"') > -1 || inputValue.indexOf(',') > -1) {
      const words = inputValue.replace(/["\s]/g, '');
      const seedString = words.replace(/,/g, ' ');
      return seedString.split(/\s+/);
    }
    return inputValue.split(/\s+/);
  };

  triggerError = (error, errorText) => {
    this.setState({ error });
    this.setState({ errorText });
  };

  onChangeInput = val => {
    if (val.length > 15) {
      const seedWords = seedJson.map(words => {
        return words.label.toLowerCase();
      });
      const seeds = this.seedPhraseConvert(val);
      const badWords = seeds.filter(
        element => seedWords.indexOf(element) === -1
      );
      if (seeds.length > 15) {
        seeds.length = 15;
        this.triggerError(
          true,
          'Seed phrases must contain no more than 15 words.'
        );
      } else if (badWords.length > 0) {
        this.triggerError(
          true,
          'Detected invalid word(s). Please double check.'
        );
      }
      this.setState({ seeds });
    } else {
      this.setState({ inputValue: val });
    }
  };

  onChangeItems = items => {
    const seedWords = seedJson.map(words => {
      return words.label.toLowerCase();
    });
    const badWords = items.filter(element => seedWords.indexOf(element) === -1);
    if (badWords.length === 0) {
      this.triggerError(false, '');
    }
    this.setState({ seeds: items, inputValue: '' });
  };

  renderAddBody() {
    const {
      activeTab,
      inputValue,
      passPhrase,
      pkh,
      username,
      activationCode,
      isShowedPwd,
      seeds,
      error,
      errorText
    } = this.state;
    const { t } = this.props;
    const isDisabled =
      error ||
      errorText !== '' ||
      passPhrase === '' ||
      activationCode === '' ||
      pkh === '';
    switch (activeTab) {
      case ADD_ADDRESS_TYPES.GENERATE_MNEMONIC:
        return <CreateAccountSlide />;
      case ADD_ADDRESS_TYPES.RESTORE:
        return <RestoreBackup />;
      case ADD_ADDRESS_TYPES.FUNDRAISER:
      default:
        return (
          <Fragment>
            <FormTitle>
              {t('containers.homeAddAddress.refer_pdf_title')}
            </FormTitle>
            <SeedInput
              triggerError={this.triggerError}
              errorText={errorText}
              error={error}
              selectedItems={seeds}
              inputValue={inputValue}
              onChangeInput={this.onChangeInput}
              onChangeItems={this.onChangeItems}
            />
            <RowInputs>
              <InputWithTooltip>
                <TextField
                  label={t('containers.homeAddAddress.fundraiser_password')}
                  type={isShowedPwd ? 'text' : 'password'}
                  value={passPhrase}
                  onChange={newPassPhrase =>
                    this.setState({ passPhrase: newPassPhrase })
                  }
                  right={65}
                />

                <ShowHidePwd
                  onClick={() => this.setState({ isShowedPwd: !isShowedPwd })}
                  style={{ cursor: 'pointer' }}
                >
                  {t(isShowedPwd ? 'general.verbs.hide' : 'general.verbs.show')}
                </ShowHidePwd>

                <StyledTooltip
                  position="bottom"
                  content={() => PasswordTooltip(t)}
                >
                  <Button buttonTheme="plain">
                    <HelpIcon iconName="help" size={ms(0)} color="secondary" />
                  </Button>
                </StyledTooltip>
              </InputWithTooltip>

              <InputWithTooltip>
                <TextField
                  label={t('containers.homeAddAddress.public_key_hash')}
                  value={pkh}
                  onChange={newPkh => this.setState({ pkh: newPkh })}
                  right={30}
                />
                <StyledTooltip position="bottom" content={() => PkhTooltip(t)}>
                  <Button buttonTheme="plain">
                    <HelpIcon iconName="help" size={ms(0)} color="secondary" />
                  </Button>
                </StyledTooltip>
              </InputWithTooltip>
            </RowInputs>

            <RowInputs>
              <InputWithTooltip>
                <TextField
                  label={t(
                    'containers.homeAddAddress.fundraiser_email_address'
                  )}
                  value={username}
                  onChange={newUsername =>
                    this.setState({ username: newUsername })
                  }
                  right={30}
                />

                <StyledTooltip
                  position="top"
                  arrowPos={{ left: '71%' }}
                  content={() => EmailTooltip(t)}
                >
                  <Button buttonTheme="plain">
                    <HelpIcon iconName="help" size={ms(0)} color="secondary" />
                  </Button>
                </StyledTooltip>
              </InputWithTooltip>

              <InputWithTooltip>
                <TextField
                  label={t('containers.homeAddAddress.activation_code')}
                  value={activationCode}
                  onChange={newActivationCode =>
                    this.setState({ activationCode: newActivationCode })
                  }
                  right={30}
                />
                <StyledTooltip
                  position="top"
                  arrowPos={{ left: '71%' }}
                  content={() => ActivationTooltip(t)}
                >
                  <Button buttonTheme="plain">
                    <HelpIcon iconName="help" size={ms(0)} color="secondary" />
                  </Button>
                </StyledTooltip>
              </InputWithTooltip>
            </RowInputs>
            <ImportButton
              buttonTheme="primary"
              onClick={this.importAddress}
              disabled={isDisabled}
            >
              {t('general.verbs.import')}
            </ImportButton>
          </Fragment>
        );
    }
  }

  render() {
    const { isLoading } = this.props;
    return (
      <Container>
        {this.renderAppBar()}
        {this.renderTabController()}
        <AddAddressBodyContainer>
          {this.renderAddBody()}
          {isLoading && <Loader />}
        </AddAddressBodyContainer>
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
  return bindActionCreators(
    {
      importAddress
    },
    dispatch
  );
}

export default compose(
  wrapComponent,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(AddAddress);
