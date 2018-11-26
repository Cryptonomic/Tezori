import React, { Component } from 'react';
import styled from 'styled-components';
import keycode from 'keycode';
import Downshift from 'downshift';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';
import CloseIcon from '@material-ui/icons/Close';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';

import { ms } from '../../styles/helpers';
import seedJson from './seed.json';

const InvalidChipWrapper = styled(Chip)`
  &&& {
    font-size: 14px;
    color: ${({ theme: { colors } }) => colors.primary};
    background-color: #f6d6d6;
    margin: ${ms(-5)} ${ms(-5)} ${ms(-5)} 0;
    border: solid 1px rgba(181, 197, 227, 0.35);
    height: 24px;
    font-weight: 300;
  }
`;

const ChipWrapper = styled(Chip)`
  &&& {
    font-size: 14px;
    color: ${({ theme: { colors } }) => colors.primary};
    background-color: ${({ theme: { colors } }) => colors.gray2};
    margin: ${ms(-5)} ${ms(-5)} ${ms(-5)} 0;
    border: solid 1px rgba(181, 197, 227, 0.35);
    height: 24px;
    font-weight: 300;
  }
`;

const ChipContainer = styled.div`
  span {
    margin-right: 4px;
    color: ${({ theme: { colors } }) => colors.index0};
    font-size: 13px;
  }
`;
const PaperWrapper = styled(Paper)`
  &&& {
    position: absolute;
    z-index: 100;
    margin-top: ${ms(0)};
    left: 0;
    right: 0;
    max-height: 240px;
    overflow: auto;
    color: ${({ theme: { colors } }) => colors.primary};
  }
`;
const CloseIconWrapper = styled(CloseIcon)`
  &&& {
    width: 15px;
  }
`;

const Container = styled(FormControl)`
  width: 100%;
  pointer-events: ${props => (props.disabled ? 'none' : 'auto')};
`;

const InputWrapper = styled(Input)`
  &&& {
    &[class*='focused'] {    
      &:after {
        border-bottom-color: ${({ error, theme: { colors } }) =>
          error ? colors.error1 : colors.accent};
      }
    }
    color: ${({ disabled, theme: { colors } }) =>
      disabled ? colors.gray5 : colors.primary};
    font-size: 16px;
    font-weight: 300;
    padding-right: ${({ right }) => right}px;
    &:before {
      border-bottom: ${({ disabled }) =>
        disabled
          ? '1px dotted rgba(0, 0, 0, 0.32)'
          : '1px solid rgba(0, 0, 0, 0.12)'} ;
    }
    &:hover:before {
      border-bottom: solid 2px ${({ error, theme: { colors } }) =>
        error ? colors.error1 : colors.accent} !important;
    }    
  }
}`;
const LabelWrapper = styled(InputLabel)`
  &&& {
    &[class*='focused'] {    
      color: ${({ theme: { colors } }) => colors.gray3};
    }
    color: rgba(0, 0, 0, 0.38);
    font-size: 16px;
  }
}`;

const ErrorText = styled(FormHelperText)`
  &&& {
    color: ${({ theme: { colors } }) => colors.error1};
    font-size: 12px;
    margin-top: 5px;
    line-height: 18px;
    height: 18px;
  }
}`;

const renderInput = () => {
  return <InputWrapper id="integration-downshift-multiple" />;
};

type Props1 = {
  highlightedIndex: number | null,
  index: number | null,
  itemProps: object,
  selectedItem: array,
  suggestion: object
};

