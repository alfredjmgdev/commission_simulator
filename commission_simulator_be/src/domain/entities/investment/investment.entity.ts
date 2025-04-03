export class Investment {
  constructor(
    public readonly initialAmount: number,
    public readonly period: number,
    public readonly interestType: 'simple' | 'compound',
  ) {}

  static getMonthlyRate(period: number): number {
    switch (period) {
      case 3:
        return 0.01; // 1%
      case 6:
        return 0.02; // 2%
      case 9:
        return 0.03; // 3%
      case 12:
        return 0.04; // 4%
      default:
        throw new Error('Invalid period');
    }
  }

  static calculateFeePercentage(amount: number): number {
    if (amount <= 1000) return 0.02; // 2%
    if (amount <= 10000) return 0.01; // 1%
    if (amount <= 35000) return 0.005; // 0.5%
    return 0.0025; // 0.25%
  }
}
