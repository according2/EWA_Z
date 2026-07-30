import { Employee, PayRun, EWARequest, DeductionComponent, SalaryComponentSetting, StatutorySetting, CompanySetting } from '../types';

export const INITIAL_COMPANY_SETTINGS: CompanySetting = {
  name: "Zylker Technologies Myanmar Co., Ltd.",
  domain: "zylker.com.mm",
  registrationNumber: "MyCO-129384729",
  pan: "TIN-839482910",
  tan: "SSB-REG-0029384",
  address: "Level 18, Junction City Office Tower, Corner of Bogyoke Aung San Road & Shwedagon Pagoda Road, Pabedan Township, Yangon, Myanmar",
  currency: "MMK (Ks)",
  paySchedule: {
    frequency: 'Monthly',
    payoutDay: 30,
    attendanceCutoffDay: 25
  }
};

export const INITIAL_STATUTORY_SETTINGS: StatutorySetting = {
  pfEnabled: true,
  pfRateEmployer: 3, // SSB Employer Contribution is 3%
  pfRateEmployee: 2, // SSB Employee Contribution is 2%
  esiEnabled: false, // SSB covers health
  esiRateEmployer: 0,
  esiRateEmployee: 0,
  ptEnabled: true, // Personal Income Tax (PIT)
  ptSlabs: [
    { minSalary: 0, amount: 0 },
    { minSalary: 300000, amount: 5000 },
    { minSalary: 1000000, amount: 20000 }
  ]
};

export const INITIAL_SALARY_COMPONENTS: SalaryComponentSetting[] = [
  { id: 'sc-1', name: 'Basic Salary', category: 'Earnings', type: 'Basic', calculationType: 'Percentage of CTC', value: 50, isStatutory: true, status: 'Active' },
  { id: 'sc-2', name: 'House Rent Allowance (HRA)', category: 'Earnings', type: 'HRA', calculationType: 'Percentage of Basic', value: 40, isStatutory: true, status: 'Active' },
  { id: 'sc-3', name: 'Conveyance Allowance', category: 'Earnings', type: 'Conveyance', calculationType: 'Flat', value: 100000, isStatutory: false, status: 'Active' },
  { id: 'sc-4', name: 'Special Allowance', category: 'Earnings', type: 'Special Allowance', calculationType: 'Flat', value: 150000, isStatutory: false, status: 'Active' },
  { id: 'sc-5', name: 'Social Security Fund (Employer Contribution)', category: 'Earnings', type: 'Custom', calculationType: 'Percentage of Basic', value: 3, isStatutory: true, status: 'Active' },
  { id: 'sc-6', name: 'Social Security Board (SSB Employee)', category: 'Deductions', type: 'Custom', calculationType: 'Percentage of Basic', value: 2, isStatutory: true, status: 'Active' },
  { id: 'sc-7', name: 'Personal Income Tax (PIT)', category: 'Deductions', type: 'Custom', calculationType: 'Flat', value: 25000, isStatutory: true, status: 'Active' },
  { id: 'sc-8', name: 'Travel Reimbursement', category: 'Reimbursements', type: 'Custom', calculationType: 'Flat', value: 0, isStatutory: false, status: 'Active' }
];

