import { PropsWithChildren } from 'react';
import styled from 'styled-components';

type TagTone = 'default' | 'muted' | 'success' | 'info';

interface TagProps extends PropsWithChildren {
  tone?: TagTone;
}

const toneMap: Record<TagTone, { bg: string; color: string }> = {
  default: { bg: 'rgba(255, 21, 50, 0.12)', color: '#d80f28' },
  muted: { bg: 'rgba(15, 17, 21, 0.06)', color: '#4b5563' },
  success: { bg: 'rgba(15, 169, 88, 0.14)', color: '#0fa958' },
  info: { bg: 'rgba(37, 99, 235, 0.14)', color: '#1d4ed8' }
};

const Pill = styled.span<{ tone: TagTone }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ tone }) => toneMap[tone].bg};
  color: ${({ tone }) => toneMap[tone].color};
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.2px;
`;

export const Tag = ({ tone = 'default', children }: TagProps) => {
  return <Pill tone={tone}>{children}</Pill>;
};
