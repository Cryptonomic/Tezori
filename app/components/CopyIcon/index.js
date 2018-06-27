import React from 'react'
import { clipboard } from 'electron'
import { withTheme } from 'styled-components'
import TezosIcon from '../TezosIcon'
import ContentCopy from 'material-ui/svg-icons/content/content-copy';
import { ms } from '../../styles/helpers'

const handleCopyClick = text => {
  clipboard.writeText(text)
}

const CopyIcon = props => {
  const { text, color, theme: { colors }, className } = props
  return (
    <ContentCopy
      onClick={() => handleCopyClick(text)}
      style={{
        width: ms(1),
        height: ms(1),
        color: colors[color],
        cursor: 'pointer',
        marginLeft: ms(0),
      }}
      className={className}
    />
  )
}

CopyIcon.defaultProps = {
  color: 'white'
}

export default withTheme(CopyIcon)