export const INITIAL_DEDUCTION_COMPONENTS: DeductionComponent[] = [
  { id: 'dc-1', name: 'Personal Income Tax (PIT)', type: 'Pre-Tax', deductionType: 'Percentage', value: 5, associatedEmployees: 5, status: 'Active' },
  { id: 'dc-2', name: 'SSB Health Contribution', type: 'Pre-Tax', deductionType: 'Percentage', value: 2, associatedEmployees: 5, status: 'Active' },
  { id: 'dc-3', name: 'Corporate Gym (Yangon Wellness)', type: 'Post-Tax', deductionType: 'Flat', value: 15000, associatedEmployees: 2, status: 'Active' },
  { id: 'dc-4', name: 'Device Purchase Installment (Ks)', type: 'Post-Tax', deductionType: 'Flat', value: 45000, associatedEmployees: 1, status: 'Active' },
  { id: 'dc-5', name: 'Employee Welfare Fund (Yangon HQ)', type: 'Post-Tax', deductionType: 'Flat', value: 1000, associatedEmployees: 5, status: 'Active' }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: "EMP001",
    firstName: "Aung",
    lastName: "Min",
    email: "aung.min@zylker.com.mm",
    department: "Engineering",
    designation: "Senior Software Engineer",
    joiningDate: "2021-06-15",
    status: "Active",
    workLocation: "Yangon (HQ)",
    panNumber: "TIN-928392102",
    uanNumber: "SSB-78392810",
    bankName: "KBZ Bank",
    accountNumber: "02910023456789",
    ifscCode: "KBZBMYMMXXX",
    baseSalary: 21600000, // Annual MMK (1.8 Million Kyat / month)
    monthlySalary: {
      basic: 900000,
      hra: 360000,
      conveyance: 140000,
      specialAllowance: 400000,
      pfEmployer: 9000, // Capped SSB Employer Contribution (3% up to 300,000 MMK max)
      pfEmployee: 6000, // Capped SSB Employee Contribution (2% up to 300,000 MMK max)
      esi: 0,
      professionalTax: 45000, // 2.5% effective withholding PIT
      grossEarnings: 1800000,
      netPay: 1749000 // Gross - Employee SSB (6,000) - PIT (45,000)
    },
    taxRegime: "New",
    taxDeclarations: [
      { id: "td-1", category: "Section 80C", declaredAmount: 1500000, approvedAmount: 1500000, status: "Approved" },
      { id: "td-2", category: "Section 80D", declaredAmount: 250000, approvedAmount: 200000, status: "Approved" }
    ]
  },
  {
    id: "EMP002",
    firstName: "Khin",
    lastName: "Sandar",
    email: "khin.sandar@zylker.com.mm",
    department: "Product Management",
    designation: "Product Lead",
    joiningDate: "2022-03-10",
    status: "Active",
    workLocation: "Yangon (HQ)",
    panNumber: "TIN-839201928",
    uanNumber: "SSB-88301920",
    bankName: "CB Bank",
    accountNumber: "00501001234567",
    ifscCode: "CBBKMYMMXXX",
    baseSalary: 30000000, // Annual MMK (2.5 Million Kyat / month)
    monthlySalary: {
      basic: 1250000,
      hra: 500000,
      conveyance: 150000,
      specialAllowance: 600000,
      pfEmployer: 9000,
      pfEmployee: 6000,
      esi: 0,
      professionalTax: 75000, // 3% effective withholding PIT
      grossEarnings: 2500000,
      netPay: 2419000 // Gross - SSB (6,000) - PIT (75,000)
    },
    taxRegime: "New",
    taxDeclarations: [
      { id: "td-3", category: "Section 80C", declaredAmount: 1500000, approvedAmount: 1200000, status: "Approved" },
      { id: "td-4", category: "HRA", declaredAmount: 1800000, approvedAmount: 0, status: "Pending", proofDocument: "rental_agreement_yangon.pdf" }
    ]
  },
  {
    id: "EMP003",
    firstName: "Thae",
    lastName: "Su Naing",
    email: "thae.sunaing@zylker.com.mm",
    department: "Human Resources",
    designation: "HR Manager",
    joiningDate: "2023-01-20",
    status: "Active",
    workLocation: "Yangon (HQ)",
    panNumber: "TIN-728192012",
    uanNumber: "SSB-92810291",
    bankName: "AYA Bank",
    accountNumber: "30123456789",
    ifscCode: "AYABMYMMXXX",
    baseSalary: 14400000, // Annual MMK (1.2 Million Kyat / month)
    monthlySalary: {
      basic: 600000,
      hra: 240000,
      conveyance: 110000,
      specialAllowance: 250000,
      pfEmployer: 9000,
      pfEmployee: 6000,
      esi: 0,
      professionalTax: 25000,
      grossEarnings: 1200000,
      netPay: 1169000
    },
    taxRegime: "Old",
    taxDeclarations: [
      { id: "td-5", category: "Section 80C", declaredAmount: 1200000, approvedAmount: 0, status: "Pending", proofDocument: "ssb_receipt_2026.pdf" },
      { id: "td-6", category: "Section 80D", declaredAmount: 150000, approvedAmount: 150000, status: "Approved" }
    ]
  },
  {
    id: "EMP004",
    firstName: "Zayar",
    lastName: "Lin",
    email: "zayar.lin@zylker.com.mm",
    department: "Design",
    designation: "UX Designer",
    joiningDate: "2024-11-01",
    status: "Active",
    workLocation: "Mandalay Hub",
    panNumber: "TIN-928102938",
    uanNumber: "SSB-38291029",
    bankName: "Yoma Bank",
    accountNumber: "912010034567890",
    ifscCode: "YOMAMYMMXXX",
    baseSalary: 12000000, // Annual MMK (1.0 Million Kyat / month)
    monthlySalary: {
      basic: 500000,
      hra: 200000,
      conveyance: 100000,
      specialAllowance: 200000,
      pfEmployer: 9000,
      pfEmployee: 6000,
      esi: 0,
      professionalTax: 18000,
      grossEarnings: 1000000,
      netPay: 976000
    },
    taxRegime: "Old",
    taxDeclarations: []
  },
  {
    id: "EMP005",
    firstName: "Htet",
    lastName: "Aung",
    email: "htet.aung@zylker.com.mm",
    department: "Marketing",
    designation: "Marketing Specialist",
    joiningDate: "2025-05-15",
    status: "Active",
    workLocation: "Yangon (HQ)",
    panNumber: "TIN-829102938",
    uanNumber: "SSB-92810294",
    bankName: "KBZ Bank",
    accountNumber: "50100456123456",
    ifscCode: "KBZBMYMMXXX",
    baseSalary: 9600000, // Annual MMK (800,000 Kyat / month)
    monthlySalary: {
      basic: 400000,
      hra: 160000,
      conveyance: 90000,
      specialAllowance: 150000,
      pfEmployer: 9000,
      pfEmployee: 6000,
      esi: 0,
      professionalTax: 12000,
      grossEarnings: 800000,
      netPay: 782000
    },
    taxRegime: "New",
    taxDeclarations: []
  },
  {
    id: "EMP006",
    firstName: "Su",
    lastName: "Myat Noe",
    email: "su.myatnoe@zylker.com.mm",
    department: "Customer Success",
    designation: "Support Associate",
    joiningDate: "2026-07-15",
    status: "Onboarding",
    workLocation: "Yangon (HQ)",
    panNumber: "TIN-382910293",
    uanNumber: "",
    bankName: "AYA Bank",
    accountNumber: "12340200045678",
    ifscCode: "AYABMYMMXXX",
    baseSalary: 6000000, // Annual MMK (500,000 Kyat / month)
    monthlySalary: {
      basic: 250000,
      hra: 100000,
      conveyance: 50000,
      specialAllowance: 100000,
      pfEmployer: 7500, // 3% of 250k Basic
      pfEmployee: 5000, // 2% of 250k Basic
      esi: 0,
      professionalTax: 5000,
      grossEarnings: 500000,
      netPay: 489000
    },
    taxRegime: "New",
    taxDeclarations: []
  }
];

