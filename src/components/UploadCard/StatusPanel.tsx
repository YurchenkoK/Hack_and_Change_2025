import styled from 'styled-components';
import { PredictionResponse, UploadStatus } from '../../types/api';
import { Tag } from '../ui/Tag';

interface StatusPanelProps {
  status: UploadStatus;
  selectedFile: File | null;
  result: PredictionResponse | null;
  errorMessage: string | null;
  showHeader?: boolean;
  flat?: boolean;
}

const formatBytes = (bytes: number) => {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const power = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** power;
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[power]}`;
};

export const getStatusLabel = (
  status: UploadStatus,
  selectedFile: File | null,
  result: PredictionResponse | null,
  errorMessage: string | null
) => {
  switch (status) {
    case 'idle':
      return 'Файл не выбран';
    case 'fileSelected':
      return selectedFile
        ? `Файл выбран: ${selectedFile.name}, ${formatBytes(selectedFile.size)}`
        : 'Файл выбран';
    case 'uploading':
      return 'Отправляем файл в ML-модель…';
    case 'success':
      return result ? `Успех: получено ${result.n_rows} предсказаний` : 'Успех';
    case 'error':
      return `Ошибка: ${errorMessage ?? 'что-то пошло не так'}`;
    default:
      return 'Готов к загрузке';
  }
};

export const getTone = (status: UploadStatus): 'default' | 'muted' | 'success' | 'info' => {
  if (status === 'success') return 'success';
  if (status === 'uploading') return 'info';
  if (status === 'fileSelected') return 'default';
  return 'muted';
};

export const StatusPanel = ({
  status,
  selectedFile,
  result,
  errorMessage,
  showHeader = true,
  flat = false
}: StatusPanelProps) => {
  const label = getStatusLabel(status, selectedFile, result, errorMessage);
  const tone = status === 'error' ? 'default' : getTone(status);
  const showResult = status === 'success' && result;

  return (
    <Wrapper>
      {showHeader && (
        <HeaderRow>
          <div>
            <Title>Статус и результаты</Title>
            <Subtitle>Контроль загрузки, прогресса и ответа модели</Subtitle>
          </div>
          <Tag tone={tone}>{label}</Tag>
        </HeaderRow>
      )}

      <Panel $flat={flat}>
        <SectionTitle>Текущее состояние</SectionTitle>
        <StatusText $isError={status === 'error'}>{label}</StatusText>
        {status === 'error' && errorMessage && <ErrorText>Детали: {errorMessage}</ErrorText>}
        {selectedFile && (
          <SmallText>
            Активный файл: <strong>{selectedFile.name}</strong> ({formatBytes(selectedFile.size)})
          </SmallText>
        )}
      </Panel>

      {showResult && result && (
        <Panel $flat={flat}>
          <SectionTitle>Результаты предсказания</SectionTitle>
          <Grid>
            <MetricCard>
              <MetricLabel>Строк в файле</MetricLabel>
              <MetricValue>{result.n_rows.toLocaleString('ru-RU')}</MetricValue>
            </MetricCard>
            <MetricCard>
              <MetricLabel>Среднее</MetricLabel>
              <MetricValue>{Math.round(result.summary.target_mean).toLocaleString('ru-RU')} ₽</MetricValue>
            </MetricCard>
            <MetricCard>
              <MetricLabel>Медиана</MetricLabel>
              <MetricValue>{Math.round(result.summary.target_median).toLocaleString('ru-RU')} ₽</MetricValue>
            </MetricCard>
            <MetricCard>
              <MetricLabel>Мин / Макс</MetricLabel>
              <MetricValue>
                {Math.round(result.summary.target_min).toLocaleString('ru-RU')} ₽ —{' '}
                {Math.round(result.summary.target_max).toLocaleString('ru-RU')} ₽
              </MetricValue>
            </MetricCard>
          </Grid>

          <SectionTitle>Первые значения target</SectionTitle>
          <List>
            {result.target.slice(0, 5).map((value, index) => (
              <ListItem key={`${value}-${index}`}>
                <Dot />
                <span>
                  {index + 1}. {value.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} ₽
                </span>
              </ListItem>
            ))}
          </List>
        </Panel>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const HeaderRow = styled.div`
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

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.muted};
  margin-top: 4px;
`;

const Panel = styled.div<{ $flat: boolean }>`
  border-radius: ${({ theme }) => theme.radii.card};
  border: ${({ $flat, theme }) => ($flat ? `1px dashed ${theme.colors.border}` : `1px solid ${theme.colors.border}`)};
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  background: ${({ $flat, theme }) => ($flat ? 'transparent' : theme.colors.card)};
  box-shadow: ${({ $flat, theme }) => ($flat ? 'none' : theme.shadows.soft)};
`;

const SectionTitle = styled.div`
  font-weight: 700;
  font-size: 15px;
`;

const StatusText = styled.div<{ $isError: boolean }>`
  font-weight: 600;
  color: ${({ $isError, theme }) => ($isError ? theme.colors.error : theme.colors.text)};
`;

const ErrorText = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-weight: 600;
`;

const SmallText = styled.div`
  color: ${({ theme }) => theme.colors.muted};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const MetricCard = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const MetricLabel = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 14px;
  margin-bottom: 6px;
`;

const MetricValue = styled.div`
  font-weight: 700;
  font-size: 18px;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ListItem = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
`;

const Dot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accent};
  box-shadow: 0 0 0 6px rgba(255, 21, 50, 0.12);
`;
