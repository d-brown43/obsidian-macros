import { css } from "styled-components";

export const TEXT_COLOUR = 'var(--text-normal)';
export const OUTLINE_COLOUR = 'var(--interactive-accent)';
export const BACKGROUND_COLOUR = 'var(--background-primary)';
export const BORDER_COLOUR = 'var(--background-secondary-alt)';

export const POPOVER_HEIGHT_REM = 20;
export const POPOVER_WIDTH_REM = 35;

export const CLEVER_TEXT_WRAP = css`
  overflow-wrap: break-word;
  word-wrap: break-word;
  -ms-word-break: break-all;
  word-break: break-word;
  -ms-hyphens: auto;
  -moz-hyphens: auto;
  -webkit-hyphens: auto;
  hyphens: auto;
`;
