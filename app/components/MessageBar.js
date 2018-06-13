import React from 'react';
import { Snackbar } from 'material-ui';

export default function MessageBar({ message }) {
  const isOpen = message.has('message');

  const bodyStyle = message.get('isError') ?
    { backgroundColor: 'rgba(255, 0, 0, 0.75)'} :
    {};

  return (
    <Snackbar
      open={isOpen}
      bodyStyle={bodyStyle}
      message={message.get('message', '')}
    />
  );
}
