// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Dialog, TextField } from 'material-ui';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import { ms } from '../../styles/helpers';
import { H4 } from '../Heading/';
import { CONSEIL } from '../../constants/NodesTypes';
import TezosIcon from '../TezosIcon/';

import { addNode, setSelected } from '../../reduxContent/nodes/thunks';
import Button from '../Button/';

type Props = {
  setSelected: Function,
  addNode: Function,
  closeAddNodeModal: Function,
  isModalOpen: boolean,
  type: string
};

const StyledCloseIcon = styled(CloseIcon)`
  cursor: pointer;
  height: 20px;
  width: 20px;
  position: absolute;
  top: 10px;
  right: 15px;
`;

const StyledSaveButton = styled(Button)`
  margin-top: ${ms(4)};
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
const Error = styled.div`
  height: 2rem;
  width: 100%;
  color: ${({ theme: { colors } }) => colors.error1};
  font-size: ${ms(-2)};
`;

const FeedbackIcon = styled(TezosIcon)`
  position: absolute;
  top: 42px;
  right: 40px;
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
  handleNameChange = (_, name) => this.setState({ name });
  handleApiKeyChange = (_, apiKey) => this.setState({ apiKey });
  handleUrlChange = (_, url) => this.setState({ url });
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
    const { name, apiKey, url, error } = this.state;
    const { type, isModalOpen } = this.props;

    const title = type === CONSEIL ? 'Conseil' : 'Tezos';

    return (
      <Dialog
        modal
        open={isModalOpen}
        bodyStyle={{ padding: '50px 80px' }}
        titleStyle={{ padding: '50px 70px 0px' }}
      >
        <StyledCloseIcon
          style={{ fill: '#7190C6' }}
          onClick={this.handleClose}
        />
        <H4>Set Up Your Custom {title} Node</H4>

        <TextField
          floatingLabelText="Node Name"
          style={{ width: '100%' }}
          value={name}
          onChange={this.handleNameChange}
        />

        <TextField
          floatingLabelText="Api Key"
          style={{ width: '100%' }}
          value={apiKey}
          onChange={this.handleApiKeyChange}
        />

        <Container>
          <Content>
            <TextField
              style={{ width: '100%' }}
              floatingLabelText="URL (e.g https://127.0.0.1:19731/)"
              value={url}
              onChange={this.handleUrlChange}
            />
            {error ? (
              <FeedbackIcon iconName="warning" size={ms(0)} color="error1" />
            ) : null}
          </Content>
          {error ? <Error> {error} </Error> : null}
        </Container>

        <StyledSaveButton
          buttonTheme="primary"
          onClick={this.handleAddNode}
          disabled={!name || !url}
        >
          Save
        </StyledSaveButton>
      </Dialog>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ addNode, setSelected }, dispatch);
}

export default connect(null, mapDispatchToProps)(AddNodeModal);
