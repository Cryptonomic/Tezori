import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  padding: 0 20px 20px 20px;
`;

const MainContainer = styled.div`
  width: 100%;
  margin-top: 30px;
`;

const MainTitle = styled.div`
  font-size: 24px;
  line-height: 34px;
  letter-spacing: 1px;
  font-weight: 300;
  color: ${({ theme: { colors } }) => colors.primary};
`;

const CodeTxt = styled.div`
  font-size: 16px;
  color: ${({ theme: { colors } }) => colors.primary};
  word-wrap: break-word;
`;

type Props = {
  label: string,
  code: string
};

const CodeStorage = (props: Props) => {
  const { label, code } = props;
  return (
    <Container>
      <MainTitle>{label}</MainTitle>
      <MainContainer>
        <CodeTxt>{code}</CodeTxt>
      </MainContainer>
    </Container>
  );
};

export default CodeStorage;
