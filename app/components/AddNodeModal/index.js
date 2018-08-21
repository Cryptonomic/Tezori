// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Modal from '../CustomModal';
import TextField from '../TextField';
import { ms } from '../../styles/helpers';
import { CONSEIL } from '../../constants/NodesTypes';
import TezosIcon from '../TezosIcon/';

import { addNode, setSelected } from '../../reduxContent/nodes/thunks';
import Button from '../Button/';

type Props = {
  setSelected: () => {},
  addNode: () => {},
  closeAddNodeModal: () => {},
  isModalOpen: boolean,
  type: string
};

const StyledSaveButton = styled(Button)`
  padding-right: ${ms(9)};
  padding-left: ${ms(9)};
`;

const Container = styled.div`
  min-height: 93px;
`;
const Content = styled.div`
  width: 100%;
  position: relative;
  .input-text-field {
    width: 100% !important;
  }
`;

const FeedbackIcon = styled(TezosIcon)`
  position: absolute;
  top: 30px;
  right: 10px;
`;

const MainContainer = styled.div`
  padding: 30px 76px 56px 76px;
`;

const defaultState = {
  name: '',
  apiKey: '',
  url: '',
  error: ''
};

class AddNodeModal extends Component<Props> {
  props: Props;
  state = defaultState;

  handleClose = () => {
    const { closeAddNodeModal } = this.props;
    this.setState(defaultState);
    closeAddNodeModal();
  };
  handleNameChange = (name) => this.setState({ name });
  handleApiKeyChange = (apiKey) => this.setState({ apiKey });
  handleUrlChange = (url) => this.setState({ url });
  isValidUrl = () => {
    const { url } = this.state;
    return url.toLowerCase().indexOf('https://') === 0;
  };
  handleAddNode = () => {
    const { name, apiKey, url } = this.state;
    const { type, closeAddNodeModal, addNode, setSelected } = this.props;
    if (this.isValidUrl()) {
      addNode({ name, apiKey, url, type });
      setSelected(name, type);
      closeAddNodeModal();
      this.setState(defaultState);
    } else {
      this.setState({ error: "Node's protocol must be https" });
    }
  };
  render() {
    const { name, url, error } = this.state;
    const { type, isModalOpen } = this.props;

    const title = type === CONSEIL ? 'Conseil' : 'Tezos';
    const title1 = `Set Up Your Custom ${title} Node`;

    return (
      <Modal
        title={title1}
        open={isModalOpen}
        onClose={this.handleClose}
      >
        <MainContainer>
          <TextField
            label="Node Name"
            onChange={this.handleNameChange}
          />

          <TextField
            label="Api Key"
            onChange={this.handleApiKeyChange}
          />

          <Container>
            <Content>
              <TextField
                label="URL (e.g https://127.0.0.1:19731/)"
                onChange={this.handleUrlChange}
                errorText={error}
              />
              {error ? (
                <FeedbackIcon iconName="warning" size={ms(0)} color="error1" />
              ) : null}
            </Content>
          </Container>

          <StyledSaveButton
            buttonTheme="primary"
            onClick={this.handleAddNode}
            disabled={!name || !url}
          >
            Save
          </StyledSaveButton>
        </MainContainer>
      </Modal>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ addNode, setSelected }, dispatch);
}

export default connect(null, mapDispatchToProps)(AddNodeModal);
