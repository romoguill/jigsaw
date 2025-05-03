import { useEffect, useRef } from "react";

interface UseIntervalProps {
  callback: () => void;
  delay: number;
  disabled?: boolean;
}

export const useInterval = ({
  callback,
  delay,
  disabled = false,
}: UseIntervalProps) => {
  const callbackRef = useRef(callback);

  // Update the callback ref when the callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Set up the interval
  useEffect(() => {
    if (disabled) return;

    const id = setInterval(() => callbackRef.current(), delay);

    return () => clearInterval(id);
  }, [delay, disabled]);
};
