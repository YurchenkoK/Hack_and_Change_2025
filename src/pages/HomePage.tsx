import { motion } from 'framer-motion';
import styled from 'styled-components';

interface HomePageProps {
  onStart: () => void;
}

export const HomePage = ({ onStart }: HomePageProps) => {
  return (
    <PageMotion
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <HeroCard>
        <HeroLeft>
          <Badge>Beta</Badge>
          <HeroTitle>Вычисление дохода</HeroTitle>
          <HeroSubtitle>
            Загрузите датасет клиентов и получите предсказания дохода с ключевой статистикой.
            Поддерживаем формат hackathon_income_test.csv и признаки из features_description.csv.
          </HeroSubtitle>
          <ButtonRow>
            <HeroButton type="button" onClick={onStart}>
              Начать расчёт
            </HeroButton>
            <Hint>CSV, drag&drop или выбор файла</Hint>
          </ButtonRow>
        </HeroLeft>
        <HeroRight>
          <RightTitle>Кэшбэк ваших данных</RightTitle>
          <RightSubtitle>Обрабатываем CSV и возвращаем метрики мгновенно.</RightSubtitle>
          <AccentBubble>AI</AccentBubble>
          <AccentBubble $secondary>ML</AccentBubble>
        </HeroRight>
      </HeroCard>

      <Section>
        <SectionTitle>Сервисы</SectionTitle>
        <ServicesGrid>
          {serviceCards.map((card) => (
            <ServiceCard key={card.title} $accent={card.accent}>
              <IconBubble>{card.icon}</IconBubble>
              <ServiceTitle>{card.title}</ServiceTitle>
              <ServiceDesc>{card.desc}</ServiceDesc>
            </ServiceCard>
          ))}
        </ServicesGrid>
      </Section>
    </PageMotion>
  );
};

const PageMotion = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const HeroCard = styled.section`
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.card};
  border-radius: 28px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.card};
  border: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const HeroLeft = styled.div`
  background: #ffe1e1;
  padding: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: center;
`;

const HeroRight = styled.div`
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  position: relative;
  padding: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: center;
  overflow: hidden;
`;

const Badge = styled.span`
  align-self: flex-start;
  background: rgba(0, 0, 0, 0.08);
  color: ${({ theme }) => theme.colors.text};
  padding: 8px 14px;
  border-radius: ${({ theme }) => theme.radii.pill};
  font-weight: 700;
  font-size: 13px;
`;

const HeroTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.h1};
  font-weight: 800;
  letter-spacing: -0.5px;
`;

const HeroSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: 17px;
  line-height: 1.5;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
  flex-wrap: wrap;
`;

const HeroButton = styled.button`
  border: none;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.accent}, #e50f2b);
  color: #fff;
  padding: 12px 18px;
  border-radius: ${({ theme }) => theme.radii.pill};
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  box-shadow: 0 16px 34px rgba(255, 21, 50, 0.35);
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 40px rgba(255, 21, 50, 0.38);
  }
`;

const Hint = styled.span`
  color: ${({ theme }) => theme.colors.muted};
  font-weight: 600;
`;

const RightTitle = styled.h2`
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.2px;
`;

const RightSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  max-width: 320px;
`;

const AccentBubble = styled.div<{ $secondary?: boolean }>`
  position: absolute;
  right: ${({ $secondary }) => ($secondary ? '16%' : '10%')};
  top: ${({ $secondary }) => ($secondary ? '30%' : '55%')};
  width: ${({ $secondary }) => ($secondary ? '90px' : '120px')};
  height: ${({ $secondary }) => ($secondary ? '90px' : '120px')};
  border-radius: 30%;
  background: ${({ $secondary }) => ($secondary ? '#ffe480' : '#0070f3')};
  color: ${({ $secondary }) => ($secondary ? '#7a4b00' : '#fff')};
  display: grid;
  place-items: center;
  font-weight: 800;
  font-size: ${({ $secondary }) => ($secondary ? '28px' : '36px')};
  box-shadow: ${({ $secondary }) =>
    $secondary
      ? '0 18px 35px rgba(255, 228, 128, 0.35)'
      : '0 20px 45px rgba(0, 112, 243, 0.32)'};
  transform: rotate(-6deg);
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const SectionTitle = styled.h2`
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.3px;
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const ServiceCard = styled.div<{ $accent?: boolean }>`
  background: ${({ $accent, theme }) => ($accent ? '#0f1115' : theme.colors.card)};
  color: ${({ $accent }) => ($accent ? '#fff' : 'inherit')};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.soft};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const IconBubble = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: rgba(15, 17, 21, 0.06);
  display: grid;
  place-items: center;
  font-size: 20px;
`;

const ServiceTitle = styled.div`
  font-weight: 700;
  font-size: 17px;
`;

const ServiceDesc = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  line-height: 1.4;
`;

type ServiceCardItem = {
  title: string;
  desc: string;
  icon: string;
  accent?: boolean;
};

const serviceCards: ServiceCardItem[] = [
  {
    title: 'Загрузка CSV',
    desc: 'Перетащите файл или выберите на диске. Проверим тип и размер.',
    icon: '⬆️'
  },
  {
    title: 'Отправка в модель',
    desc: 'Асинхронный вызов API с прогрессом и обработкой ошибок.',
    icon: '⚡'
  },
  {
    title: 'Отчёт по доходу',
    desc: 'Среднее, медиана, минимум и максимум для быстрой оценки.',
    icon: '📊'
  },
  {
    title: 'Поддержка',
    desc: 'Подсказки по формату файлов и состоянию загрузки в панели.',
    icon: '🛟',
    accent: true
  }
];
