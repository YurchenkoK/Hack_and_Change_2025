import styled from 'styled-components';
import { Tag } from '../ui/Tag';
import type { PredictionResponse } from '../../types/api';

interface PredictionHistoryProps {
  history: PredictionResponse[];
  onClear: () => void;
}

export const PredictionHistory = ({ history, onClear }: PredictionHistoryProps) => {
  if (history.length === 0) {
    return (
      <Wrapper>
        <Header>
          <Title>История предсказаний</Title>
          <Tag tone="muted">Пусто</Tag>
        </Header>
        <EmptyState>
          <EmptyIcon>📊</EmptyIcon>
          <EmptyText>Здесь будет отображаться история ваших предсказаний</EmptyText>
        </EmptyState>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Header>
        <Title>История предсказаний</Title>
        <HeaderActions>
          <Tag tone="info">{history.length} записей</Tag>
          <ClearButton onClick={onClear}>Очистить</ClearButton>
        </HeaderActions>
      </Header>
      <HistoryList>
        {history.map((item, index) => (
          <HistoryCard key={item.request_id}>
            <CardHeader>
              <CardNumber>#{history.length - index}</CardNumber>
              <FileName>{item.file_name}</FileName>
              <RowCount>{item.n_rows.toLocaleString('ru-RU')} строк</RowCount>
            </CardHeader>
            <StatsGrid>
              <StatItem>
                <StatLabel>Среднее</StatLabel>
                <StatValue>{Math.round(item.summary.target_mean).toLocaleString('ru-RU')} ₽</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Медиана</StatLabel>
                <StatValue>{Math.round(item.summary.target_median).toLocaleString('ru-RU')} ₽</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Мин</StatLabel>
                <StatValue>{Math.round(item.summary.target_min).toLocaleString('ru-RU')} ₽</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Макс</StatLabel>
                <StatValue>{Math.round(item.summary.target_max).toLocaleString('ru-RU')} ₽</StatValue>
              </StatItem>
            </StatsGrid>
          </HistoryCard>
        ))}
      </HistoryList>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radii.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.soft};
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`;

const Title = styled.h3`
  font-size: ${({ theme }) => theme.typography.h3};
  font-weight: 700;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ClearButton = styled.button`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.muted};
  padding: 6px 12px;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.xl};
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  opacity: 0.3;
`;

const EmptyText = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  text-align: center;
`;

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  max-height: 400px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 3px;

    &:hover {
      background: ${({ theme }) => theme.colors.muted};
    }
  }
`;

const HistoryCard = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  transition: all 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 2px 8px rgba(255, 21, 50, 0.08);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;

const CardNumber = styled.div`
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  font-weight: 800;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 6px;
`;

const FileName = styled.div`
  font-weight: 700;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  flex: 1;
  min-width: 150px;
`;

const RowCount = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
  font-weight: 600;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const StatLabel = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.muted};
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.5px;
`;

const StatValue = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;
