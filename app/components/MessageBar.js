// @flow
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Snackbar } from 'material-ui';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import styled from 'styled-components';
import { ms } from './../styles/helpers'
import TezosIcon from './TezosIcon';

import { clearMessageState } from '../reduxContent/message/actions';
import { openLinkToBlockExplorer } from './../utils/general';

const MessageContainer = styled.div`
  padding: 10px 0;
`
const StyledCloseIcon = styled(CloseIcon)`
  cursor: pointer;
  position: absolute;
  width: 20px !important;
  height: 20px !important;
  top: 10px;
  right: 10px;
  fill: #ffffff !important;
`
const CheckIcon = styled(TezosIcon)`
  margin-right: 13px;
`
const BroadIcon = styled(TezosIcon)`
  margin-left: 2px;  
`
const MessageHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 1.1px;
`
const MessageFooter = styled.div`
  display: flex;
  justify-content: center;
  align-items: baseline;
  line-height: 16px;
  padding-bottom: 16px;
`
const LinkContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 7px;
`
const LinkTitle = styled.div`
  font-size: 12px;
  text-decoration: underline;
`
const HashValue = styled.div`
  font-size: 12px;
  margin-left: 5px;
`
const HashTitle = styled.div`
  font-size: 10px;
  font-weight: 500;
`

type Props1 = {
  content: string,
  hash: string,
  openLink: Function,
  onClose: Function
};
const MessageContent = (props: Props1) => {
  const {content, hash, openLink, onClose} = props;
  return(
    <MessageContainer>
      <StyledCloseIcon
        onClick={onClose}
      />
      <MessageHeader>
        {!!hash && 
          <CheckIcon
            iconName='checkmark2'
            size={ms(0)}
            color="white"
          />        
        }
        {content}
      </MessageHeader>
      {/* {!!hash && <LinkButton onClick={openLink}>See it on chain</LinkButton>} */}
      {!!hash && 
        <MessageFooter>
          <HashTitle>OPERATION ID:</HashTitle>
          <HashValue>{hash}</HashValue>
          <LinkContainer onClick={openLink}>
            <LinkTitle>View on a block explorer</LinkTitle>
            <BroadIcon
              iconName='new-window'
              size={ms(0)}
              color="white"
            />          
          </LinkContainer>
        </MessageFooter>
      }
    </MessageContainer>
  )
}

type Props = {
  clearMessageState: Function,
  message: Object
};

class MessageBar extends React.Component<Props> {
  props: Props;

  openLink = (url) => {
    const { clearMessageState } = this.props;
    clearMessageState();
    openLinkToBlockExplorer(url);
  }

  changeHash = (hash: string) => {
    let newHash = '';
    const hashLen = hash.length;
    if (hashLen > 10) {
      newHash = `${hash.slice(0, 4)}...${hash.slice(hashLen - 4, hashLen)}`;
    }
    return newHash;
  }

  render() {
    const { message, clearMessageState } = this.props;
    const messageText = message.get('message') || '';
    const hash = message.get('hash') || '';
    const bodyStyle = message.get('isError')
      ? { backgroundColor: 'rgba(255, 0, 0, 0.9)' }
      : { backgroundColor: 'rgba(37, 156, 144, 0.9)' };
    bodyStyle.height = 'auto';
    bodyStyle.minWidth = '500px';

    return (
      <Snackbar
        open={!!messageText}
        bodyStyle={bodyStyle}
        message={<MessageContent content={messageText} hash={this.changeHash(hash)} openLink={()=>this.openLink(hash)} onClose={clearMessageState} />}
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
