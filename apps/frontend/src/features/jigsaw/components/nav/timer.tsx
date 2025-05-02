import { Button } from "@/frontend/components/ui/button";
import { PlayIcon, SquareIcon, StopCircleIcon } from "lucide-react";
import { useEffect } from "react";

import { useState } from "react";

function Timer() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  const parsedTime = new Date(time * 1000).toISOString().slice(11, 19);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isRunning) {
        setTime(time + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [time, isRunning]);

  const handlePlay = () => {
    setIsRunning((prev) => !prev);
  };

  return (
    <div className="mx-auto font-digital w-20 text-center text-xl flex items-center justify-between gap-3">
      <Button variant="ghost" size="icon" onClick={handlePlay} className="px-2">
        {isRunning ? (
          <SquareIcon size={20} className="text-red-400/80" />
        ) : (
          <PlayIcon size={20} className="text-green-400/80" />
        )}
      </Button>
      <span>{parsedTime}</span>
    </div>
  );
}

export default Timer;
