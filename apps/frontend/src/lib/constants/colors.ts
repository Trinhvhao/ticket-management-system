/**
 * NexusFlow Color Palette
 * Atlassian-inspired color scheme for enterprise service management
 */

export const colors = {
  // Primary Colors
  primary: {
    blue: '#0052CC',      // Atlassian Blue - Main brand color
    dark: '#172B4D',      // Atlassian Dark - Text and dark backgrounds
    light: '#4C9AFF',     // Light blue for hover states
  },

  // Neutral Colors
  neutral: {
    gray: '#F4F5F7',      // Light gray background
    text: '#42526E',      // Body text color
    border: '#DFE1E6',    // Border color
    white: '#FFFFFF',
    black: '#000000',
  },

  // Semantic Colors
  semantic: {
    success: '#10B981',   // Green for success states
    warning: '#F59E0B',   // Yellow/Orange for warnings
    error: '#EF4444',     // Red for errors
    info: '#3B82F6',      // Blue for info
  },

  // Status Colors (for tickets)
  status: {
    todo: '#4C9AFF',      // Blue
    inProgress: '#F59E0B', // Orange
    done: '#10B981',      // Green
    blocked: '#EF4444',   // Red
  },

  // Priority Colors
  priority: {
    urgent: '#EF4444',    // Red
    high: '#F59E0B',      // Orange
    medium: '#3B82F6',    // Blue
    low: '#6B7280',       // Gray
  },
} as const;

// CSS Variable names for Tailwind
export const cssVars = {
  '--color-primary': colors.primary.blue,
  '--color-primary-dark': colors.primary.dark,
  '--color-primary-light': colors.primary.light,
  '--color-neutral-gray': colors.neutral.gray,
  '--color-neutral-text': colors.neutral.text,
  '--color-neutral-border': colors.neutral.border,
} as const;

// Tailwind class helpers
export const tw = {
  // Backgrounds
  bgPrimary: 'bg-[#0052CC]',
  bgPrimaryDark: 'bg-[#172B4D]',
  bgGray: 'bg-[#F4F5F7]',
  bgWhite: 'bg-white',

  // Text
  textPrimary: 'text-[#0052CC]',
  textDark: 'text-[#172B4D]',
  textGray: 'text-[#42526E]',
  textWhite: 'text-white',

  // Borders
  borderGray: 'border-[#DFE1E6]',
  borderPrimary: 'border-[#0052CC]',

  // Hover states
  hoverBgPrimary: 'hover:bg-[#0052CC]',
  hoverTextPrimary: 'hover:text-[#0052CC]',
  hoverBorderPrimary: 'hover:border-[#0052CC]',
} as const;

export default colors;
