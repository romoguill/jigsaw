import { useEffect } from "react";

import { useState } from "react";

function Timer() {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(time + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [time]);
  return <div className="mx-auto">{time}</div>;
}

export default Timer;
