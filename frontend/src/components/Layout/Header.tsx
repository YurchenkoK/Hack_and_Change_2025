import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Tag } from '../ui/Tag';

const Bar = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-weight: 700;
  font-size: 20px;
  letter-spacing: -0.2px;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.7;
  }
`;

const Dot = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accent};
  box-shadow: 0 8px 18px rgba(255, 21, 50, 0.35);
`;

const Subtitle = styled.span`
  color: ${({ theme }) => theme.colors.muted};
  font-weight: 600;
`;

export const Header = () => {
  const navigate = useNavigate();

  return (
    <Bar>
      <Title onClick={() => navigate('/')}>
        <Dot />
        Alfa Marseille
      </Title>
      <Tag tone="muted">
        <Subtitle>Прогноз дохода</Subtitle>
      </Tag>
    </Bar>
  );
};
