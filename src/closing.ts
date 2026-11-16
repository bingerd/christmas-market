/** Time left until the market closes, split for display; null once it has closed. */
export type TimeLeft = { days: number; hours: number; minutes: number; seconds: number }

export const timeLeft = (now: Date, closesAt: Date): TimeLeft | null => {
  const ms = closesAt.getTime() - now.getTime()
  if (ms <= 0) return null
  const s = Math.floor(ms / 1000)
  return { days: Math.floor(s / 86400), hours: Math.floor(s / 3600) % 24, minutes: Math.floor(s / 60) % 60, seconds: s % 60 }
}

const pad = (n: number) => String(n).padStart(2, '0')

/** "1d 05:04:03", or "05:04:03" on the last day. */
export const formatTimeLeft = ({ days, hours, minutes, seconds }: TimeLeft) =>
  `${days ? `${days}d ` : ''}${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
