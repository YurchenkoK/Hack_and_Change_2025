import { motion } from 'framer-motion';
import styled from 'styled-components';
import { UploadZone } from '../components/UploadCard/UploadZone';
import { StatusPanel, getStatusLabel, getTone } from '../components/UploadCard/StatusPanel';
import { Tag } from '../components/ui/Tag';
import type { PredictionResponse, UploadStatus } from '../types/api';

interface UploadPageProps {
  status: UploadStatus;
  selectedFile: File | null;
  result: PredictionResponse | null;
  errorMessage: string | null;
  onFileSelected: (file: File | null) => void;
  onUpload: () => void;
}

export const UploadPage = ({
  status,
  selectedFile,
  result,
  errorMessage,
  onFileSelected,
  onUpload
}: UploadPageProps) => {
  const label = getStatusLabel(status, selectedFile, result, errorMessage);
  const tone = status === 'error' ? 'default' : getTone(status);

  return (
    <PageMotion
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <Intro>
        <Title>Загрузка датасета</Title>
        <Subtitle>
          Drag & Drop CSV-файл или выберите на диске. Мы отправим его в модель и покажем первые
          результаты без лишних шагов.
        </Subtitle>
      </Intro>

      <Sections>
        <Block>
          <BlockHeader>
            <BlockTitle>Перетащите CSV сюда или выберите файл</BlockTitle>
            <BlockHint>Поддерживается CSV</BlockHint>
          </BlockHeader>
          <CardFrame>
            <UploadZone
              selectedFile={selectedFile}
              status={status}
              onFileSelected={onFileSelected}
              onUpload={onUpload}
              showTitle={false}
            />
          </CardFrame>
        </Block>

        <Block>
          <BlockHeader>
            <BlockTitle>Статус и результаты</BlockTitle>
            <Tag tone={tone}>{label}</Tag>
          </BlockHeader>
          <CardFrame>
            <StatusPanel
              status={status}
              selectedFile={selectedFile}
              result={result}
              errorMessage={errorMessage}
              showHeader={false}
              flat
            />
          </CardFrame>
        </Block>
      </Sections>
    </PageMotion>
  );
};

const PageMotion = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const Intro = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.h1};
  font-weight: 800;
  letter-spacing: -0.5px;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 18px;
  line-height: 1.5;
  max-width: 900px;
`;

const Sections = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const BlockHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`;

const BlockTitle = styled.h3`
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.2px;
  margin: 0;
`;

const BlockHint = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  font-weight: 700;
`;

const CardFrame = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radii.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.soft};
  padding: ${({ theme }) => theme.spacing.lg};
`;
