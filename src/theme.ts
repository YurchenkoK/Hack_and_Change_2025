export const theme = {
  colors: {
    background: '#f4f5f7',
    card: '#ffffff',
    text: '#0f1115',
    muted: '#6b7280',
    border: '#e5e7eb',
    accent: '#ff1532',
    accentDark: '#d80f28',
    success: '#0fa958',
    warning: '#f59e0b',
    error: '#d92c2c',
    info: '#2563eb'
  },
  radii: {
    card: '24px',
    md: '12px',
    pill: '999px'
  },
  shadows: {
    card: '0 24px 70px rgba(0, 0, 0, 0.08)',
    soft: '0 10px 30px rgba(0, 0, 0, 0.06)'
  },
  spacing: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px'
  },
  typography: {
    fontFamily: "'Manrope', 'Segoe UI', 'Inter', system-ui, -apple-system, sans-serif",
    h1: '42px',
    h2: '28px',
    h3: '20px',
    body: '16px'
  }
};

export type AppTheme = typeof theme;
