import React from 'react';
import classNames from 'classnames';

import styles from './CreateButton.css';

export default function CreateButton({
  label,
  style = {},
  onClick = () => {},
  disabled = false,
}) {
  const buttonClasses = classNames({
    [styles.createButton]: true,
    [styles.disabledButton]: disabled,
  });

  return (
    <button
      className={buttonClasses}
      style={style}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
