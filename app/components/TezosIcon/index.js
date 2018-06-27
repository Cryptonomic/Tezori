import React from 'react';
import styled from 'styled-components';
import { ms } from '../../styles/helpers';

const Icon = styled.span`
  font-family: 'Tezos-icons' !important;
  font-size: ${({ size }) => size};
  color: ${({ color, theme: { colors } }) => colors[color]};
  speak: none;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

type Props = {
  iconName: string,
  color: string,
  size: any
};

const getIconByName = iconName => {
  const toUnicode = unicode => String.fromCharCode(parseInt(unicode, 16));

  switch (iconName) {
    case 'arrow-left': {
      return toUnicode('e900');
    }
    case 'arrow-right': {
      return toUnicode('e902');
    }

    case 'checkmark': {
      return toUnicode('e903');
    }

    case 'checkmark-outline': {
      return toUnicode('e904');
    }

    case 'help': {
      return toUnicode('e905');
    }

    case 'manager': {
      return toUnicode('e906');
    }

    case 'smart-address': {
      return toUnicode('e907');
    }

    case 'tezos': {
      return toUnicode('e908');
    }

    case 'warning': {
      return toUnicode('e909');
    }

    default: {
      console.error(`${iconName} No such icon in Tezos icons font`);
    }
  }
};

const TezosIcon = (props: Prosp) => {
  const { iconName, size, color, className } = props;
  return (
    <Icon className={className} size={size} color={color}>
      {getIconByName(iconName)}
    </Icon>
  );
};

TezosIcon.defaultProps = {
  size: ms(0),
  color: 'primary',
  iconName: 'tezos'
};

export default TezosIcon;
