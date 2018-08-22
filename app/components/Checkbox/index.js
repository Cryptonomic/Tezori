import React from 'react';
import MaterialCheckbox from '@material-ui/core/Checkbox';
import { withTheme } from 'styled-components';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Circle from '@material-ui/icons/PanoramaFishEye';
import theme from '../../styles/theme';

type Props = {
  isChecked: boolean,
  onCheck: () => {}
};

const styles = {
  width: 'auto'
};

const iconStyles = {
  fill: theme.colors.accent,
  width: 30,
  height: 30
};

const Checkbox = (props: Props) => {
  const { isChecked, onCheck } = props;
  return (
    <MaterialCheckbox
      checked={isChecked}
      onChange={onCheck}
      style={styles}
      checkedIcon={<CheckCircle style={iconStyles} />}
      icon={<Circle style={iconStyles} />}
    />
  );
};

export default withTheme(Checkbox);
