import { useEffect, useRef, useState } from "react";

interface UseCountdownOptions {
  deadline: string;
  // The server's clock when the data was built, and when the client received it.
  serverNow: string;
  receivedAt: number;
  onExpire: () => void;
}

// Seconds left until a server deadline, independent of how wrong the user's clock is. Calls onExpire once at zero.
export const useCountdown = ({ deadline, serverNow, receivedAt, onExpire }: UseCountdownOptions): number => {
  const skew = new Date(serverNow).getTime() - receivedAt;
  const end = new Date(deadline).getTime();
  const secondsLeftNow = () => Math.max(0, Math.ceil((end - (Date.now() + skew)) / 1000));

  const [secondsLeft, setSecondsLeft] = useState(secondsLeftNow);
  const onExpireRef = useRef(onExpire);
  const expiredRef = useRef(false);

  useEffect(() => {
    onExpireRef.current = onExpire;
  });

  useEffect(() => {
    const tick = () => setSecondsLeft(secondsLeftNow());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [end, skew]);

  useEffect(() => {
    if (secondsLeft > 0 || expiredRef.current) return;
    expiredRef.current = true;
    onExpireRef.current();
  }, [secondsLeft]);

  return secondsLeft;
};
