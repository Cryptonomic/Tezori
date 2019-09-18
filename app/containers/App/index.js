// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { Node } from 'react';
import styled from 'styled-components';
import MessageBar from '../../components/MessageBar/';
import { getVersionFromApi } from '../../utils/general';
import { LocalVersionIndex } from '../../config.json';
import { updateNewVersion } from '../../reduxContent/message/thunks';

type Props = {
  children: Node,
  message: object
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 0;
`;

class App extends Component<Props> {
  props: Props;

  componentDidMount = async () => {
    const { updateNewVersion } = this.props;
    const result = await getVersionFromApi();
    const RemoteVersionIndex = parseInt(result.currentVersionIndex, 10);
    let newVersion = '';
    if (RemoteVersionIndex > parseInt(LocalVersionIndex, 10)) {
      newVersion = result.currentVersionIndex;
    }
    updateNewVersion(newVersion);
  };

  render() {
    const { message } = this.props;
    return (
      <Container>
        {this.props.children}
        <MessageBar message={message} />
      </Container>
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
      updateNewVersion
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
