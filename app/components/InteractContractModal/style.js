import styled from 'styled-components';
import CloseIcon from '@material-ui/icons/Close';
import Modal from '@material-ui/core/Modal';
import MenuItem from '@material-ui/core/MenuItem';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
// import { ms } from '../../styles/helpers';
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

// export const Tab = styled(Button)`
//   background: ${({ isActive, theme: { colors } }) =>
//     isActive ? colors.white : colors.accent};
//   color: ${({ isActive, theme: { colors } }) =>
//     isActive ? colors.primary : colors.white};
//   text-align: center;
//   font-weight: 500;
//   padding: ${ms(-1)} ${ms(1)};
//   border-radius: 0;
//   flex: 1;
// `;

// export const TabList = styled.div`
//   background-color: ${({ theme: { colors } }) => colors.accent};
//   display: flex;
// `;

export const TabContainer = styled.div`
  width: 100%;
  padding: 50px 40px 30px 30px;
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
export const ColContainer = styled.div`
  width: 45%;
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
`;

export const InvokeButton = styled(Button)`
  width: 194px;
  height: 50px;
  margin-bottom: 10px;
  margin-left: auto;
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

export const StyledTabs = styled(Tabs)``;

export const StyledTab = styled(Tab)``;

export const MainContainer = styled.div``;
