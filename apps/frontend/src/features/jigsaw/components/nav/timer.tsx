import { Button } from "@/frontend/components/ui/button";
import useGameStore from "@/frontend/store/store";
import { PlayIcon, SquareIcon } from "lucide-react";
import { useEffect } from "react";

function Timer() {
  const { timer, setTimer, pauseTimer, resumeTimer, isTimerRunning } =
    useGameStore();

  const parsedTime = new Date(timer * 1000).toISOString().slice(11, 19);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isTimerRunning) {
        setTimer(timer + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, isTimerRunning, setTimer]);

  const handlePlay = () => {
    if (isTimerRunning) {
      pauseTimer();
    } else {
      resumeTimer();
    }
  };

  return (
    <div className="mx-auto font-digital w-20 text-center text-xl flex items-center justify-between gap-3">
      <Button variant="ghost" size="icon" onClick={handlePlay} className="px-2">
        {isTimerRunning ? (
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
