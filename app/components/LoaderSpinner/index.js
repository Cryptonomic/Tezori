// @flow
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  margin-right: 10px;
  .la-ball-spin-clockwise,
  .la-ball-spin-clockwise > div {
    position: relative;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .la-ball-spin-clockwise {
    display: block;
    font-size: 0;
    color: #fff;
  }
  .la-ball-spin-clockwise.la-dark {
    color: #333;
  }
  .la-ball-spin-clockwise > div {
    display: inline-block;
    float: none;
    background-color: currentColor;
    border: 0 solid currentColor;
  }
  .la-ball-spin-clockwise {
    width: 32px;
    height: 32px;
  }
  .la-ball-spin-clockwise > div {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 8px;
    height: 8px;
    margin-top: -4px;
    margin-left: -4px;
    border-radius: 100%;
    -webkit-animation: ball-spin-clockwise 1s infinite ease-in-out;
    -moz-animation: ball-spin-clockwise 1s infinite ease-in-out;
    -o-animation: ball-spin-clockwise 1s infinite ease-in-out;
    animation: ball-spin-clockwise 1s infinite ease-in-out;
  }
  .la-ball-spin-clockwise > div:nth-child(1) {
    top: 5%;
    left: 50%;
    -webkit-animation-delay: -0.875s;
    -moz-animation-delay: -0.875s;
    -o-animation-delay: -0.875s;
    animation-delay: -0.875s;
  }
  .la-ball-spin-clockwise > div:nth-child(2) {
    top: 18.1801948466%;
    left: 81.8198051534%;
    -webkit-animation-delay: -0.75s;
    -moz-animation-delay: -0.75s;
    -o-animation-delay: -0.75s;
    animation-delay: -0.75s;
  }
  .la-ball-spin-clockwise > div:nth-child(3) {
    top: 50%;
    left: 95%;
    -webkit-animation-delay: -0.625s;
    -moz-animation-delay: -0.625s;
    -o-animation-delay: -0.625s;
    animation-delay: -0.625s;
  }
  .la-ball-spin-clockwise > div:nth-child(4) {
    top: 81.8198051534%;
    left: 81.8198051534%;
    -webkit-animation-delay: -0.5s;
    -moz-animation-delay: -0.5s;
    -o-animation-delay: -0.5s;
    animation-delay: -0.5s;
  }
  .la-ball-spin-clockwise > div:nth-child(5) {
    top: 94.9999999966%;
    left: 50.0000000005%;
    -webkit-animation-delay: -0.375s;
    -moz-animation-delay: -0.375s;
    -o-animation-delay: -0.375s;
    animation-delay: -0.375s;
  }
  .la-ball-spin-clockwise > div:nth-child(6) {
    top: 81.8198046966%;
    left: 18.1801949248%;
    -webkit-animation-delay: -0.25s;
    -moz-animation-delay: -0.25s;
    -o-animation-delay: -0.25s;
    animation-delay: -0.25s;
  }
  .la-ball-spin-clockwise > div:nth-child(7) {
    top: 49.9999750815%;
    left: 5.0000051215%;
    -webkit-animation-delay: -0.125s;
    -moz-animation-delay: -0.125s;
    -o-animation-delay: -0.125s;
    animation-delay: -0.125s;
  }
  .la-ball-spin-clockwise > div:nth-child(8) {
    top: 18.179464974%;
    left: 18.1803700518%;
    -webkit-animation-delay: 0s;
    -moz-animation-delay: 0s;
    -o-animation-delay: 0s;
    animation-delay: 0s;
  }
  /*
   * Animation
   */
  @-webkit-keyframes ball-spin-clockwise {
    0%,
    100% {
      opacity: 1;
      -webkit-transform: scale(1);
      transform: scale(1);
    }
    20% {
      opacity: 1;
    }
    80% {
      opacity: 0;
      -webkit-transform: scale(0);
      transform: scale(0);
    }
  }
  @-moz-keyframes ball-spin-clockwise {
    0%,
    100% {
      opacity: 1;
      -moz-transform: scale(1);
      transform: scale(1);
    }
    20% {
      opacity: 1;
    }
    80% {
      opacity: 0;
      -moz-transform: scale(0);
      transform: scale(0);
    }
  }
  @-o-keyframes ball-spin-clockwise {
    0%,
    100% {
      opacity: 1;
      -o-transform: scale(1);
      transform: scale(1);
    }
    20% {
      opacity: 1;
    }
    80% {
      opacity: 0;
      -o-transform: scale(0);
      transform: scale(0);
    }
  }
  @keyframes ball-spin-clockwise {
    0%,
    100% {
      opacity: 1;
      -webkit-transform: scale(1);
      -moz-transform: scale(1);
      -o-transform: scale(1);
      transform: scale(1);
    }
    20% {
      opacity: 1;
    }
    80% {
      opacity: 0;
      -webkit-transform: scale(0);
      -moz-transform: scale(0);
      -o-transform: scale(0);
      transform: scale(0);
    }
  }

  .la-ball-spin-clockwise.la-sm {
    width: 14px;
    height: 14px;
  }
  .la-ball-spin-clockwise.la-sm > div {
    width: 3px;
    height: 3px;
    margin-top: -2px;
    margin-left: -2px;
  }
  .la-ball-spin-clockwise.la-1x {
    width: 16px;
    height: 16px;
  }
  .la-ball-spin-clockwise.la-1x > div {
    width: 4px;
    height: 4px;
    margin-top: -2px;
    margin-left: -2px;
  }
  .la-ball-spin-clockwise.la-2x {
    width: 64px;
    height: 64px;
  }
  .la-ball-spin-clockwise.la-2x > div {
    width: 16px;
    height: 16px;
    margin-top: -8px;
    margin-left: -8px;
  }
  .la-ball-spin-clockwise.la-3x {
    width: 96px;
    height: 96px;
  }
  .la-ball-spin-clockwise.la-3x > div {
    width: 24px;
    height: 24px;
    margin-top: -12px;
    margin-left: -12px;
  }
  .la-ball-spin-clockwise.la-4x {
    width: 128px;
    height: 128px;
  }
  .la-ball-spin-clockwise.la-4x > div {
    width: 32px;
    height: 32px;
    margin-top: -16px;
    margin-left: -16px;
  }
`;

type Props = {
  bubblesStyle?: object,
  styles?: object,
  size?: string
};

export default function LoaderSpinner(props: Props) {
  const { styles, bubblesStyle, size } = props;

  let spinnerClass = 'la-ball-spin-clockwise ';

  switch (size) {
    case 'sm':
      spinnerClass += 'la-sm';
      break;
    case 'x2':
      spinnerClass += 'la-2x';
      break;
    case 'x3':
      spinnerClass += 'la-3x';
      break;
    case 'x4':
      spinnerClass += 'la-4x';
      break;
    default:
      break;
  }

  return (
    <Container>
      <div style={styles} className={spinnerClass}>
        <div style={bubblesStyle} />
        <div style={bubblesStyle} />
        <div style={bubblesStyle} />
        <div style={bubblesStyle} />
        <div style={bubblesStyle} />
        <div style={bubblesStyle} />
        <div style={bubblesStyle} />
        <div style={bubblesStyle} />
      </div>
    </Container>
  );
}
