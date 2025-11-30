import styled from 'styled-components';
import { Tag } from '../ui/Tag';

const RECOMMENDATIONS = [
  {
    title: 'Кредитные продукты с гибкими лимитами',
    description: 'Персональные кредитные карты и овердрафты с индивидуальным лимитом',
    icon: '💳',
    target: 'Клиенты с высоким оборотом по активным кредитам',
    benefit: 'Увеличение кредитного портфеля и лояльности',
    features: [
      'Персональный расчет лимита на основе оборотов',
      'Гибкие условия погашения',
      'Автоматическое увеличение лимита при росте доходов'
    ]
  },
  {
    title: 'Рефинансирование или консолидация кредитов',
    description: 'Объединение кредитов с выгодными условиями для снижения платежной нагрузки',
    icon: '🔄',
    target: 'Клиенты с высоким историческим лимитом или активными кредитами',
    benefit: 'Снижение оттока клиентов, рост удержания',
    features: [
      'Консолидация всех кредитов в один платеж',
      'Снижение ставки на основе кредитной истории',
      'Увеличение срока погашения для комфортных платежей'
    ]
  },
  {
    title: 'Персональные потребительские кредиты под доход',
    description: 'Целевые кредиты с дифференцированной ставкой в зависимости от уровня дохода',
    icon: '💰',
    target: 'Клиенты со стабильной средней зарплатой',
    benefit: 'Рост кредитного портфеля с минимальным риском',
    features: [
      'Ставка привязана к среднему доходу за 6-12 месяцев',
      'Быстрое одобрение для проверенных клиентов',
      'Отсутствие скрытых комиссий'
    ]
  },
  {
    title: 'Премиальные или зарплатные пакеты обслуживания',
    description: 'Эксклюзивные тарифы с кешбэком, премиум-картами и инвестиционными сервисами',
    icon: '⭐',
    target: 'Клиенты со стабильными оборотами и высокой зарплатой',
    benefit: 'Увеличение комиссионных доходов и удержание VIP-клиентов',
    features: [
      'Повышенный кешбэк по всем категориям',
      'Доступ к бизнес-залам и консьерж-сервису',
      'Персональный менеджер и инвестиционные консультации'
    ]
  },
  {
    title: 'Инвестиционные и накопительные решения',
    description: 'ИИС, накопительные счета и структурные продукты для роста капитала',
    icon: '📈',
    target: 'Клиенты с высоким и стабильным доходом',
    benefit: 'Рост комиссионного дохода, увеличение AUM',
    features: [
      'Индивидуальные инвестиционные стратегии',
      'Налоговые вычеты по ИИС до 52 000 ₽',
      'Диверсифицированные портфели с защитой капитала'
    ]
  }
];

export const ProductRecommendations = () => {
  return (
    <Wrapper>
      <Header>
        <Title>Рекомендации по развитию продуктов</Title>
        <Tag tone="success">Стратегия роста</Tag>
      </Header>
      <Subtitle>
        На основе анализа ключевых признаков модели предлагаем продуктовые решения для увеличения доходности и удержания клиентов.
      </Subtitle>
      <RecommendationsList>
        {RECOMMENDATIONS.map((rec, index) => (
          <RecommendationCard key={rec.title}>
            <CardHeader>
              <IconCircle>{rec.icon}</IconCircle>
              <CardTitleGroup>
                <CardNumber>#{index + 1}</CardNumber>
                <CardTitle>{rec.title}</CardTitle>
              </CardTitleGroup>
            </CardHeader>
            <CardDescription>{rec.description}</CardDescription>
            
            <InfoSection>
              <InfoItem>
                <InfoIcon>🎯</InfoIcon>
                <div>
                  <InfoLabel>Целевая аудитория:</InfoLabel>
                  <InfoText>{rec.target}</InfoText>
                </div>
              </InfoItem>
              <InfoItem>
                <InfoIcon>💼</InfoIcon>
                <div>
                  <InfoLabel>Бизнес-выгода:</InfoLabel>
                  <InfoText>{rec.benefit}</InfoText>
                </div>
              </InfoItem>
            </InfoSection>

            <FeaturesSection>
              <FeaturesTitle>Ключевые особенности:</FeaturesTitle>
              <FeaturesList>
                {rec.features.map((feature) => (
                  <FeatureItem key={feature}>
                    <FeatureDot />
                    <FeatureText>{feature}</FeatureText>
                  </FeatureItem>
                ))}
              </FeaturesList>
            </FeaturesSection>
          </RecommendationCard>
        ))}
      </RecommendationsList>
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

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.muted};
  line-height: 1.5;
`;

const RecommendationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const RecommendationCard = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  transition: all 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 4px 16px rgba(255, 21, 50, 0.12);
    transform: translateY(-2px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
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

const CardTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const CardNumber = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.accent};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CardTitle = styled.h4`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const CardDescription = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: 15px;
  line-height: 1.6;
  margin: 0;
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radii.sm};
  padding: ${({ theme }) => theme.spacing.md};
`;

const InfoItem = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: flex-start;
`;

const InfoIcon = styled.div`
  font-size: 18px;
  flex-shrink: 0;
`;

const InfoLabel = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 2px;
`;

const InfoText = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
  line-height: 1.5;
`;

const FeaturesSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FeaturesTitle = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 10px;
`;

const FeatureDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accent};
  margin-top: 6px;
  flex-shrink: 0;
`;

const FeatureText = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.muted};
  line-height: 1.5;
`;
