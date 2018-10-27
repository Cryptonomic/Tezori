import React, { Fragment, Component } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import RefreshIcon from '@material-ui/icons/Refresh';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import styled from 'styled-components';
import { generateNewMnemonic } from '../../utils/general';

import Button from '../Button';
import BackUpSeedPhrase from './BackUpSeedPhrase';
import { GENERATE_MNEMONIC } from '../../constants/AddAddressTypes';
import { importAddress } from '../../reduxContent/wallet/thunks';
import { wrapComponent } from '../../utils/i18n';

const ActionButton = styled(Button)`
  width: 194px;
  height: 50px;
  padding: 0;
  position: absolute;
  bottom: 0px;
`;

const CreateAccountSlideContainer = styled.div`
  max-width: 579px;
  height: 376px;
  margin: 0 auto;
  position: relative;
  .title {
    font-size: 18px;
    color: ${({ theme: { colors } }) => colors.black1};
    line-height: 1.28;
    font-weight: bold;
    margin-bottom: 30px;
  }
  .description {
    font-size: 18px;
    color: ${({ theme: { colors } }) => colors.black1};
    line-height: 1.28;
    font-weight: 300;
  }

  .generate-part {
    display: flex;
    float: right;
    margin-top: 16px;
    color: ${({ theme: { colors } }) => colors.blue1};
    font-size: 14px;
    cursor: pointer;
  }
  .back-part {
    margin: 0 0 20px -8px;
    color: #4486f0;
    cursor: pointer;
    display: flex;
    font-size: 16px;
    .chevron-icon {
      margin-right: 7px;
    }
  }

  .validFormContainer {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
`;

const SeedsContainer = styled.div`
  display: flex;
  background-color: #f7faff;
  margin-top: 18px;
  .seedColumn {
    flex: 1;
    border-right: solid 1px ${({ theme: { colors } }) => colors.index0};
    padding: 18px 0 18px 24px;
    &:last-child {
      border: none;
    }
  }

  .seedItem {
    line-height: 40px;
    font-size: 16px;
    display: flex;
    div {
      color: ${({ theme: { colors } }) => colors.index0};
      margin-right: 24px;
      text-align: right;
      width: 26px;
    }
  }
`;

type Props = {
  importAddress: () => {},
  t: () => {}
};

class CreateAccountSlide extends Component<Props> {
  props: Props;
  state = {
    isDisabled: false,
    seed: '',
    currentSlide: 0
  };

  componentDidMount() {
    this.updateMnemonic();
    document.addEventListener('keydown', this.onEnterPress);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onEnterPress);
  }

  nextAccountSlide = currentSlide => this.setState({ currentSlide });
  updateMnemonic = () => this.setState({ seed: generateNewMnemonic() });

  setupSeedColumns = seed => {
    const seedWords = seed.split(' ');
    const seeds = [];
    let seedColums = [];

    seedWords.forEach((item, index) => {
      seedColums.push(item);
      if (index % 5 === 4) {
        seeds.push(seedColums);
        seedColums = [];
      }
    });

    return seeds;
  };

  showSeedPhrase = () => {
    const seeds = this.setupSeedColumns(this.state.seed);
    const { t } = this.props;
    return (
      <Fragment>
        <div className="description">
          {t('components.createAccountSlide.descriptions.description1')}
        </div>
        {seeds.length && (
          <SeedsContainer>
            {seeds.map((items, index) => {
              return (
                <div className="seedColumn" key={index}>
                  {items.map((item, index1) => (
                    <div key={index1} className="seedItem">
                      <div>{index * 5 + index1 + 1}</div>
                      {item}
                    </div>
                  ))}
                </div>
              );
            })}
          </SeedsContainer>
        )}
        <div className="generate-part" onClick={this.updateMnemonic}>
          <RefreshIcon
            className="refresh-icon"
            style={{ fill: '#2c7df7', transform: 'scaleX(-1)' }}
          />
          {t('components.createAccountSlide.generate_other_seed')}
        </div>
        <ActionButton
          buttonTheme="primary"
          onClick={() => this.nextAccountSlide(1)}
        >
          {t('general.next')}
        </ActionButton>
      </Fragment>
    );
  };

  importAddress = () => {
    const { seed } = this.state;
    this.setState({ isDisabled: true })
    this.props.importAddress(GENERATE_MNEMONIC, seed);
  };

  onEnterPress = (event) => {
    const { currentSlide } = this.state;
    if(event.key === 'Enter' && currentSlide === 0) {
      this.nextAccountSlide(1)
    }
    if(event.key === 'Enter' && currentSlide === 2) {
      this.importAddress()
    }
  }

  createAccount = () => {
    const { t } = this.props;
    const { isDisabled } = this.state;
    return (
      <Fragment>
        <div className="title">{t('components.createAccountSlide.seed_backup')}</div>
        <div className="description">
          {t('components.createAccountSlide.descriptions.description2')}
        </div>
        <ActionButton buttonTheme="primary" disabled={isDisabled} onClick={this.importAddress}>
          {t('components.createAccountSlide.create_account')}
        </ActionButton>
      </Fragment>
    );
  };

  render() {
    const { currentSlide, seed } = this.state;
    const { t } = this.props;
    return (
      <CreateAccountSlideContainer>
        {!!currentSlide && (
          <div className="back-part" onClick={() => this.nextAccountSlide(0)}>
            <ChevronLeftIcon
              className="chevron-icon"
              style={{ fill: '#4486f0' }}
            />
            {t('components.createAccountSlide.back_to_seed')}
          </div>
        )}
        {currentSlide === 0 ? this.showSeedPhrase() : null}
        {currentSlide === 1 ? (
          <BackUpSeedPhrase
            seed={seed}
            nextAccountSlide={this.nextAccountSlide}
          />
        ) : null}
        {currentSlide === 2 ? this.createAccount() : null}
      </CreateAccountSlideContainer>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      importAddress
    },
    dispatch
  );
}

export default compose(wrapComponent, connect(null, mapDispatchToProps))(CreateAccountSlide);
