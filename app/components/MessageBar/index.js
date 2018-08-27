// @flow
import React from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import styled from 'styled-components';
import { ms } from '../../styles/helpers';
import TezosIcon from '../TezosIcon/';
import { wrapComponent } from '../../utils/i18n';

import { clearMessageState } from '../../reduxContent/message/actions';
import { openLinkToBlockExplorer } from '../../utils/general';

const MessageContainer = styled.div`
  padding: 25px 20px 30px 20px;
  background-color: ${({ isError }) => isError? 'rgba(255, 0, 0, 0.9)':'rgba(37, 156, 144, 0.9)' };
  width: 100%;
  color: ${({ theme: { colors } }) => colors.white};
`;
const StyledCloseIcon = styled(CloseIcon)`
  cursor: pointer;
  position: absolute;
  width: 20px !important;
  height: 20px !important;
  top: 10px;
  right: 10px;
  fill: #ffffff !important;
`;
const CheckIcon = styled(TezosIcon)`
  margin-right: 13px;
`;
const BroadIcon = styled(TezosIcon)`
  margin-left: 2px;
`;
const MessageHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 1.1px;
`;
const MessageFooter = styled.div`
  display: flex;
  justify-content: center;
  align-items: baseline;
  line-height: 16px;
  padding-top: 16px;
`;
const LinkContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 7px;
  cursor: pointer;
`;
const LinkTitle = styled.div`
  font-size: 12px;
  text-decoration: underline;
`;
const HashValue = styled.div`
  font-size: 12px;
  margin-left: 5px;
`;
const HashTitle = styled.div`
  font-size: 10px;
  font-weight: 500;
`;

const SnackbarWrapper = styled(Snackbar)`
  &&& {
    height: auto;
    min-width: 500px;
  }
`;

type Props1 = {
  content: string,
  hash: string,
  isError: boolean,
  localeParam?: number | string | null,
  openLink: () => {},
  onClose: () => {},
  t: () => {}
};
const MessageContent = (props: Props1) => {
  const { content, hash, openLink, onClose, isError, localeParam, t } = props;
  return (
    <MessageContainer isError={isError}>
      <StyledCloseIcon onClick={onClose} />
      <MessageHeader>
        {!!hash && (
          <CheckIcon iconName="checkmark2" size={ms(0)} color="white" />
        )}
        {t(content, {localeParam})}
      </MessageHeader>
      {/* {!!hash && <LinkButton onClick={openLink}>See it on chain</LinkButton>} */}
      {!!hash && (
        <MessageFooter>
          <HashTitle>{t('components.messageBar.operation_id')}:</HashTitle>
          <HashValue>{hash}</HashValue>
          <LinkContainer onClick={openLink}>
            <LinkTitle>{t('components.messageBar.view_block_explorer')}</LinkTitle>
            <BroadIcon iconName="new-window" size={ms(0)} color="white" />
          </LinkContainer>
        </MessageFooter>
      )}
    </MessageContainer>
  );
};

type Props = {
  clearMessageState: () => {},
  message: object,
  t: () => {}
};

class MessageBar extends React.Component<Props> {
  props: Props;
  openLink = url => {
    const { clearMessageState } = this.props;
    clearMessageState();
    openLinkToBlockExplorer(url);
  };

  changeHash = (hash: string) => {
    let newHash = '';
    const hashLen = hash.length;
    if (hashLen > 10) {
      newHash = `${hash.slice(0, 4)}...${hash.slice(hashLen - 4, hashLen)}`;
    }
    return newHash;
  };


  render() {
    const { message, clearMessageState, t } = this.props;
    const messageText = message.get('message') || '';
    const hash = message.get('hash') || '';
    const isError = message.get('isError') || false;
    const localeParam = message.get('localeParam');

    return (
      <SnackbarWrapper
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={!!messageText}
        onClose={clearMessageState}
        message={
          <MessageContent
            content={messageText}
            hash={this.changeHash(hash)}
            openLink={() => this.openLink(hash)}
            onClose={clearMessageState}
            isError={isError}
            localeParam={localeParam}
            t={t}
          />
        }
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

export default compose(wrapComponent, connect(mapStateToProps, mapDispatchToProps))(MessageBar);
