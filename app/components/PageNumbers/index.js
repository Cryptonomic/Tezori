import React from 'react';
import styled from 'styled-components';
import LeftIcon from '@material-ui/icons/ChevronLeft';
import RightIcon from '@material-ui/icons/ChevronRight';

const Container = styled.div`
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 40px;
  user-select: none;
`;

const PageNavButtons = styled.div`
  background-color: ${({ theme: { colors } }) => colors.gray1 };
  cursor: ${({ isactive }) => isactive? 'pointer' : 'not-allowed' };
  pointer-events: ${({ isactive }) => isactive? 'auto' : 'none' };
  color: ${({isactive,  theme: { colors } }) => isactive ? colors.primary : "rgba(18, 50, 98, 0.2)" };
  height: 100%;

  &:hover {
    background-color: ${({ theme: { colors } }) => colors.gray7 };
    transition: background-color 0.2s;
  }
`;

const LeftButton = styled(PageNavButtons)`
  padding: 8px 3px 8px 8px;
  border-top-left-radius: 50%;
  border-bottom-left-radius: 50%;
  margin-right: 1px;
`;

const RightButton = styled(PageNavButtons)`
  padding: 8px 8px 8px 3px;
  border-top-right-radius: 50%;
  border-bottom-right-radius: 50%;
  margin-left: 1px;
`;
const NumberContainer = styled.div`
  display: flex;
  color: ${({ theme: { colors } }) => colors.primary };
  font-size: 14px;
  font-weight: 500;
  margin-right: 15px;
`;
const PageOf = styled.div`
  font-weight: 300;
  opacity: 0.78;
  margin: 0 7px;
`;

type Props = {
  currentPage: number,
  totalNumber: number,
  firstNumber: number,
  lastNumber: number,
  onClick: () => {}
};

const PageNumbers = ( props: Props) => {

  const { currentPage, totalNumber, firstNumber, lastNumber, onClick } = props;

  return (
    <Container>
      <NumberContainer>
        {firstNumber+1}-{lastNumber}
        <PageOf>of</PageOf>
        {totalNumber}
      </NumberContainer>
      <LeftButton
        isactive={firstNumber!==0}
        onClick={()=>onClick(currentPage - 1)}
      >
        <LeftIcon />
      </LeftButton>
      <RightButton
        isactive={lastNumber<totalNumber}
        onClick={()=>onClick(currentPage + 1)}
      >
        <RightIcon />
      </RightButton>
    </Container>
  );
}
export default PageNumbers;
