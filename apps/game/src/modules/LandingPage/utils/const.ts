export const ACCORDION_VALUE = {
  HOW_TO_PLAY: 'howToPlay',
  HOW_TO_WIN: 'howToWin',
  PRIZE_POOL: 'prizePool',
};

export const MAX_TICKET = 16;
export const MIN_TICKET = 0;

export const MIN_ROUND = 1;

export const slideAnimation = {
  initial: { x: 300, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -300, opacity: 0 },
  transition: { duration: 0.15 },
};
