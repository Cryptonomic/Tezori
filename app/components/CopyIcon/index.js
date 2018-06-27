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
  const { text, color, theme: { colors } } = props
  return (
    <ContentCopy
      onClick={() => handleCopyClick(text)}
      style={{
        width: ms(2),
        height: ms(2),
        color: colors[color],
        cursor: 'pointer',
        marginLeft: ms(0)
      }}
    />
  )
}

export default withTheme(CopyIcon)
