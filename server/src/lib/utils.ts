import { PIN_SIZE_MULTIPLIER } from '../constants.js';

export const calculatePinSize = (pieceSize: number) => {
  return pieceSize * PIN_SIZE_MULTIPLIER;
};

// When rotating and other vector operations, +0 and -0 can break testing. This function will return 0 for both.
export const normilize0 = (value: number) => {
  return value === 0 ? 0 : value;
};
