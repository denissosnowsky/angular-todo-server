export const completeConvert = (state: 'complete' | 'uncomplete') => {
  let convertedState: boolean;
  if (state === 'complete') {
    convertedState = true;
  } else if (state === 'uncomplete') {
    convertedState = false;
  }
  return convertedState;
};
