import { PIN_SIZE_MULTIPLIER } from 'src/constants.js';

const calculatePinSize = (pieceSize: number) => {
  return pieceSize * PIN_SIZE_MULTIPLIER;
};

export { calculatePinSize };
