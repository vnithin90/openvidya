/**
 * Renders a number in proper scientific notation: 3.12×10¹⁸
 *
 * Why this exists: JavaScript's toExponential() prints "3.12e+18". On a page
 * about charge that is actively harmful, because `e` already means the
 * elementary charge — "3.12e+18 e" asks a 16-year-old to read the same letter
 * as two different things in one expression.
 *
 * Values comfortably inside everyday range are printed plainly instead.
 */
export default function SciNum({
  value,
  sig = 2,
  unit,
}: {
  value: number;
  sig?: number;
  unit?: string;
}) {
  if (!Number.isFinite(value) || value === 0) return <>0{unit ? ` ${unit}` : ''}</>;

  const exp = Math.floor(Math.log10(Math.abs(value)));
  const mant = value / 10 ** exp;

  if (exp >= -2 && exp <= 3) {
    return (
      <>
        {Number(value.toPrecision(sig + 1)).toLocaleString()}
        {unit ? ` ${unit}` : ''}
      </>
    );
  }

  return (
    <>
      {mant.toFixed(sig)}×10<sup>{exp}</sup>
      {unit ? ` ${unit}` : ''}
    </>
  );
}
