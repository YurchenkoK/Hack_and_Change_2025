import { useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import styled from 'styled-components';
import { UploadStatus } from '../../types/api';
import { Button } from '../ui/Button';
import { Tag } from '../ui/Tag';

interface UploadZoneProps {
  selectedFile: File | null;
  status: UploadStatus;
  onFileSelected: (file: File | null) => void;
  onUpload: () => void;
  showTitle?: boolean;
}

export const UploadZone = ({
  selectedFile,
  status,
  onFileSelected,
  onUpload,
  showTitle = true
}: UploadZoneProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const isUploading = status === 'uploading';

  const validateFile = (file: File | null) => {
    if (!file) return null;
    const isCsv =
      file.type === 'text/csv' ||
      file.type === 'application/vnd.ms-excel' ||
      file.name.toLowerCase().endsWith('.csv');

    if (!isCsv) {
      setLocalError('Поддерживаются только CSV-файлы');
      return null;
    }
    setLocalError(null);
    return file;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = validateFile(files[0]);
    onFileSelected(file);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files);
  };

  return (
    <Column>
      {showTitle && <BlockTitle>Перетащите CSV сюда или выберите файл</BlockTitle>}
      <DropArea
        $dragging={isDragging}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
      >
        <DropContent>
          <DropHeading>Перетащите файл</DropHeading>
          {selectedFile ? (
            <Tag tone="info">{selectedFile.name}</Tag>
          ) : (
            <Tag tone="muted">CSV</Tag>
          )}
          <HiddenInput
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleInputChange}
          />
        </DropContent>
      </DropArea>

      <Actions>
        <Button type="button" variant="ghost" onClick={() => inputRef.current?.click()}>
          Выбрать файл
        </Button>
        <Button
          type="button"
          onClick={onUpload}
          disabled={!selectedFile || isUploading}
          isLoading={isUploading}
        >
          Загрузить данные
        </Button>
      </Actions>
      {localError && <ErrorText>{localError}</ErrorText>}
    </Column>
  );
};

UploadZone.defaultProps = {
  showTitle: true
};

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const BlockTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.h3};
  font-weight: 700;
`;

const DropArea = styled.div<{ $dragging: boolean }>`
  border: 2px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.card};
  padding: ${({ theme }) => theme.spacing.xl};
  cursor: pointer;
  transition: all 0.18s ease;
  ${({ $dragging, theme }) =>
    $dragging &&
    `
    border-color: ${theme.colors.accent};
  `}
`;

const DropContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  text-align: center;
`;

const Icon = styled.div`
  font-size: 32px;
`;

const DropHeading = styled.div`
  font-weight: 700;
  font-size: 18px;
`;

const DropText = styled.div`
  color: ${({ theme }) => theme.colors.muted};
`;

const HiddenInput = styled.input`
  display: none;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ErrorText = styled.span`
  color: ${({ theme }) => theme.colors.error};
  font-weight: 600;
`;
