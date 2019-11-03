import styled from 'styled-components';
import TezosIcon from '../TezosIcon';
import Button from '../Button';

import { ms } from '../../styles/helpers';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: 0 20px 20px 20px;
  position: relative;
`;

export const RowContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const AmountContainer = styled.div`
  width: 100%;
  position: relative;
`;

export const FeeContainer = styled.div`
  width: 100%;
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

export const PasswordButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0 40px 15px 0px;
  height: 100px;
  margin-top: auto;
  width: 100%;
`;

export const InvokeButton = styled(Button)`
  width: 194px;
  height: 50px;
  margin-bottom: 10px;
  margin-left: auto;
  padding: 0;
`;

export const ErrorContainer = styled.div`
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme: { colors } }) => colors.error1};
`;

export const WarningIcon = styled(TezosIcon)`
  padding: 0 ${ms(-9)} 0 0;
  position: relative;
  top: 1px;
`;

export const WarningContainer = styled.div`
  height: 91px;
  width: 100%;
  border: solid 1px rgba(148, 169, 209, 0.49);
  border-radius: 3px;
  background-color: ${({ theme: { colors } }) => colors.light};
  display: flex;
  align-items: center;
  padding: 0 19px;
  margin-top: 36px;
`;
export const InfoText = styled.div`
  color: ${({ theme: { colors } }) => colors.primary};
  font-size: 16px;
  letter-spacing: 0.7px;
  margin-left: 11px;
  line-height: 21px;
`;

export const TooltipContainer = styled.div`
  padding: 10px;
  color: #000;
  font-size: 14px;
  max-width: 312px;

  .customArrow .rc-tooltip-arrow {
    left: 66%;
  }
`;

export const TooltipTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme: { colors } }) => colors.primary};
`;

export const TooltipContent = styled.div`
  margin-top: 8px;
  font-size: 14px;
  line-height: 21px;
  width: 270px;
  font-weight: 300;
  color: ${({ theme: { colors } }) => colors.black};
`;

export const BoldSpan = styled.span`
  font-weight: 500;
`;

export const FeeTooltip = styled(Button)`
  position: relative;
  top: 3px;
`;

export const HelpIcon = styled(TezosIcon)`
  padding: 0 0 0 ${ms(-4)};
`;
