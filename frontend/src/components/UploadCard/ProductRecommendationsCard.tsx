import { useState } from 'react';
import styled from 'styled-components';
import { Tag } from '../ui/Tag';

const RECOMMENDATIONS = [
  {
    title: 'Кредитные продукты с гибкими лимитами',
    description: 'Персональные кредитные карты и овердрафты с индивидуальным лимитом',
    icon: '💳',
    target: 'Клиенты с высоким оборотом по активным кредитам',
    benefit: 'Увеличение кредитного портфеля и лояльности',
  },
  {
    title: 'Рефинансирование или консолидация кредитов',
    description: 'Объединение кредитов с выгодными условиями для снижения платежной нагрузки',
    icon: '🔄',
    target: 'Клиенты с высоким историческим лимитом или активными кредитами',
    benefit: 'Снижение оттока клиентов, рост удержания',
  },
  {
    title: 'Персональные потребительские кредиты под доход',
    description: 'Целевые кредиты с дифференцированной ставкой в зависимости от уровня дохода',
    icon: '💰',
    target: 'Клиенты со стабильной средней зарплатой',
    benefit: 'Рост кредитного портфеля с минимальным риском',
  },
  {
    title: 'Премиальные или зарплатные пакеты обслуживания',
    description: 'Эксклюзивные тарифы с кешбэком, премиум-картами и инвестиционными сервисами',
    icon: '⭐',
    target: 'Клиенты со стабильными оборотами и высокой зарплатой',
    benefit: 'Увеличение комиссионных доходов и удержание VIP-клиентов',
  },
  {
    title: 'Инвестиционные и накопительные решения',
    description: 'ИИС, накопительные счета и структурные продукты для роста капитала',
    icon: '📈',
    target: 'Клиенты с высоким и стабильным доходом',
    benefit: 'Рост комиссионного дохода, увеличение AUM',
  }
];

export const ProductRecommendationsCard = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Wrapper>
      <HeaderClickable onClick={() => setIsOpen(!isOpen)}>
        <HeaderContent>
          <Title>Рекомендации по развитию продуктов</Title>
          <Tag tone="success">Стратегия роста</Tag>
        </HeaderContent>
        <ToggleIcon $isOpen={isOpen}>▼</ToggleIcon>
      </HeaderClickable>
      {isOpen && (
        <>
          <Subtitle>
            На основе анализа ключевых признаков модели предлагаем продуктовые решения для увеличения доходности и удержания клиентов.
          </Subtitle>
          <RecommendationsList>
        {RECOMMENDATIONS.map((rec, index) => (
          <RecommendationCard key={rec.title}>
            <CardHeader>
              <IconCircle>{rec.icon}</IconCircle>
              <CardContent>
                <CardNumber>#{index + 1}</CardNumber>
                <CardTitle>{rec.title}</CardTitle>
                <CardDescription>{rec.description}</CardDescription>
              </CardContent>
            </CardHeader>
            
            <InfoGrid>
              <InfoItem>
                <InfoLabel>🎯 Целевая аудитория:</InfoLabel>
                <InfoText>{rec.target}</InfoText>
              </InfoItem>
              <InfoItem>
                <InfoLabel>💼 Бизнес-выгода:</InfoLabel>
                <InfoText>{rec.benefit}</InfoText>
              </InfoItem>
            </InfoGrid>
          </RecommendationCard>
        ))}
          </RecommendationsList>
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

const RecommendationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const RecommendationCard = styled.div`
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
    box-shadow: 0 4px 16px rgba(255, 21, 50, 0.12);
    transform: translateY(-2px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
`;

const IconCircle = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255, 21, 50, 0.1), rgba(255, 21, 50, 0.05));
  display: grid;
  place-items: center;
  font-size: 24px;
  flex-shrink: 0;
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

const CardNumber = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.accent};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CardTitle = styled.h4`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const CardDescription = styled.p`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
`;

const InfoGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-left: calc(48px + ${({ theme }) => theme.spacing.md});
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const InfoLabel = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const InfoText = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
  line-height: 1.4;
`;
