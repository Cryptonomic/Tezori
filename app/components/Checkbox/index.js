import React from 'react'
import { Checkbox as MaterialCheckbox } from 'material-ui'
import { withTheme } from 'styled-components'
import CheckCircle from 'material-ui/svg-icons/action/check-circle'
import Circle from 'material-ui/svg-icons/image/panorama-fish-eye'
import { ms } from '../../styles/helpers'
import theme from '../../styles/theme'

type Props = {
  isChecked: boolean,
  onCheck: Function,
}

const styles = {
  width: 'auto'
}

const iconStyles = {
  fill: theme.colors.accent,
  width: 30,
  height: 30
}

const Checkbox = (props:Props) => {
  const { isChecked, onCheck } = props
  return (
    <MaterialCheckbox
      checked={isChecked}
      onCheck={onCheck}
      checkedIcon={<CheckCircle />}
      uncheckedIcon={<Circle />}
      style={styles}
      iconStyle={iconStyles}
    />
  )
}

export default withTheme(Checkbox)
