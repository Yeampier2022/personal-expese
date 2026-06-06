export type TransactionProps = {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  isExpense: boolean;
};

export class Transaction implements TransactionProps {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  isExpense: boolean;

  constructor(props: TransactionProps) {
    this.id = props.id;
    this.title = props.title;
    this.category = props.category;
    this.amount = props.amount;
    this.date = props.date;
    this.isExpense = props.isExpense;
  }

  get formattedAmount(): string {
    return `${this.isExpense ? '-' : '+'}$${Math.abs(this.amount).toFixed(2)}`;
  }

  get transactionType(): string {
    return this.isExpense ? 'Expense' : 'Income';
  }

  validate(): void {
    if (!this.title.trim()) {
      throw new Error('Transaction title is required.');
    }

    if (!this.category.trim()) {
      throw new Error('Transaction category is required.');
    }

    if (!Number.isFinite(this.amount)) {
      throw new Error('Transaction amount must be a valid number.');
    }

    if (this.amount === 0) {
      throw new Error('Transaction amount cannot be zero.');
    }

    if (!this.date.trim()) {
      throw new Error('Transaction date is required.');
    }
  }

  toJSON(): TransactionProps {
    return {
      id: this.id,
      title: this.title,
      category: this.category,
      amount: this.amount,
      date: this.date,
      isExpense: this.isExpense,
    };
  }

  static fromJSON(data: TransactionProps): Transaction {
    return new Transaction(data);
  }
}
