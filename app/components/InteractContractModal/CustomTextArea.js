import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import themes from '../../styles/theme';

const styles = {
  cssContainer: {
    width: '100%'
  },
  cssLabel: {
    color: themes.colors.gray15,
    zIndex: 10,
    fontSize: '16px',
    pointerEvents: 'none',
    '&$cssFocused': {
      color: themes.colors.gray3
    }
  },
  cssFormControl: {
    transform: 'translate(22px, 34px) scale(1)'
  },
  cssShrink: {
    transform: 'translate(0, 1.5px) scale(0.75)'
  },
  cssFocused: {},
  cssInput: {
    backgroundColor: themes.colors.gray14,
    border: `1px solid ${themes.colors.gray14}`,
    fontSize: '14px',
    color: themes.colors.blue5,
    padding: '10px 22px 5px 22px'
  },
  cssText: {
    color: themes.colors.error1,
    fontSize: '12px',
    marginTop: '5px',
    lineHeight: '18px',
    height: '18px'
  }
};

type Props = {
  label: string,
  errorText?: string | React.Node,
  onChange?: () => {},
  classes: object
};

const CustomTextArea = (props: Props) => {
  const { label, onChange, errorText, classes, ...other } = props;
  return (
    <FormControl className={classes.cssContainer}>
      <InputLabel
        classes={{
          formControl: classes.cssFormControl,
          shrink: classes.cssShrink
        }}
        FormLabelClasses={{
          root: classes.cssLabel,
          focused: classes.cssFocused
        }}
        htmlFor="micheline-input"
      >
        {label}
      </InputLabel>
      <Input
        classes={{
          root: classes.cssInput
        }}
        id="micheline-input"
        key={label}
        onChange={event => onChange(event.target.value)}
        multiline
        {...other}
      />
      <FormHelperText component="div" className={classes.cssText}>
        {errorText}
      </FormHelperText>
    </FormControl>
  );
};
CustomTextArea.defaultProps = {
  errorText: ''
};

export default withStyles(styles)(CustomTextArea);
