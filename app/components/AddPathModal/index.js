// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import Modal from '../CustomModal';
import TextField from '../TextField';
import { ms } from '../../styles/helpers';
import TezosIcon from '../TezosIcon/';

import { addPath, setPath } from '../../reduxContent/settings/thunks';
import Button from '../Button/';
import { wrapComponent } from '../../utils/i18n';

type Props = {
  setPath: () => {},
  addPath: () => {},
  closeAddPathModal: () => {},
  isPathModalOpen: boolean,
  t: () => {}
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
  label: '',
  derivation: '',
  error: ''
};

class AddPathModal extends Component<Props> {
  props: Props;
  state = defaultState;

  handleClose = () => {
    const { closeAddPathModal } = this.props;
    this.setState(defaultState);
    closeAddPathModal();
  };
  handleLabelChange = label => this.setState({ label });
  handlePathChange = derivation => this.setState({ derivation });
  /*
    TO-DO: isValidPath
    isValidUrl = () => {
      const { url } = this.state;
      return url.toLowerCase().indexOf('https://') === 0;
    };
  */
  handleAddPath = () => {
    const { label, derivation } = this.state;
    const { closeAddPathModal, addPath, setPath } = this.props;
    /*
    TO-DO: isValidPath
    if (this.isValidUrl()) {
      addNode({ name, apiKey, url, type });
      setSelected(name, type);
      closeAddNodeModal();
      this.setState(defaultState);
    } else {
      this.setState({ error: t('components.addNodeModal.error') });
    }

  */
    addPath({ label, derivation });
    setPath(label);
    closeAddPathModal();
    this.setState(defaultState);
  };
  render() {
    const { label, derivation, error } = this.state;
    const { isPathModalOpen, t } = this.props;

    const title = t('general.nouns.derivation_path');
    const title1 = t('components.addPathModal.title', { title });

    return (
      <Modal title={title1} open={isPathModalOpen} onClose={this.handleClose}>
        <MainContainer>
          <TextField
            label={t('components.addPathModal.path_label')}
            onChange={this.handleLabelChange}
          />

          <Container>
            <Content>
              <TextField
                label="Derivation Path (e.g 44'/1729'/0'/0'/1')"
                onChange={this.handlePathChange}
                errorText={error}
              />
              {error && (
                <FeedbackIcon iconName="warning" size={ms(0)} color="error1" />
              )}
            </Content>
          </Container>

          <StyledSaveButton
            buttonTheme="primary"
            onClick={this.handleAddPath}
            disabled={!label || !derivation}
          >
            {t('general.verbs.save')}
          </StyledSaveButton>
        </MainContainer>
      </Modal>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ addPath, setPath }, dispatch);
}

export default compose(
  wrapComponent,
  connect(
    null,
    mapDispatchToProps
  )
)(AddPathModal);
