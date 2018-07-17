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
  size: any,
  onClick?: Function
};

const getIconByName = iconName => {
  const toUnicode = unicode => String.fromCharCode(parseInt(unicode, 16));

  switch (iconName) {

    case 'icon-new-window': {
      return toUnicode('e916');
    }
    case 'icon-star': {
      return toUnicode('e910');
    }
    case 'icon-broadcast': {
      return toUnicode('e911');
    }
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

    case 'checkmark2': {
      return toUnicode('e90e');
    }

    case 'send': {
      return toUnicode('e90f');
    }

    case 'star': {
      return toUnicode('e910');
    }

    case 'broadcast': {
      return toUnicode('e911');
    }

    case 'view-show': {
      return toUnicode('e912');
    }

    case 'view-hide': {
      return toUnicode('e913');
    }

    case 'change' : {
      return toUnicode('e914');
    }

    case 'receive': {
      return toUnicode('e915');
    }

    case 'new-window' : {
      return toUnicode('e916');
    }
    
    case 'info' : {
      return toUnicode('e917');
    }

    default: {
      console.error(`${iconName} No such icon in Tezos icons font`);
    }
  }
};

const TezosIcon = (props: Prosp) => {
  const { iconName, size, color, className, onClick } = props;
  return (
    <Icon className={className} size={size} color={color} onClick={onClick}>
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
