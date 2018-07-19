import * as React from 'react';
import styled from 'styled-components';
import { H6 } from '../Heading';
import { ms } from '../../styles/helpers';

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  align-self: center;
  max-width: 320px;
  padding-top: ${ms(11)};
`;

const Image = styled.img`(
  display: inline-block;
  padding-bottom: ${ms(4)};
)`;

const Title = styled(H6)`
  color: ${({ theme: { colors } }) => colors.primary};
  margin-top: 20px;
`;

type Props = {
  title: string,
  description: React.Node,
  imageSrc: string,
  className?: string
};

const EmptyState = (props: Props) => {
  const { title, description, imageSrc, className } = props;
  return (
    <Container className={className}>
      <Image alt="transactions empty state" src={imageSrc} />
      <Title>{title}</Title>
      {description}
    </Container>
  );
};

export default EmptyState;
