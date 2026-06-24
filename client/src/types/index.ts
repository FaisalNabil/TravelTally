export interface User {
  _id: string;
  googleId: string;
  name: string;
  email: string;
}

export interface Member {
  memberId: string;
  name: string;
  _id?: string;
}

export interface Expense {
  _id: string;
  tour: string;
  paidBy: Member;
  amount: number;
  description: string;
  date: string;
  involvedMembers: Member[];
}

export interface Tour {
  _id: string;
  name: string;
  createdBy: string;
  members: Member[];
  expenses: Expense[] | string[];
  startDate: string;
  endDate?: string | null;
}

export interface Settlement {
  _id: string;
  tour: string;
  fromMember: Member;
  toMember: Member;
  amount: number;
}

export interface IndividualExpenseRecord {
  _id: string;
  tour: string;
  member: Member;
  paid: number;
  shouldHavePaid: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: User;
  verifiedToken: string;
}
