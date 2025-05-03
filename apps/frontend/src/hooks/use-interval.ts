import { useEffect, useRef } from "react";

interface UseIntervalProps {
  callback: () => void;
  delay: number;
}

export const useInterval = ({ callback, delay }: UseIntervalProps) => {
  const callbackRef = useRef(callback);

  // Update the callback ref when the callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Set up the interval
  useEffect(() => {
    const id = setInterval(() => callbackRef.current(), delay);

    return () => clearInterval(id);
  }, [delay]);
};
