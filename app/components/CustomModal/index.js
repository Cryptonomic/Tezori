import React from 'react';
import styled from 'styled-components';
import Modal from '@material-ui/core/Modal';
import CloseIcon from '@material-ui/icons/Close';

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
  min-width: 671px;
  max-width: 750px;
`;

const CloseIconWrapper = styled(CloseIcon)`
  &&& {
    fill: #7190C6;
    cursor: pointer;
    height: 20px;
    width: 20px;
    position: absolute;
    top: 23px;
    right: 23px;
  }
`;

const ModalTitle = styled.div`
  padding: 0 76px;
  font-size: 24px;
  letter-spacing: 1px;
  line-height: 34px;
  font-weight: 300;
  color: ${({ theme: { colors } }) => colors.primary};
`;

type Props = {
  title: string,
  open: boolean,
  children?: React.Element,
  onClose: () => {}
};

const CustomModal = (props: Props) => {
  const {
    title,
    open,
    children,
    onClose,
    ...other
  } = props;
  return (
    <ModalWrapper
      open={open}      
    >
      <ModalContainer {...other}>
        <CloseIconWrapper
          onClick={onClose}
        />
        <ModalTitle>{title}</ModalTitle>
        {children}
      </ModalContainer>
    </ModalWrapper>
  );
};

export default CustomModal;
