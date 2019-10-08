import styled from 'styled-components';
import CloseIcon from '@material-ui/icons/Close';
import Modal from '@material-ui/core/Modal';
import MenuItem from '@material-ui/core/MenuItem';
import TezosIcon from '../TezosIcon/';
import Button from '../Button';

export const ModalWrapper = styled(Modal)`
  &&& {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const ModalContainer = styled.div`
  background-color: ${({ theme: { colors } }) => colors.white};
  outline: none;
  position: relative;
  min-width: 671px;
  max-width: 750px;
  width: 672px;
`;

export const CloseIconWrapper = styled(CloseIcon)`
  &&& {
    fill: ${({ theme: { colors } }) => colors.white};
    cursor: pointer;
    height: 20px;
    width: 20px;
    position: absolute;
    top: 23px;
    right: 23px;
  }
`;

export const ModalTitle = styled.div`
  padding: 27px 36px;
  font-size: 24px;
  letter-spacing: 1px;
  line-height: 34px;
  font-weight: 300;
  color: ${({ theme: { colors } }) => colors.white};
  width: 100%;
  background-color: ${({ theme: { colors } }) => colors.accent};
`;

export const TabContainer = styled.div`
  width: 100%;
  padding: 30px 40px;
`;

export const InputAddressContainer = styled.div`
  position: relative;
  width: 100%;
`;

export const InvokeAddressContainer = styled.div`
  width: 100%;
  display: flex;
  height: 64px;
`;

export const ParametersContainer = styled.div`
  width: 100%;
  height: 64px;
`;

export const ItemWrapper = styled(MenuItem)`
  &&& {
    &[class*='selected'] {
      color: ${({ theme: { colors } }) => colors.primary};
    }
    width: 100%;
    font-size: 16px;
    font-weight: 300;
  }
`;

export const ChainItemWrapper = styled(MenuItem)`
  &&& {
    &[class*='selected'] {
      color: ${({ theme: { colors } }) => colors.accent};
    }
    color: ${({ theme: { colors } }) => colors.primary};
    width: 100%;
    font-size: 14px;
    font-weight: 400;
    box-sizing: border-box;
    height: 54px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

export const SpaceBar = styled.div`
  height: 16px;
  width: 2px;
  margin: 0 4px 0 7px;
  background-color: ${({ theme: { colors } }) => colors.primary};
`;

export const RowContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const StorageFormatContainer = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  height: 64px;
`;

export const ColContainer = styled.div`
  width: 45%;
`;

export const ColStorage = styled.div`
  flex: 1;
`;

export const ColFormat = styled.div`
  min-width: 19%;
  margin-left: 80px;
`;

export const AmountContainer = styled.div`
  width: 45%;
  position: relative;
`;

export const FeeContainer = styled.div`
  width: 45%;
  display: flex;
  height: 64px;
`;

export const UseMax = styled.div`
  position: absolute;
  right: 23px;
  top: 24px;
  font-size: 12px;
  font-weight: 500;
  display: block;
  color: ${({ theme: { colors } }) => colors.accent};
  cursor: pointer;
`;

export const ViewScan = styled.div`
  position: absolute;
  right: 22px;
  top: 41px;
  font-size: 10px;
  font-weight: 500;
  display: block;
  color: ${({ theme: { colors } }) => colors.accent};
  cursor: pointer;
`;

export const LinkIcon = styled(TezosIcon)`
  position: absolute;
  right: 0;
  top: 41px;
  cursor: pointer;
`;

export const PasswordButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0 40px 15px 40px;
  background-color: ${({ theme: { colors } }) => colors.gray1};
  height: 100px;
  margin-top: auto;
`;

export const InvokeButton = styled(Button)`
  width: 194px;
  height: 50px;
  margin-bottom: 10px;
  margin-left: auto;
  padding: 0;
`;

export const DeployAddressContainer = styled.div`
  width: 100%;
  height: 64px;
`;

export const DeployAddressLabel = styled.div`
  font-size: 12px;
  color: rgba(0, 0, 0, 0.38);
`;
export const DeployAddressContent = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
`;

export const MainContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const SelectRenderWrapper = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const SelectChainRenderWrapper = styled.div`
  color: ${({ theme: { colors } }) => colors.primary};
  font-size: 16px;
  font-weight: 500;
  text-transform: capitalize;
`;

export const SelectChainItemWrapper = styled.div`
  margin-left: auto;
  text-transform: capitalize;
`;
