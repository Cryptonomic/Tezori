import React from 'react';

import styles from './CreateButton.css';

export default function CreateButton({ label, style, onClick }) {
  return (
    <button
      className={styles.createButton}
      style={style}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