export const INITIAL_EWA_REQUESTS: EWARequest[] = [
  {
    id: "EWA-001",
    employeeId: "EMP001",
    employeeName: "Aung Min",
    department: "Engineering",
    requestDate: "2026-07-20",
    accruedSalary: 1100000, // Worked 20 days
    requestedAmount: 500000,
    status: "Approved",
    repaymentPayCycle: "July 2026"
  },
  {
    id: "EWA-002",
    employeeId: "EMP004",
    employeeName: "Zayar Lin",
    department: "Design",
    requestDate: "2026-07-28",
    accruedSalary: 600000,
    requestedAmount: 250000,
    status: "Pending",
    repaymentPayCycle: "July 2026"
  },
  {
    id: "EWA-003",
    employeeId: "EMP003",
    employeeName: "Thae Su Naing",
    department: "Human Resources",
    requestDate: "2026-06-15",
    accruedSalary: 700000,
    requestedAmount: 300000,
    status: "Disbursed",
    repaymentPayCycle: "June 2026"
  }
];

export const INITIAL_PAY_RUNS: PayRun[] = [
  {
    id: "PR-2026-06",
    billingMonth: "June 2026",
    generationDate: "2026-06-30",
    status: "Disbursed",
    totalGrossEarnings: 7300000,
    totalDeductions: 505000, // Employee SSB + PIT + EWA Deductions
    totalNetPay: 6795000,
    totalEmployees: 5,
    breakdown: {
      basic: 3650000,
      hra: 1460000,
      allowances: 2190000,
      statutoryDeductions: 205000,
      otherDeductions: 300000
    },
    employeeSalaries: [
      { employeeId: "EMP001", employeeName: "Aung Min", designation: "Senior Software Engineer", daysPresent: 30, grossEarnings: 1800000, deductions: 51000, ewaDeduction: 0, netPay: 1749000, paymentStatus: "Paid" },
      { employeeId: "EMP002", employeeName: "Khin Sandar", designation: "Product Lead", daysPresent: 30, grossEarnings: 2500000, deductions: 81000, ewaDeduction: 0, netPay: 2419000, paymentStatus: "Paid" },
      { employeeId: "EMP003", employeeName: "Thae Su Naing", designation: "HR Manager", daysPresent: 30, grossEarnings: 1200000, deductions: 31000, ewaDeduction: 300000, netPay: 869000, paymentStatus: "Paid" }, // EWA deducted
      { employeeId: "EMP004", employeeName: "Zayar Lin", designation: "UX Designer", daysPresent: 30, grossEarnings: 1000000, deductions: 24000, ewaDeduction: 0, netPay: 976000, paymentStatus: "Paid" },
      { employeeId: "EMP005", employeeName: "Htet Aung", designation: "Marketing Specialist", daysPresent: 30, grossEarnings: 800000, deductions: 18000, ewaDeduction: 0, netPay: 782000, paymentStatus: "Paid" }
    ]
  },
  {
    id: "PR-2026-07",
    billingMonth: "July 2026",
    generationDate: "2026-07-28",
    status: "Draft",
    totalGrossEarnings: 7800000,
    totalDeductions: 715000,
    totalNetPay: 7085000,
    totalEmployees: 6,
    breakdown: {
      basic: 3900000,
      hra: 1560000,
      allowances: 2340000,
      statutoryDeductions: 215000,
      otherDeductions: 500000
    },
    employeeSalaries: [
      { employeeId: "EMP001", employeeName: "Aung Min", designation: "Senior Software Engineer", daysPresent: 31, grossEarnings: 1800000, deductions: 51000, ewaDeduction: 500000, netPay: 1249000, paymentStatus: "Unpaid" }, // EWA active
      { employeeId: "EMP002", employeeName: "Khin Sandar", designation: "Product Lead", daysPresent: 31, grossEarnings: 2500000, deductions: 81000, ewaDeduction: 0, netPay: 2419000, paymentStatus: "Unpaid" },
      { employeeId: "EMP003", employeeName: "Thae Su Naing", designation: "HR Manager", daysPresent: 31, grossEarnings: 1200000, deductions: 31000, ewaDeduction: 0, netPay: 1169000, paymentStatus: "Unpaid" },
      { employeeId: "EMP004", employeeName: "Zayar Lin", designation: "UX Designer", daysPresent: 31, grossEarnings: 1000000, deductions: 24000, ewaDeduction: 0, netPay: 976000, paymentStatus: "Unpaid" },
      { employeeId: "EMP005", employeeName: "Htet Aung", designation: "Marketing Specialist", daysPresent: 31, grossEarnings: 800000, deductions: 18000, ewaDeduction: 0, netPay: 782000, paymentStatus: "Unpaid" },
      { employeeId: "EMP006", employeeName: "Su Myat Noe", designation: "Support Associate", daysPresent: 16, grossEarnings: 500000, deductions: 10000, ewaDeduction: 0, netPay: 490000, paymentStatus: "Unpaid" } // Pro-rated for mid-month joining
    ]
  }
];

export const INITIAL_TAX_FILINGS = [
  { id: "TF-1", financialYear: "2026-27", formType: "Patakha(Waga)-15 Monthly PIT Return", dueDate: "2026-07-07", status: "Filed", filingDate: "2026-07-05", acknowledgedBy: "M-IRD-1293847" },
  { id: "TF-2", financialYear: "2026-27", formType: "Patakha(Waga)-16 Annual Salary PIT", dueDate: "2027-04-30", status: "Upcoming", filingDate: "-", acknowledgedBy: "-" },
  { id: "TF-3", financialYear: "2025-26", formType: "Annual Individual Assessment Return", dueDate: "2026-06-30", status: "Generated", filingDate: "2026-06-25", acknowledgedBy: "M-IRD-993812" },
  { id: "TF-4", financialYear: "2026-27", formType: "Monthly SSB contribution", dueDate: "2026-08-15", status: "Pending", filingDate: "-", acknowledgedBy: "-" },
  { id: "TF-5", financialYear: "2026-27", formType: "Municipal Tax (YCDC) Return", dueDate: "2026-09-30", status: "Pending", filingDate: "-", acknowledgedBy: "-" }
];
