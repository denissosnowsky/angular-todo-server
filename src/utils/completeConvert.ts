export const completeConvert = (state: 'complete' | 'uncomplete') => {
  if (state === 'complete') return true;
  if (state === 'uncomplete') return false;
};
