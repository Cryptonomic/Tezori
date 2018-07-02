import React, {Fragment, Component} from 'react';
import styled from 'styled-components';
import InputValidComponent from './InputValidComponent';
import Button from '../Button';

const ActionButton = styled(Button)`
  margin-top: 26px;
  width: 194px;
  height: 50px;
`


type Props = {
  seed: string,
  nextAccountSlide: Function
};

export default class BackUpSeedPhrase extends Component<Props> {
  props: Props;
  constructor(props) {
    super(props);
    this.state = { isValid: false, randomSeeds: [] };
  } 

  componentDidMount = () => {
    const randomSeeds = this.generateRandomSeeds();
    this.setState({randomSeeds});
  }

  validationStatus = [false, false, false, false];  

  checkValidation = (index, status) => {
    this.validationStatus[index] = status;
    let isValid = true;
    this.validationStatus.forEach((item) => {
      isValid = isValid && item;
    });
    this.setState({isValid});

  }

  generateRndNum = (num) => {
    return Math.floor(Math.random() * num);
  }

  generateRandomSeeds = () => {
    const seeds = this.props.seed.split(" ");
    const seedsArrObj = seeds.map((item, index) => ({index, item}));
    const resultObj = [];
    for (let ii=0; ii < 4; ii+=1 ) {
      const rndNum = this.generateRndNum(15 - ii);
      resultObj.push(seedsArrObj[rndNum]);
      seedsArrObj.splice(rndNum, 1);
    }
    return resultObj;
  }


  render() {
    
    return (
      <Fragment>
        <div className='description'>
          In order to ensure that you wrote down up your seed phrase, please type in the following four seed words.
        </div>
        <div className='validFormContainer'>
          {this.state.randomSeeds.length && this.state.randomSeeds.map((item, index) => {
            return <InputValidComponent key={index} value={item.item} index={item.index + 1} checkValidation={(validation) => this.checkValidation(index, validation)} />

          })}
        </div>
        <ActionButton 
          buttonTheme="primary"
          disabled={!this.state.isValid}
          onClick={() => this.props.nextAccountSlide(2)}
        >
          Next
        </ActionButton>
      </Fragment>
    );
  }

  
}