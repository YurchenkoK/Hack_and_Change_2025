import { useState } from 'react';
import styled from 'styled-components';
import { Tag } from '../ui/Tag';

const TOP_FEATURES = [
  {
    displayName: 'Средний оборот по активным кредитам',
    description: 'Среднемесячные обороты по действующим кредитным картам и счетам',
    impact: 'Высокий',
    recommendation: 'Основной индикатор платежеспособности клиента',
    businessValue: 'Показывает уровень финансовой активности и доступные средства'
  },
  {
    displayName: 'Средняя зарплата за 6-12 месяцев',
    description: 'Усредненные зарплатные поступления за последние полгода-год',
    impact: 'Очень высокий',
    recommendation: 'Критичный признак для оценки стабильного дохода',
    businessValue: 'Отражает текущий уровень доходов и их стабильность'
  },
  {
    displayName: 'Первая зарплата клиента',
    description: 'Сумма первой зафиксированной зарплаты в системе',
    impact: 'Высокий',
    recommendation: 'Базовая точка для расчета динамики доходов',
    businessValue: 'Позволяет оценить рост доходов клиента за период сотрудничества'
  },
  {
    displayName: 'Декларируемый доход',
    description: 'Уровень дохода, заявленный клиентом при оформлении продуктов',
    impact: 'Высокий',
    recommendation: 'Сопоставляется с фактическими данными для верификации',
    businessValue: 'Помогает выявить расхождения между заявленным и реальным доходом'
  },
  {
    displayName: 'Максимальный кредитный лимит (БКИ)',
    description: 'Максимальный суммарный лимит по данным Бюро кредитных историй',
    impact: 'Средний',
    recommendation: 'Отражает доверие других банков к клиенту',
    businessValue: 'Косвенный показатель кредитоспособности и истории платежей'
  }
];

export const TopFeatures = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Wrapper>
      <HeaderClickable onClick={() => setIsOpen(!isOpen)}>
        <HeaderContent>
          <Title>Топ-5 важных признаков</Title>
          <Tag tone="info">Для менеджеров</Tag>
        </HeaderContent>
        <ToggleIcon $isOpen={isOpen}>▼</ToggleIcon>
      </HeaderClickable>
      {isOpen && (
        <>
          <Subtitle>
            Эти признаки наиболее влияют на точность прогноза дохода клиента. Проверьте их полноту в датасете для более точных предсказаний.
          </Subtitle>
          <FeaturesList>
        {TOP_FEATURES.map((feature, index) => (
          <FeatureCard key={feature.displayName}>
            <FeatureHeader>
              <FeatureRank>{index + 1}</FeatureRank>
              <div>
                <FeatureName>{feature.displayName}</FeatureName>
                <ImpactBadge $impact={feature.impact}>{feature.impact} приоритет</ImpactBadge>
              </div>
            </FeatureHeader>
            <FeatureDescription>{feature.description}</FeatureDescription>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>💡 Рекомендация:</InfoLabel>
                <InfoText>{feature.recommendation}</InfoText>
              </InfoItem>
              <InfoItem>
                <InfoLabel>📊 Бизнес-ценность:</InfoLabel>
                <InfoText>{feature.businessValue}</InfoText>
              </InfoItem>
            </InfoGrid>
          </FeatureCard>
        ))}
          </FeaturesList>
        </>
      )}
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

const HeaderClickable = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  flex: 1;
`;

const ToggleIcon = styled.span<{ $isOpen: boolean }>`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.muted};
  transition: transform 0.2s ease;
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
`;

const Title = styled.h3`
  font-size: ${({ theme }) => theme.typography.h3};
  font-weight: 700;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.muted};
  line-height: 1.5;
`;

const FeaturesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FeatureCard = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: all 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 4px 12px rgba(255, 21, 50, 0.1);
  }
`;

const FeatureHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FeatureRank = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 800;
  font-size: 14px;
  flex-shrink: 0;
`;

const FeatureName = styled.div`
  font-weight: 700;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text};
`;

const ImpactBadge = styled.div<{ $impact: string }>`
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 6px;
  margin-top: 4px;
  background: ${({ $impact }) => {
    if ($impact === 'Очень высокий') return 'rgba(255, 21, 50, 0.12)';
    if ($impact === 'Высокий') return 'rgba(255, 152, 0, 0.12)';
    return 'rgba(0, 112, 243, 0.12)';
  }};
  color: ${({ $impact, theme }) => {
    if ($impact === 'Очень высокий') return theme.colors.accent;
    if ($impact === 'Высокий') return '#ff9800';
    return '#0070f3';
  }};
`;

const FeatureDescription = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  line-height: 1.5;
  padding-left: calc(28px + ${({ theme }) => theme.spacing.sm});
  font-weight: 500;
`;

const InfoGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-left: calc(28px + ${({ theme }) => theme.spacing.sm});
  margin-top: 8px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InfoLabel = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const InfoText = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
  line-height: 1.5;
`;
