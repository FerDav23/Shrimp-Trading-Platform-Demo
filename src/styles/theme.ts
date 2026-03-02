/**
 * Design tokens centralizados.
 * Edita aquí colores, fuentes y valores de diseño para cambiar todo el proyecto.
 */

export const colors = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  /** Colores semánticos para estados (success, warning, error, info) */
  semantic: {
    success: { bg: 'emerald', text: 'emerald' },
    warning: { bg: 'amber', text: 'amber' },
    error: { bg: 'red', text: 'red' },
    info: { bg: 'sky', text: 'sky' },
  },
  /** Colores para badges de estado */
  status: {
    success: { bg: 'green', text: 'green', border: 'green' },
    warning: { bg: 'yellow', text: 'yellow', border: 'yellow' },
    error: { bg: 'red', text: 'red', border: 'red' },
    info: { bg: 'blue', text: 'blue', border: 'blue' },
    neutral: { bg: 'gray', text: 'gray', border: 'gray' },
  },
} as const;

export const fontFamily = {
  sans: [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Oxygen',
    'Ubuntu',
    'Cantarell',
    'Fira Sans',
    'Droid Sans',
    'Helvetica Neue',
    'sans-serif',
  ].join(', '),
  mono: [
    'source-code-pro',
    'Menlo',
    'Monaco',
    'Consolas',
    'Courier New',
    'monospace',
  ].join(', '),
} as const;
