import React, { Component } from 'react';
import styled from 'styled-components';
import keycode from 'keycode';
import Downshift from 'downshift';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';
import CloseIcon from '@material-ui/icons/Close';
import { ms } from '../../styles/helpers';
import seedJson from './seed.json';


const ChipWrapper = styled(Chip)`
  &&& {
    font-size: 14px;
    color: ${ ({ theme: { colors } }) => colors.primary };
    background-color: ${ ({ theme: { colors } }) => colors.gray2 };
    margin: ${ms(-5)} ${ms(-5)} ${ms(-5)} 0;
    border: solid 1px rgba(181, 197, 227, 0.35);
    height: 24px;
    font-weight: 300;
  }
  
`
const ChipContainer = styled.div`
  span {
    margin-right: 4px;
    color: ${ ({ theme: { colors } }) => colors.index0 };
    font-size: 13px;
  }
`
const PaperWrapper = styled(Paper)`
  &&& {
    position: absolute;
    z-index: 100;
    margin-top: ${ms(0)};
    left: 0;
    right: 0;
    max-height: 240px;
    overflow: auto;
    color: ${ ({ theme: { colors } }) => colors.primary };    
  }
  
`
const CloseIconWrapper = styled(CloseIcon)`
  &&& {
    width: 15px;
  } 
`

const renderInput = (inputProps) => {
  const { InputProps, classes, ref, ...other } = inputProps;

  return (
    <TextField
      InputProps={{
        inputRef: ref,
        classes: {
          root: classes.inputRoot,
        },
        ...InputProps,
      }}
      {...other}
    />
  );
}
type Props1 = {
  highlightedIndex: any,
  index: any,
  itemProps: object,
  selectedItem: array,
  suggestion: any
};

const renderSuggestion = (props: Props1) => {
  const { highlightedIndex, index, itemProps, selectedItem, suggestion } = props;
  const isHighlighted = highlightedIndex === index;
  const isSelected = (selectedItem || '').indexOf(suggestion.label) > -1;

  return (
    <MenuItem
      {...itemProps}
      key={suggestion.label}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400,
        color: '#123262'
      }}
    >
      {suggestion.label}
    </MenuItem>
  );
}

type ChipProps = {
  index: number,
  value: string
};

const ChipContent = (props: ChipProps) => {
  const { index, value } = props;
  return <ChipContainer><span>{index+1}</span>{value}</ChipContainer>
}

const getSuggestions = (inputValue) => {
  if(inputValue.length<2) {
    return [];
  }
  return seedJson.filter(suggestion => (!inputValue || suggestion.label.toLowerCase().startsWith(inputValue.toLowerCase())))
}

const styles = () => ({
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  inputRoot: {
    flexWrap: 'wrap',
    color: '#123262'
  },
});

type Props = {
  selectedItem: array,
  inputValue: string,
  classes?: any,
  onChangeInput: Function,
  onChangeItems: Function
};

class SeedInput extends Component<Props> {
  componentDidMount() {
    
  }

  handleKeyDown = event => {
    const { inputValue, selectedItem, onChangeItems } = this.props;
    if (selectedItem.length && !inputValue.length && keycode(event) === 'backspace') {
      const newItems = selectedItem.slice(0, selectedItem.length - 1);
      onChangeItems(newItems);
    }
  };

  handleInputChange = event => {
    const { onChangeInput } = this.props;
    const newValue = event.target.value;
    onChangeInput(newValue);
  };

  handleChange = item => {
    let { selectedItem } = this.props;
    const { onChangeItems } = this.props;

    if (selectedItem.indexOf(item) === -1) {
      selectedItem = [...selectedItem, item];
    }   
    onChangeItems(selectedItem);
  };

  handleDelete = item => () => {
    const { onChangeItems, selectedItem } = this.props;
    selectedItem.splice(selectedItem.indexOf(item), 1);
    onChangeItems(selectedItem);
  };

  render() {
    const { classes, inputValue, selectedItem } = this.props;
    return (
      <Downshift inputValue={inputValue} onChange={this.handleChange} selectedItem={selectedItem}>
        {({
          getInputProps,
          getItemProps,
          isOpen,
          inputValue: inputValue2,
          selectedItem: selectedItem2,
          highlightedIndex,
        }) => (
          <div className={classes.container}>
            {renderInput({
              fullWidth: true,
              classes,
              InputProps: getInputProps({
                startAdornment: selectedItem.map((item, index) => {

                  return (
                    <ChipWrapper
                      key={item}
                      tabIndex={-1}
                      label={<ChipContent value={item} index={index} />}
                      deleteIcon={<CloseIconWrapper />}
                      onDelete={this.handleDelete(item)}
                    />
                  )
                }),
                onChange: this.handleInputChange,
                onKeyDown: this.handleKeyDown,
                label: 'Enter your 15 word seed phrase',
                id: 'integration-downshift-multiple',
              }),
            })}
            {isOpen ? (
              <PaperWrapper square>
                {getSuggestions(inputValue2).map((suggestion, index) =>
                  renderSuggestion({
                    suggestion,
                    index,
                    itemProps: getItemProps({ item: suggestion.label }),
                    highlightedIndex,
                    selectedItem: selectedItem2,
                  }),
                )}
              </PaperWrapper>
            ) : null}
          </div>
        )}
      </Downshift>
    );
  }
}

export default withStyles(styles)(SeedInput);