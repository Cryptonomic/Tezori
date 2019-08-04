import React, { Fragment, Component } from 'react';
import styled from 'styled-components';
import InputValidComponent from './InputValidComponent';
import Button from '../Button';
import { wrapComponent } from '../../utils/i18n';

const ActionButton = styled(Button)`
  margin-top: 26px;
  width: 194px;
  height: 50px;
`;

type Props = {
  seed: string,
  nextAccountSlide: () => {},
  t: () => {}
};

class BackUpSeedPhrase extends Component<Props> {
  props: Props;
  state = {
    isValid: false,
    randomSeeds: []
  };

  componentDidMount = () => {
    const randomSeeds = this.generateRandomSeeds();
    this.setState({ randomSeeds });
  };
  validationStatus = [false, false, false, false];

  checkValidation = (index, status) => {
    this.validationStatus[index] = status;
    let isValid = true;
    this.validationStatus.forEach(item => {
      isValid = isValid && item;
    });
    this.setState({ isValid });
  };

  generateRndNum = num => {
    return Math.floor(Math.random() * num);
  };

  generateRandomSeeds = () => {
    const seeds = this.props.seed.split(' ');
    const seedsArrObj = seeds.map((item, index) => ({ index, item }));
    const resultObj = [];
    for (let ii = 0; ii < 4; ii += 1) {
      const rndNum = this.generateRndNum(seeds.length - ii);
      resultObj.push(seedsArrObj[rndNum]);
      seedsArrObj.splice(rndNum, 1);
    }
    return resultObj;
  };
  onEnter = () => {
    if (this.state.isValid) {
      this.props.nextAccountSlide(2);
    }
  };

  render() {
    const { t, nextAccountSlide } = this.props;
    return (
      <Fragment>
        <div className="description">
          {t('components.createAccountSlide.descriptions.description3')}
        </div>
        <div className="validFormContainer">
          {this.state.randomSeeds.length &&
            this.state.randomSeeds.map((item, index) => {
              return (
                <InputValidComponent
                  key={index}
                  value={item.item}
                  index={item.index + 1}
                  checkValidation={validation =>
                    this.checkValidation(index, validation)
                  }
                  onEnter={this.onEnter}
                />
              );
            })}
        </div>
        <ActionButton
          buttonTheme="primary"
          disabled={!this.state.isValid}
          onClick={() => nextAccountSlide(2)}
        >
          {t('general.next')}
        </ActionButton>
      </Fragment>
    );
  }
}

export default wrapComponent(BackUpSeedPhrase);