const renderSuggestion = (props: Props1) => {
  const {
    highlightedIndex,
    index,
    itemProps,
    selectedItem,
    suggestion
  } = props;
  const isHighlighted = highlightedIndex === index;
  const isSelected = (selectedItem || '').indexOf(suggestion.label) > -1;

  return (
    <MenuItem
      {...itemProps}
      key={suggestion.label + index}
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
};

type ChipProps = {
  index: number,
  value: string
};

const ChipContent = (props: ChipProps) => {
  const { index, value } = props;
  return (
    <ChipContainer>
      <span>{index + 1}</span>
      {value}
    </ChipContainer>
  );
};

const getSuggestions = inputValue => {
  if (inputValue.length < 2) {
    return [];
  }
  return seedJson.filter(suggestion => {
    return suggestion.label.toLowerCase().startsWith(inputValue.toLowerCase());
  });
};

const styles = () => ({
  container: {
    position: 'relative'
  },
  inputRoot: {
    flexWrap: 'wrap',
    color: '#123262'
  }
});

type Props = {
  selectedItems: array,
  inputValue: string,
  classes?: object,
  onChangeInput: () => {},
  onChangeItems: () => {}
};

class SeedInput extends Component<Props> {
  componentDidMount() {}

  handleKeyDown = event => {
    const { inputValue, selectedItems, onChangeItems } = this.props;
    if (
      selectedItems.length &&
      !inputValue.length &&
      keycode(event) === 'backspace'
    ) {
      const newItems = selectedItems.slice(0, selectedItems.length - 1);
      onChangeItems(newItems);
    } else if (keycode(event) === 'space' && inputValue.length > 0) {
      const newInputValue = inputValue.trim();
      const newItems = [...selectedItems, newInputValue];
      onChangeItems(newItems);
    }
  };

  handleInputChange = event => {
    const { onChangeInput, selectedItems } = this.props;
    if (selectedItems.length > 14) {
      return;
    }
    const newValue = event.target.value.trim();
    onChangeInput(newValue);
  };

  handleChange = item => {
    let { selectedItems } = this.props;
    const { onChangeItems } = this.props;
    selectedItems = [...selectedItems, item];
    onChangeItems(selectedItems);
  };

  handleDelete = item => () => {
    const { onChangeItems, selectedItems } = this.props;
    selectedItems.splice(selectedItems.indexOf(item), 1);
    onChangeItems(selectedItems);
  };

  render() {
    const { classes, inputValue, selectedItems } = this.props;
    return (
      <Downshift
        inputValue={inputValue}
        onChange={this.handleChange}
        selectedItem={selectedItems}
        defaultHighlightedIndex={0}
      >
        {({
          getItemProps,
          isOpen,
          inputValue: inputValue2,
          selectedItem: selectedItem2,
          highlightedIndex
        }) => (
          <div className={classes.container}>
            <Container>
              <LabelWrapper>15 Word Secret Key</LabelWrapper>
              {renderInput({
                onChange: this.handleInputChange,
                onKeyDown: this.handleKeyDown,
                startAdornment: selectedItems.map((item, index) => {
                  const itemIndex = seedJson
                    .map(items => {
                      return items.label.toLowerCase();
                    })
                    .indexOf(item);
                  if (itemIndex > -1) {
                    return (
                      <ChipWrapper
                        key={item + index}
                        tabIndex={-1}
                        label={<ChipContent value={item} index={index} />}
                        deleteIcon={<CloseIconWrapper />}
                        onDelete={this.handleDelete(item)}
                      />
                    );
                  }
                  return (
                    <InvalidChipWrapper
                      key={item + index}
                      tabIndex={-1}
                      label={<ChipContent value={item} index={index} />}
                      deleteIcon={<CloseIconWrapper />}
                      onDelete={this.handleDelete(item)}
                    />
                  );
                })
              })}
              {isOpen ? (
                <PaperWrapper square>
                  {getSuggestions(inputValue2).map((suggestion, index) =>
                    renderSuggestion({
                      suggestion,
                      index,
                      itemProps: getItemProps({ item: suggestion.label }),
                      highlightedIndex,
                      selectedItem: selectedItem2
                    })
                  )}
                </PaperWrapper>
              ) : null}
              <ErrorText />
            </Container>
          </div>
        )}
      </Downshift>
    );
  }
}

export default withStyles(styles)(SeedInput);
