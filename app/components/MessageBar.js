// @flow
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Snackbar } from 'material-ui';

import { clearMessageState } from '../reducers/message.duck';

type Props = {
  clearMessageState: Function,
  message: Object
};

class MessageBar extends React.Component<Props> {
  props: Props;

  render() {
    const { message, clearMessageState } = this.props;
    const messageText = message.get('message') || '';
    const bodyStyle = message.get('isError')
      ? { backgroundColor: 'rgba(255, 0, 0, 0.75)' }
      : { backgroundColor: 'rgba(65, 181, 89, 0.75)' };

    return (
      <Snackbar
        open={!!messageText}
        bodyStyle={bodyStyle}
        message={messageText}
        onRequestClose={() => {}}
        action="close"
        onActionClick={clearMessageState}
      />
    );
  }
}

function mapStateToProps({ message }) {
  return {
    message: message.get('message')
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      clearMessageState
    },
    dispatch
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(MessageBar);
