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

const renderInput = inputProps => {
  const { InputProps, classes, ref, error, ...other } = inputProps;

  return (
    <TextField
      helperText
      InputProps={{
        inputRef: ref,
        classes: {
          root: classes.inputRoot,
          focused: classes.inputFocus,
          error: classes.inputError
        },
        ...InputProps
      }}
      {...other}
    />
  );
};

const styles = () => ({
  container: {
    position: 'relative'
  },
  hiddenPlaceholder: {
    '&::placeholder': {
      color: 'transparent'
    }
  },
  inputPlaceholder: {
    '&::placeholder': {
      color: '#000000',
      opacity: '0.38',
      fontSize: '16px',
      fontWeight: 500
    },
    '&:focus::placeholder': {
      color: 'transparent'
    }
  },
  inputRoot: {
    color: `${({ disabled, theme: { colors } }) =>
      disabled ? colors.gray5 : colors.primary}`,
    fontSize: '16px',
    fontWeight: 300,
    flexWrap: 'wrap',
    paddingRight: `${({ right }) => right}px`,
    '&:before': {
      borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
    },
    '&&&&:hover:before': {
      borderBottom: 'solid 2px #2c7df7'
    }
  },
  inputFocus: {
    '&&&&:after': {
      borderBottom: 'solid 2px #2c7df7'
    }
  },
  inputError: {
    '&&&&:after': { borderBottom: `solid 2px red` }
  }
});

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

type Props = {
  selectedItems: array,
  inputValue: string,
  classes?: object,
  onChangeInput: () => {},
  onChangeItems: () => {},
  error: boolean,
  errorText: string,
  placeholder: string
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
    }
  };

  handleInputChange = event => {
    const { onChangeInput, selectedItems } = this.props;
    if (selectedItems.length > 23) {
      return;
    }
    const newValue = event.target.value;
    onChangeInput(newValue);
  };

  handleChange = item => {
    let { selectedItems } = this.props;
    const { onChangeItems } = this.props;
    item.trim();
    selectedItems = [...selectedItems, item];
    onChangeItems(selectedItems);
  };

  handleDelete = (item, index) => () => {
    const { onChangeItems, selectedItems } = this.props;
    selectedItems.splice(index, 1);
    onChangeItems(selectedItems);
  };

  render() {
    const {
      classes,
      inputValue,
      selectedItems,
      error,
      errorText,
      placeholder
    } = this.props;
    return (
      <Downshift
        placeholder
        defaultHighlightedIndex={0}
        error={error}
        inputValue={inputValue}
        onChange={this.handleChange}
        selectedItem={selectedItems}
      >
        {({
          getInputProps,
          getItemProps,
          isOpen,
          inputValue: inputValue2,
          selectedItem: selectedItem2,
          highlightedIndex
        }) => (
          <div className={classes.container}>
            {renderInput({
              fullWidth: true,
              classes,
              helperText: errorText,
              FormHelperTextProps: getInputProps({
                error
              }),
              inputProps: getInputProps({
                placeholder,
                onKeyDown: this.handleKeyDown,
                onChange: this.handleInputChange,
                value: inputValue,
                className:
                  selectedItems.length === 0
                    ? classes.inputPlaceholder
                    : classes.hiddenPlaceholder
              }),
              InputProps: getInputProps({
                error,
                startAdornment:
                  selectedItems.length > 0 && Array.isArray(selectedItems)
                    ? selectedItems.map((item, index) => {
                        const itemIndex = seedJson
                          .map(items => {
                            return items.label.toLowerCase();
                          })
                          .indexOf(item);
                        if (itemIndex > -1 && index <= 23) {
                          return (
                            <ChipWrapper
                              key={item + index}
                              tabIndex={-1}
                              label={<ChipContent value={item} index={index} />}
                              deleteIcon={<CloseIconWrapper />}
                              onDelete={this.handleDelete(item, index)}
                            />
                          );
                        }
                        return (
                          <InvalidChipWrapper
                            key={item + index}
                            tabIndex={-1}
                            label={<ChipContent value={item} index={index} />}
                            deleteIcon={<CloseIconWrapper />}
                            onDelete={this.handleDelete(item, index)}
                          />
                        );
                      })
                    : undefined,
                id: 'integration-downshift-multiple'
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
          </div>
        )}
      </Downshift>
    );
  }
}

export default withStyles(styles)(SeedInput);
