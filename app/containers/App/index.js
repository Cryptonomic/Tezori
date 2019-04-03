// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Node } from 'react';
import { remote } from 'electron';
import styled from 'styled-components';
import { ms } from '../../styles/helpers';
import MessageBar from '../../components/MessageBar/';
import { getVersionFromApi } from '../../utils/general';
import { versionCheck } from '../../config.json';

type Props = {
  children: Node,
  message: object
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 0 0 ${ms(3)} 0;
`;

class App extends Component<Props> {
  props: Props;

  componentDidMount = async () => {
    const result = await getVersionFromApi();
    const newVersion = parseInt(result['version-check'], 10);
    if (newVersion > parseInt(versionCheck, 10)) {
      const options = {
        message: 'New Version'
      };
      remote.dialog.showMessageBox(
        null,
        options,
        (response, checkboxChecked) => {
          console.log(response);
          console.log(checkboxChecked);
        }
      );
    }
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

export default connect(
  mapStateToProps,
  null
)(App);
