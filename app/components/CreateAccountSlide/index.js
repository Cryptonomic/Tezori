import React, {Fragment, Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh';
import ChevronLeftIcon from 'material-ui/svg-icons/navigation/chevron-left';
import styled from 'styled-components';
import { generateNewMnemonic } from '../../utils/general';

import Button from '../Button';
import BackUpSeedPhrase from './BackUpSeedPhrase';
import { GENERATE_MNEMONIC } from '../../constants/AddAddressTypes';
import { importAddress } from '../../redux/wallet/thunks';


const ActionButton = styled(Button)`
  width: 194px;
  height: 50px;
  padding: 0;
  position: absolute;
  bottom: 0px;
`

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
    color: ${({ theme: { colors } }) => colors.blue};
    font-size: 14px;
    cursor: pointer;
  }
  .back-part {
    margin: 0 0 20px -8px;
    color: #4486f0;
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
`

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
`

type Props = {
  importAddress: Function
};

class CreateAccountSlide extends Component<Props> {
  props:Props;
  state = {
    seed: '',
    currentSlide: 0
  };

  nextAccountSlide = (currentSlide) =>  this.setState({ currentSlide });
  updateMnemonic = () =>  this.setState({ seed: generateNewMnemonic() });

  setupSeedColumns = (seed) => {
    const seedWords = seed.split(" ");
    const seeds = [];
    let seedColums = [];

    seedWords.forEach((item, index) => {
      seedColums.push(item);
      if (index%5 === 4) {
        seeds.push(seedColums);
        seedColums = [];
      }
    });

    return seeds;
  };

  showSeedPhrase =  () => {
    const seeds = this.setupSeedColumns(this.state.seed);
    return (
      <Fragment>
        <div className='description'>
          Write down your seed phrase on a piece of paper and keep it in a safe place. You will need your seed phrase to recover your account.
        </div>
        {seeds.length &&
        <SeedsContainer>
          { seeds.map((items, index) => {
            return (
              <div className="seedColumn" key={index}>
                {items.map((item, index1) => (<div key={index1} className="seedItem"><div>{index*5 + index1 + 1}</div>{item}</div>))}
              </div>
            )
          })
          }
        </SeedsContainer>
        }
        <div className="generate-part" onClick={this.updateMnemonic}>
          <RefreshIcon
            className='refresh-icon'
            style={{ fill: '#2c7df7', transform: 'scaleX(-1)' }}
          />
          Generate Another Seed Pharse
        </div>
        <ActionButton
          buttonTheme="primary"
          onClick={() => this.nextAccountSlide(1)}
        >
          Next
        </ActionButton>
      </Fragment>
    )
  };

  importAddress = () => {
    const { seed } = this.state;
    this.props.importAddress(GENERATE_MNEMONIC, seed);
  };

  createAccount = () => {
    return (
      <Fragment>
        <div className='title'>
          Your Tezos account seed is backed up!
        </div>
        <div className='description'>
          Make sure to keep your seed phrase in a safe place. If you forget your seed phrase, you will not be able to recover your account. We do not store your seed phrase and cannot help you recover it if you lose it.
        </div>

        <ActionButton
          buttonTheme="primary"
          onClick={importAddress}
        >
          Create Account
        </ActionButton>
      </Fragment>
    )
  };

  render() {
    const { currentSlide, seed } = this.state;
    return(
      <CreateAccountSlideContainer>
        { !!currentSlide &&
        <div className="back-part" onClick={() => this.nextAccountSlide(0)}>
          <ChevronLeftIcon
            className='chevron-icon'
            style={{ fill: '#4486f0' }}
          />
          Back to Seed Pharse
        </div>
        }
        {
          currentSlide === 0
            ? this.showSeedPhrase()
            : null
        }
        {
          currentSlide === 1
            ? <BackUpSeedPhrase seed={seed} nextAccountSlide={this.nextAccountSlide} />
            : null
        }
        {
          currentSlide === 2
            ? this.createAccount()
            : null
        }
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

export default connect(null, mapDispatchToProps)(CreateAccountSlide);
