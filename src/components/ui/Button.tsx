import { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import styled, { css } from 'styled-components';

type ButtonVariant = 'primary' | 'ghost';

interface ButtonProps extends PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> {
  variant?: ButtonVariant;
  isLoading?: boolean;
}

const StyledButton = styled.button<{ variant: ButtonVariant }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 18px;
  border-radius: ${({ theme }) => theme.radii.pill};
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: transform 0.12s ease, box-shadow 0.12s ease, background 0.12s ease;

  ${({ variant, theme }) =>
    variant === 'primary'
      ? css`
          background: linear-gradient(135deg, ${theme.colors.accent}, ${theme.colors.accentDark});
          color: #fff;
          box-shadow: 0 10px 25px rgba(255, 21, 50, 0.25);
          &:hover {
            transform: translateY(-1px);
            box-shadow: 0 14px 30px rgba(255, 21, 50, 0.28);
          }
        `
      : css`
          background: #fff;
          color: ${theme.colors.text};
          border-color: ${theme.colors.border};
          &:hover {
            background: ${theme.colors.background};
          }
        `}

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    transform: none;
    box-shadow: none;
  }
`;

export const Button = ({ variant = 'primary', isLoading, children, ...rest }: ButtonProps) => (
  <StyledButton variant={variant} {...rest}>
    {isLoading ? 'Загрузка...' : children}
  </StyledButton>
);
