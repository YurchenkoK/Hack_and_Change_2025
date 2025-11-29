import { PropsWithChildren } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
  width: 100%;

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

export const PageContainer = ({ children }: PropsWithChildren) => {
  return <Container>{children}</Container>;
};
