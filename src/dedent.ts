export default function dedent(text: string): string {
  let amount = Infinity
  const rx = /[^\r\n]+/g
  let match
  while ((match = rx.exec(text))) {
    const whitespace = /^\s*/.exec(match[0])
    if (whitespace) amount = Math.min(amount, whitespace[0].length)
  }
  return Number.isFinite(amount)
    ? text.replace(/[^\r\n]+/g, line => line.substring(amount))
    : text
}
