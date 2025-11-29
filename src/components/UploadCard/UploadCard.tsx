import { motion } from 'framer-motion';
import styled from 'styled-components';
import type { PredictionResponse, UploadStatus } from '../../types/api';
import { Tag } from '../ui/Tag';
import { UploadZone } from './UploadZone';
import { StatusPanel } from './StatusPanel';

interface UploadCardProps {
  status: UploadStatus;
  selectedFile: File | null;
  result: PredictionResponse | null;
  errorMessage: string | null;
  onFileSelected: (file: File | null) => void;
  onUpload: () => void;
}

export const UploadCard = ({
  status,
  selectedFile,
  result,
  errorMessage,
  onFileSelected,
  onUpload
}: UploadCardProps) => {
  return (
    <Card
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <Header>
        <div>
          <Title>Загрузка датасета</Title>
          <Subtitle>
            Drag & Drop CSV-файл или выберите на диске. Мы отправим его в модель и покажем первые
            результаты.
          </Subtitle>
        </div>
      </Header>

      <Grid>
        <UploadZone
          selectedFile={selectedFile}
          status={status}
          onFileSelected={onFileSelected}
          onUpload={onUpload}
        />
        <StatusPanel
          status={status}
          selectedFile={selectedFile}
          result={result}
          errorMessage={errorMessage}
        />
      </Grid>
    </Card>
  );
};

const Card = styled(motion.section)`
  padding: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.h2};
  font-weight: 700;
`;

const Subtitle = styled.p`
  margin-top: 6px;
  color: ${({ theme }) => theme.colors.muted};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;
