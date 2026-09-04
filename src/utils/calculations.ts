export function emi(principal: number, annualRate: number, tenureMonths: number): number {
  if (tenureMonths <= 0) return 0;
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) return principal / tenureMonths;
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  return (principal * monthlyRate * factor) / (factor - 1);
}

export function totalInterest(principal: number, annualRate: number, tenureMonths: number): number {
  return emi(principal, annualRate, tenureMonths) * tenureMonths - principal;
}

export function aprIncludingFee(
  principal: number,
  annualRate: number,
  tenureMonths: number,
  processingFeePercent: number
): number {
  const fee = (principal * processingFeePercent) / 100;
  const totalPayment = emi(principal, annualRate, tenureMonths) * tenureMonths;
  return bisectAPR(principal + fee, totalPayment / tenureMonths, tenureMonths);
}

function bisectAPR(principal: number, monthlyPayment: number, tenureMonths: number): number {
  let low = 0;
  let high = 100;
  for (let i = 0; i < 100; i++) {
    const mid = (low + high) / 2;
    const monthlyRate = mid / 100 / 12;
    const factor = Math.pow(1 + monthlyRate, tenureMonths);
    const calcEmi = (principal * monthlyRate * factor) / (factor - 1);
    if (calcEmi < monthlyPayment) {
      low = mid;
    } else {
      high = mid;
    }
  }
  return (low + high) / 2;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
