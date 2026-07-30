export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  designation: string;
  joiningDate: string;
  status: 'Active' | 'Onboarding' | 'Terminated';
  workLocation: string;
  panNumber: string;
  uanNumber: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  baseSalary: number; // Annual CTC
  monthlySalary: {
    basic: number;
    hra: number;
    conveyance: number;
    specialAllowance: number;
    pfEmployer: number;
    pfEmployee: number;
    esi: number;
    professionalTax: number;
    grossEarnings: number;
    netPay: number;
  };
  taxRegime: 'Old' | 'New';
  taxDeclarations: TaxDeclaration[];
}

export interface TaxDeclaration {
  id: string;
  category: 'Section 80C' | 'Section 80D' | 'HRA' | 'Other';
  declaredAmount: number;
  approvedAmount: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  proofDocument?: string;
}

export interface PayRun {
  id: string;
  billingMonth: string; // e.g. "July 2026"
  generationDate: string;
  status: 'Draft' | 'Approved' | 'Disbursed';
  totalGrossEarnings: number;
  totalDeductions: number;
  totalNetPay: number;
  totalEmployees: number;
  breakdown: {
    basic: number;
    hra: number;
    allowances: number;
    statutoryDeductions: number;
    otherDeductions: number;
  };
  employeeSalaries: EmployeePayRunDetail[];
}

export interface EmployeePayRunDetail {
  employeeId: string;
  employeeName: string;
  designation: string;
  daysPresent: number;
  grossEarnings: number;
  deductions: number;
  ewaDeduction: number;
  netPay: number;
  paymentStatus: 'Unpaid' | 'Paid';
}

export interface EWARequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  requestDate: string;
  accruedSalary: number; // Salary earned up to today
  requestedAmount: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Disbursed';
  repaymentPayCycle: string; // Month name, e.g., "August 2026"
}

export interface DeductionComponent {
  id: string;
  name: string;
  type: 'Pre-Tax' | 'Post-Tax';
  deductionType: 'Percentage' | 'Flat';
  value: number;
  associatedEmployees: number;
  status: 'Active' | 'Inactive';
}

export interface SalaryComponentSetting {
  id: string;
  name: string;
  category: 'Earnings' | 'Deductions' | 'Reimbursements';
  type: 'Basic' | 'HRA' | 'Conveyance' | 'Special Allowance' | 'Bonus' | 'Custom';
  calculationType: 'Flat' | 'Percentage of Basic' | 'Percentage of CTC';
  value: number;
  isStatutory: boolean;
  status: 'Active' | 'Inactive';
}

export interface StatutorySetting {
  pfEnabled: boolean;
  pfRateEmployer: number; // %
  pfRateEmployee: number; // %
  esiEnabled: boolean;
  esiRateEmployer: number; // %
  esiRateEmployee: number; // %
  ptEnabled: boolean;
  ptSlabs: { minSalary: number; amount: number }[];
}

export interface CompanySetting {
  name: string;
  domain: string;
  registrationNumber: string;
  pan: string;
  tan: string;
  address: string;
  currency: string;
  paySchedule: {
    frequency: 'Monthly' | 'Semi-Monthly' | 'Weekly';
    payoutDay: number; // e.g. 30th of month
    attendanceCutoffDay: number; // e.g. 25th of month
  };
}
