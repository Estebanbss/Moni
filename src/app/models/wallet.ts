export class Wallet {
  user?: string | null;
  daysPerWeek?: number;
  hoursPerDay?: number;
  minimumWage?: number;
  discountDays?: number;
  amount?: number;
  lastmonts?: { date: string, amount: number }[] = [];
}
