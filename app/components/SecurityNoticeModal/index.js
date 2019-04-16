// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import Modal from '@material-ui/core/Modal';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core/styles';
import Button from '../Button';
import TezosIcon from '../TezosIcon';
import noticeImg from '../../../resources/imgs/security-notice.svg';
import { wrapComponent } from '../../utils/i18n';
import themes from '../../styles/theme';
import { ms } from '../../styles/helpers';
import { openLink } from '../../utils/general';

const url =
  'https://github.com/Cryptonomic/Deployments/wiki/Galleon:-FAQ#smart-contracts';

const ModalWrapper = styled(Modal)`
  &&& {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const ModalContainer = styled.div`
  background-color: ${({ theme: { colors } }) => colors.white};
  outline: none;
  position: relative;
  padding-top: 53px;
  min-width: 672px;
  width: 672px;
`;

const MainContainer = styled.div`
  padding: 0 100px 25px 100px;
`;

const BottomContainer = styled.div`
  display: flex;
  justify-content: space-between;
  height: 102px;
  padding: 28px 127px;
  background-color: ${({ theme: { colors } }) => colors.gray1};
`;

const NoticeSvg = styled.img`
  width: 100%;
  height: 193px;
  flex: none;
`;

const NoticeTitle = styled.div`
  font-size: 24px;
  color: ${({ theme: { colors } }) => colors.blue6};
  margin-top: 10px;
  text-align: center;
`;

const NoticeContent = styled.div`
  color: ${({ theme: { colors } }) => colors.blue6};
  font-size: 18px;
  line-height: 26px;
  font-weight: 300;
`;

const CustomButton = styled(Button)`
  width: 194px;
  height: 50px;
  padding: 0;
`;

const LinkContainer = styled.div`
  color: ${({ theme: { colors } }) => colors.accent};
  font-weight: 300;
  cursor: pointer;
  font-size: 18px;
  display: inline-block;
`;

const LinkIcon = styled(TezosIcon)`
  position: relative;
  top: 1px;
  margin-left: 2px;
`;

const FormGroupWrapper = styled(FormGroup)`
  margin-top: 60px;
`;

const styles = {
  rootControlLabel: {
    marginRight: 0,
    marginLeft: -6
  },
  controlLabel: {
    fontWeight: 300,
    fontSize: '16px',
    color: themes.colors.blue6,
    marginLeft: 5
  },
  rootCheck: {
    color: themes.colors.blue6,
    width: 30,
    height: 30,
    '&$checked': {
      color: themes.colors.accent
    }
  },
  checked: {}
};

type Props = {
  open: boolean,
  onClose: () => {},
  onProceed: () => {},
  t: () => {},
  classes: object
};

class SecurityNoticeModal extends Component<Props> {
  state = {
    isUnderstand: false,
    isNotShowMessage: false
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  onProceed = () => {
    const { isNotShowMessage } = this.state;
    const { onProceed } = this.props;
    if (isNotShowMessage) {
      localStorage.setItem('isNotShowMessage', isNotShowMessage);
    }
    this.setState({ isUnderstand: false, isNotShowMessage: false });
    onProceed();
  };

  onClose = () => {
    const { onClose } = this.props;
    this.setState({ isUnderstand: false, isNotShowMessage: false });
    onClose();
  };

  render() {
    const { open, t, classes } = this.props;
    const { isUnderstand, isNotShowMessage } = this.state;
    return (
      <ModalWrapper open={open} onClose={this.onClose}>
        <ModalContainer>
          <MainContainer>
            <NoticeSvg src={noticeImg} />
            <NoticeTitle>
              {t('components.securityNoticeModal.security_notice')}
            </NoticeTitle>
            <NoticeContent>
              {t('components.securityNoticeModal.notice_content')}
            </NoticeContent>
            <LinkContainer onClick={() => openLink(url)}>
              {t('components.securityNoticeModal.learn_more')}
              <LinkIcon iconName="new-window" size={ms(0)} color="accent" />
            </LinkContainer>
            <FormGroupWrapper>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isUnderstand}
                    onChange={this.handleChange('isUnderstand')}
                    value="understand"
                    classes={{
                      root: classes.rootCheck,
                      checked: classes.checked
                    }}
                  />
                }
                classes={{
                  root: classes.rootControlLabel,
                  label: classes.controlLabel
                }}
                label={t('components.securityNoticeModal.understand_check')}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isNotShowMessage}
                    onChange={this.handleChange('isNotShowMessage')}
                    value="showmessage"
                    classes={{
                      root: classes.rootCheck,
                      checked: classes.checked
                    }}
                  />
                }
                classes={{
                  root: classes.rootControlLabel,
                  label: classes.controlLabel
                }}
                label={t('components.securityNoticeModal.dont_message')}
              />
            </FormGroupWrapper>
          </MainContainer>
          <BottomContainer>
            <CustomButton buttonTheme="secondary" onClick={this.onClose}>
              {t('general.verbs.cancel')}
            </CustomButton>
            <CustomButton
              buttonTheme="primary"
              disabled={!isUnderstand}
              onClick={this.onProceed}
            >
              {t('general.verbs.proceed')}
            </CustomButton>
          </BottomContainer>
        </ModalContainer>
      </ModalWrapper>
    );
  }
}

export default wrapComponent(withStyles(styles)(SecurityNoticeModal));
