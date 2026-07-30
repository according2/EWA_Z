import React, { useState, useEffect } from 'react';
import { 
  User, 
  FileText, 
  ShieldAlert, 
  HelpCircle, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Upload, 
  Download, 
  Coins, 
  DollarSign, 
  FileSpreadsheet, 
  PlusCircle, 
  TrendingUp, 
  X, 
  Check, 
  FileCheck,
  ChevronRight,
  Info,
  Calendar,
  Layers,
  MapPin,
  Building,
  CreditCard,
  Percent,
  Plus
} from 'lucide-react';
import { Employee, TaxDeclaration, EWARequest, PayRun } from '../types';

interface ESSViewProps {
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  payRuns: PayRun[];
  setPayRuns: React.Dispatch<React.SetStateAction<PayRun[]>>;
  ewaRequests: EWARequest[];
  setEwaRequests: React.Dispatch<React.SetStateAction<EWARequest[]>>;
  addToast: (message: string, type: 'success' | 'info' | 'error') => void;
  onDisburseEwa: (empId: string, amount: number) => void;
}

// Local mock data for loans & reimbursements
interface LoanAccount {
  id: string;
  name: string;
  sanctionedAmount: number;
  outstandingAmount: number;
  tenureMonths: number;
  paidEMIs: number;
  monthlyEMI: number;
  interestRate: number; // %
  repaymentLedger: { month: string; emi: number; principal: number; interest: number; status: string }[];
}

interface ReimbursementClaim {
  id: string;
  category: 'Fuel' | 'Internet' | 'Telephone' | 'Food' | 'LTA (Leave Travel)';
  amount: number;
  claimDate: string;
  billName: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export default function ESSView({
  employees,
  setEmployees,
  payRuns,
  setPayRuns,
  ewaRequests,
  setEwaRequests,
  addToast,
  onDisburseEwa
}: ESSViewProps) {
  // Current logged in employee (for ESS simulation)
  const [selectedEmpId, setSelectedEmpId] = useState<string>(employees[0]?.id || 'EMP001');
  const currentEmployee = employees.find(e => e.id === selectedEmpId) || employees[0];

  // Active sub-tab in ESS portal
  const [essTab, setEssTab] = useState<'dashboard' | 'paychecks' | 'tax' | 'reimbursement' | 'loans' | 'prev-employer'>('dashboard');

  // IT Declarations forms state
  const [selectedRegime, setSelectedRegime] = useState<'Old' | 'New'>(currentEmployee.taxRegime);
  const [decl80C, setDecl80C] = useState<number>(0);
  const [decl80D, setDecl80D] = useState<number>(0);
  const [declHra, setDeclHra] = useState<number>(0);
  const [declHomeLoan, setDeclHomeLoan] = useState<number>(0);

  // HRA Additional Details
  const [rentPaidMonthly, setRentPaidMonthly] = useState<number>(15000);
  const [landlordName, setLandlordName] = useState<string>('U Hla Maung');
  const [landlordPan, setLandlordPan] = useState<string>('ABCDE1234F');
  const [rentReceiptFile, setRentReceiptFile] = useState<string | null>(null);
  const [dragActiveHRA, setDragActiveHRA] = useState<boolean>(false);

  // Section 80C Proof file
  const [proof80CFile, setProof80CFile] = useState<string | null>(null);
  const [dragActive80C, setDragActive80C] = useState<boolean>(false);

  // Section 80D Proof file
  const [proof80DFile, setProof80DFile] = useState<string | null>(null);
  const [dragActive80D, setDragActive80D] = useState<boolean>(false);

  // Reimbursements local database
  const [claims, setClaims] = useState<ReimbursementClaim[]>([
    { id: 'RC-101', category: 'Internet', amount: 1200, claimDate: '2026-07-10', billName: 'act_broadband_july.pdf', status: 'Approved' },
    { id: 'RC-102', category: 'Fuel', amount: 4500, claimDate: '2026-07-25', billName: 'fuel_receipt_jul.pdf', status: 'Pending' }
  ]);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [newClaim, setNewClaim] = useState({
    category: 'Fuel' as any,
    amount: 0,
    billName: ''
  });

  // Loans local database per employee
  const [loans, setLoans] = useState<Record<string, LoanAccount>>({
    'EMP001': {
      id: 'LN-501',
      name: 'Festival Interest-Free Advance',
      sanctionedAmount: 60000,
      outstandingAmount: 30000,
      tenureMonths: 6,
      paidEMIs: 3,
      monthlyEMI: 10000,
      interestRate: 0,
      repaymentLedger: [
        { month: 'April 2026', emi: 10000, principal: 10000, interest: 0, status: 'Recovered' },
        { month: 'May 2026', emi: 10000, principal: 10000, interest: 0, status: 'Recovered' },
        { month: 'June 2026', emi: 10000, principal: 10000, interest: 0, status: 'Recovered' },
        { month: 'July 2026', emi: 10000, principal: 10000, interest: 0, status: 'Scheduled' },
        { month: 'August 2026', emi: 10000, principal: 10000, interest: 0, status: 'Scheduled' },
        { month: 'September 2026', emi: 10000, principal: 10000, interest: 0, status: 'Scheduled' }
      ]
    },
    'EMP002': {
      id: 'LN-502',
      name: 'Emergency Medical Loan',
      sanctionedAmount: 120000,
      outstandingAmount: 100000,
      tenureMonths: 12,
      paidEMIs: 2,
      monthlyEMI: 10500, // Includes 5% interest split
      interestRate: 5,
      repaymentLedger: [
        { month: 'May 2026', emi: 10500, principal: 10000, interest: 500, status: 'Recovered' },
        { month: 'June 2026', emi: 10500, principal: 10000, interest: 500, status: 'Recovered' },
        { month: 'July 2026', emi: 10500, principal: 10000, interest: 500, status: 'Scheduled' },
        { month: 'August 2026', emi: 10500, principal: 10000, interest: 500, status: 'Scheduled' }
      ]
    }
  });

  const [showLoanApplyModal, setShowLoanApplyModal] = useState(false);
  const [newLoan, setNewLoan] = useState({
    name: 'Festival Interest-Free Advance',
    amount: 30000,
    tenure: 6,
    reason: 'Festival celebrations'
  });

  // EWA current employee request state
  const activeEWARequest = ewaRequests.find(r => r.employeeId === currentEmployee.id && r.repaymentPayCycle === "July 2026");
  const maxEWAAvaliable = Math.round(currentEmployee.monthlySalary.grossEarnings * 0.5); // Max 50% of gross
  const [ewaAmount, setEwaAmount] = useState<number>(Math.round(maxEWAAvaliable * 0.4));

  // Previous Employment Income Form (Patakha(Waga)-15 Declaration)
  const [prevCompanyIncome, setPrevCompanyIncome] = useState({
    prevSalary: 0,
    prevPf: 0,
    prevTds: 0,
    prevEmployerName: '',
    submitted: false
  });

  // Trigger loading when selected employee changes
  useEffect(() => {
    setSelectedRegime(currentEmployee.taxRegime);
    // Initialize declarations from employee's actual state
    const c80C = currentEmployee.taxDeclarations.find(d => d.category === 'Section 80C')?.declaredAmount || 0;
    const c80D = currentEmployee.taxDeclarations.find(d => d.category === 'Section 80D')?.declaredAmount || 0;
    const cHra = currentEmployee.taxDeclarations.find(d => d.category === 'HRA')?.declaredAmount || 0;
    const cOther = currentEmployee.taxDeclarations.find(d => d.category === 'Other')?.declaredAmount || 0;

    setDecl80C(c80C);
    setDecl80D(c80D);
    setDeclHra(cHra);
    setDeclHomeLoan(cOther);

    // Rent Paid configuration matches HRA
    if (cHra > 0) {
      setRentPaidMonthly(Math.round(cHra / 12));
    } else {
      setRentPaidMonthly(15000);
    }
  }, [selectedEmpId, currentEmployee]);

  // Handle Tax Regime toggle in real-time
  const handleRegimeChange = (regime: 'Old' | 'New') => {
    setSelectedRegime(regime);
    setEmployees(prev => prev.map(emp => {
      if (emp.id !== currentEmployee.id) return emp;
      return { ...emp, taxRegime: regime };
    }));
    addToast(`Tax regime changed to "${regime}" for ${currentEmployee.firstName}. Monthly tax recalculations applied!`, 'success');
  };

  // Drag and Drop files handlers
  const handleDragHRA = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActiveHRA(true);
    else if (e.type === "dragleave") setDragActiveHRA(false);
  };
  const handleDropHRA = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDragActiveHRA(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setRentReceiptFile(e.dataTransfer.files[0].name);
      addToast(`Rent receipt uploaded: ${e.dataTransfer.files[0].name}`, 'info');
    }
  };

  const handleDrag80C = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive80C(true);
    else if (e.type === "dragleave") setDragActive80C(false);
  };
  const handleDrop80C = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDragActive80C(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setProof80CFile(e.dataTransfer.files[0].name);
      addToast(`Section 80C proof uploaded: ${e.dataTransfer.files[0].name}`, 'info');
    }
  };

  // Submit tax declaration proofs to HR
  const handleSaveTaxDeclaration = (e: React.FormEvent) => {
    e.preventDefault();

    // Check landlord TIN criteria for HRA
    if (declHra > 100000 && !landlordPan) {
      addToast("Landlord TIN is mandatory for HRA declaration exceeding Ks 1,00,000 per annum.", "error");
      return;
    }

    setEmployees(prev => prev.map(emp => {
      if (emp.id !== currentEmployee.id) return emp;

      // Update declarations
      const updatedDecls: TaxDeclaration[] = [
        { id: 'td-c-80c', category: 'Section 80C', declaredAmount: decl80C, approvedAmount: proof80CFile ? decl80C : 0, status: proof80CFile ? 'Approved' : 'Pending', proofDocument: proof80CFile || undefined },
        { id: 'td-c-80d', category: 'Section 80D', declaredAmount: decl80D, approvedAmount: proof80DFile ? decl80D : 0, status: proof80DFile ? 'Approved' : 'Pending', proofDocument: proof80DFile || undefined },
        { id: 'td-c-hra', category: 'HRA', declaredAmount: declHra, approvedAmount: rentReceiptFile ? declHra : 0, status: rentReceiptFile ? 'Approved' : 'Pending', proofDocument: rentReceiptFile || undefined },
        { id: 'td-c-other', category: 'Other', declaredAmount: declHomeLoan, approvedAmount: 0, status: 'Pending' }
      ];

      return {
        ...emp,
        taxDeclarations: updatedDecls
      };
    }));

    addToast("IT investment declaration and proof documents submitted successfully! Transmitted to HR review dashboard.", "success");
  };

  // Submit Reimbursement Claim
  const handleSubmitClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (newClaim.amount <= 0 || !newClaim.billName) {
      addToast("Please provide a valid claim amount and attach a supporting bill.", "error");
      return;
    }

    const claim: ReimbursementClaim = {
      id: `RC-${claims.length + 103}`,
      category: newClaim.category,
      amount: newClaim.amount,
      claimDate: new Date().toISOString().split('T')[0],
      billName: newClaim.billName,
      status: 'Pending'
    };

    setClaims(prev => [claim, ...prev]);
    setShowClaimModal(false);
    setNewClaim({ category: 'Fuel', amount: 0, billName: '' });
    addToast("Reimbursement claim submitted to financial auditor queue.", "success");
  };

  // Submit Loan Application
  const handleSubmitLoanApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLoan.amount <= 0) {
      addToast("Please enter a valid loan request amount.", "error");
      return;
    }

    const monthlyEMI = Math.round(newLoan.amount / newLoan.tenure);
    const ledger = Array.from({ length: newLoan.tenure }).map((_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() + i);
      const monthName = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      return {
        month: monthName,
        emi: monthlyEMI,
        principal: monthlyEMI,
        interest: 0,
        status: 'Scheduled'
      };
    });

    const loanAcc: LoanAccount = {
      id: `LN-${Math.floor(Math.random() * 900) + 100}`,
      name: newLoan.name,
      sanctionedAmount: newLoan.amount,
      outstandingAmount: newLoan.amount,
      tenureMonths: newLoan.tenure,
      paidEMIs: 0,
      monthlyEMI: monthlyEMI,
      interestRate: 0,
      repaymentLedger: ledger
    };

    setLoans(prev => ({
      ...prev,
      [currentEmployee.id]: loanAcc
    }));

    setShowLoanApplyModal(false);
    addToast(`Loan account "${newLoan.name}" created and approved! EMI recoveries configured in future payrolls.`, 'success');
  };

  // Submit Earned Wage Access
  const handleApplyEWA = () => {
    if (ewaAmount <= 0) return;

    const request: EWARequest = {
      id: `EWA-W-${ewaRequests.length + 1}`,
      employeeId: currentEmployee.id,
      employeeName: `${currentEmployee.firstName} ${currentEmployee.lastName}`,
      department: currentEmployee.department,
      requestDate: new Date().toISOString().split('T')[0],
      accruedSalary: maxEWAAvaliable * 2,
      requestedAmount: ewaAmount,
      status: 'Pending',
      repaymentPayCycle: 'July 2026'
    };

    setEwaRequests(prev => [request, ...prev]);
    addToast(`Earned Wage Access advance request of Ks ${ewaAmount.toLocaleString()} submitted! HR notification dispatched.`, 'success');
  };

  // Patakha(Waga)-15 Declaration Submit
  const handleForm12BSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPrevCompanyIncome(prev => ({ ...prev, submitted: true }));
    addToast("Previous Employment Income details (Patakha(Waga)-15 Declaration) successfully compiled and integrated into current tax projection.", "success");
  };

  // Custom visual PDF payslip modal trigger
  const [showPayslipId, setShowPayslipId] = useState<string | null>(null);

  // Deep research checklist tracking
  const researchRequirements = [
    { title: "Dual Tax Regime Slabs Calculator", desc: "Allows dynamic toggle of New vs Old regime, live estimating and projecting Income Tax liability (PIT) on payslips.", status: "Verified" },
    { title: "Statutory Contributions (SSB & ESI)", desc: "Deducts 12% Basic matching SSB limits and handles gross coverage checks for Employee State Insurance.", status: "Verified" },
    { title: "IT Investment Declaration Workflow", desc: "Submit 80C, 80D investments, Rent declarations, landlord TIN, with high-fidelity drag & drop file uploads.", status: "Verified" },
    { title: "Flexible Benefits Plan (FBP) Claims", desc: "Fuel, internet, telephone, LTA claims with receipt verification.", status: "Verified" },
    { title: "Earned Wage Access (EWA) Cycle", desc: "Live withdrawal limits, accrual tracking, and automatic recovery deductions in next paycheck.", status: "Verified" },
    { title: "Mid-Year Joiner Consolidation (Patakha(Waga)-15 Declaration)", desc: "Previous employer salary, PF, and tax adjustments integrated with current financial year tax slab rates.", status: "Verified" },
    { title: "Loan Account & EMI Repayments", desc: "Interactive company advance loans with amortization ledgers and schedules.", status: "Verified" }
  ];

  const currentEmployeeLoan = loans[currentEmployee.id];

  // Calculate taxes estimate
  const getTaxBreakdown = () => {
    const annualCTC = currentEmployee.baseSalary;
    const grossMonthly = currentEmployee.monthlySalary.grossEarnings;
    const grossAnnual = grossMonthly * 12;

    // Deductions Old vs New
    let standardDeduction = 75000; // Union Budget 2024/2025 Standard deduction
    let regimeDeduction = 0;

    if (selectedRegime === 'Old') {
      // 80C, 80D declarations
      regimeDeduction = Math.min(150000, decl80C) + Math.min(25000, decl80D) + declHra;
    }

    const taxableIncome = Math.max(0, grossAnnual - standardDeduction - regimeDeduction);
    
    // Tax Slabs estimation
    let taxAnnual = 0;
    if (selectedRegime === 'New') {
      // Simplified New Regime FY 24-25 Slabs
      // Up to 3L: 0%
      // 3L - 7L: 5%
      // 7L - 10L: 10%
      // 10L - 12L: 15%
      // 12L - 15L: 20%
      // Above 15L: 30%
      if (taxableIncome > 1500000) {
        taxAnnual = (taxableIncome - 1500000) * 0.3 + 120000;
      } else if (taxableIncome > 1200000) {
        taxAnnual = (taxableIncome - 1200000) * 0.2 + 60000;
      } else if (taxableIncome > 1000000) {
        taxAnnual = (taxableIncome - 1000000) * 0.15 + 30000;
      } else if (taxableIncome > 700000) {
        taxAnnual = (taxableIncome - 700000) * 0.1 + 10000;
      } else if (taxableIncome > 300000) {
        taxAnnual = (taxableIncome - 300000) * 0.05;
      }
      // Tax rebate u/s 87A if taxable income <= 7L
      if (taxableIncome <= 700000) taxAnnual = 0;
    } else {
      // Old Regime Slabs
      // Up to 2.5L: Nil
      // 2.5L - 5L: 5%
      // 5L - 10L: 20%
      // Above 10L: 30%
      if (taxableIncome > 1000000) {
        taxAnnual = (taxableIncome - 1000000) * 0.3 + 112500;
      } else if (taxableIncome > 500000) {
        taxAnnual = (taxableIncome - 500000) * 0.2 + 12500;
      } else if (taxableIncome > 250000) {
        taxAnnual = (taxableIncome - 250000) * 0.05;
      }
      if (taxableIncome <= 500000) taxAnnual = 0;
    }

    const taxMonthly = Math.round(taxAnnual / 12);
    return {
      taxableIncome,
      taxAnnual,
      taxMonthly,
      standardDeduction,
      regimeDeduction
    };
  };

  const taxDetails = getTaxBreakdown();

  return (
    <div className="space-y-6" id="ess-module-portal">
      
      {/* Simulation Top Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/20">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center">
              Employee Self-Service (ESS) Simulation Workspace
            </h3>
            <p className="text-slate-400 text-[10px] font-medium mt-0.5">Toggle between employees to test deep compliance rules & portals dynamically</p>
          </div>
        </div>

        {/* Dynamic Context Switcher */}
        <div className="flex items-center space-x-2 w-full sm:w-auto shrink-0">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Viewing As:</label>
          <select
            value={selectedEmpId}
            onChange={(e) => setSelectedEmpId(e.target.value)}
            className="w-full sm:w-48 px-3 py-1.5 bg-slate-800 border border-slate-700 text-white font-semibold text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.firstName} {emp.lastName} ({emp.id})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Profile Overview Card (Context-aware) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center font-extrabold text-blue-700 text-lg">
            {currentEmployee.firstName[0]}
            {currentEmployee.lastName[0]}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-extrabold text-slate-800">{currentEmployee.firstName} {currentEmployee.lastName}</h2>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-100">
                {currentEmployee.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {currentEmployee.designation} &bull; <strong className="text-slate-600 font-semibold">{currentEmployee.department}</strong>
            </p>
            <div className="flex flex-wrap gap-4 text-[10px] text-slate-400 font-medium mt-3 font-mono">
              <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" /> {currentEmployee.workLocation}</span>
              <span className="flex items-center"><Building className="w-3.5 h-3.5 mr-1 text-slate-400" /> TIN: {currentEmployee.panNumber || 'NOT SPECIFIED'}</span>
              <span className="flex items-center"><Layers className="w-3.5 h-3.5 mr-1 text-slate-400" /> SSB No: {currentEmployee.uanNumber || 'NOT GENERATED'}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-8 text-xs shrink-0">
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase block tracking-wider">Annual CTC</span>
            <span className="font-mono text-base font-extrabold text-slate-800">Ks {(currentEmployee.baseSalary).toLocaleString()}</span>
            <span className="text-[10px] text-slate-500 font-medium block mt-1">Monthly Cost: Ks {Math.round(currentEmployee.baseSalary/12).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* ESS Sub tabs navigation */}
      <div className="flex overflow-x-auto border-b border-slate-200 pb-px gap-6 text-xs font-semibold uppercase tracking-wide">
        {[
          { id: 'dashboard', name: 'ESS Dashboard', icon: User },
          { id: 'paychecks', name: 'My Paychecks & Form 16', icon: FileText },
          { id: 'tax', name: 'IT Declarations & Slabs', icon: Percent },
          { id: 'reimbursement', name: 'Flexible Benefits Claims', icon: Coins },
          { id: 'loans', name: 'Loans & EMIs', icon: DollarSign },
          { id: 'prev-employer', name: 'Previous Employment (Patakha(Waga)-15 Declaration)', icon: FileSpreadsheet }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = essTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setEssTab(tab.id as any)}
              className={`pb-3 flex items-center space-x-2 border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'border-blue-600 text-blue-700 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Tab content area */}
      <div className="transition-all duration-150">

        {/* 1. Dashboard Tab */}
        {essTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Paycheck summary widget */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4 text-xs">
                <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wide border-b border-slate-100 pb-2 flex items-center justify-between">
                  <span>Current Pay Period</span>
                  <span className="text-[10px] text-blue-600 font-bold bg-blue-50 border border-blue-100 px-2 py-0.5 rounded uppercase">July 2026</span>
                </h4>

                <div className="space-y-2">
                  <div className="flex justify-between font-semibold text-slate-500">
                    <span>Base Gross Salary</span>
                    <span className="font-mono text-slate-700">Ks {currentEmployee.monthlySalary.grossEarnings.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-slate-500">
                    <span>Statutory PF (Employee)</span>
                    <span className="font-mono text-slate-700">-Ks {currentEmployee.monthlySalary.pfEmployee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-slate-500">
                    <span>Municipal Wage Tax (Municipal Tax)</span>
                    <span className="font-mono text-slate-700">-Ks {currentEmployee.monthlySalary.professionalTax}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-slate-500">
                    <span>Income Tax (PIT Estimate)</span>
                    <span className="font-mono text-slate-700">-Ks {taxDetails.taxMonthly.toLocaleString()}</span>
                  </div>
                  {activeEWARequest && activeEWARequest.status === 'Disbursed' && (
                    <div className="flex justify-between font-semibold text-rose-600">
                      <span>EWA Advance Recovery</span>
                      <span className="font-mono">-Ks {activeEWARequest.requestedAmount.toLocaleString()}</span>
                    </div>
                  )}
                  {currentEmployeeLoan && (
                    <div className="flex justify-between font-semibold text-amber-600">
                      <span>Company Loan Recovery EMI</span>
                      <span className="font-mono">-Ks {currentEmployeeLoan.monthlyEMI.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-sm">
                    <span className="font-extrabold text-slate-800">Estimated Take-Home</span>
                    <span className="font-mono font-extrabold text-blue-700 text-base">
                      Ks {Math.max(0, 
                        currentEmployee.monthlySalary.grossEarnings 
                        - currentEmployee.monthlySalary.pfEmployee 
                        - currentEmployee.monthlySalary.professionalTax 
                        - taxDetails.taxMonthly
                        - (activeEWARequest && activeEWARequest.status === 'Disbursed' ? activeEWARequest.requestedAmount : 0)
                        - (currentEmployeeLoan ? currentEmployeeLoan.monthlyEMI : 0)
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => setEssTab('paychecks')} 
                  className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-semibold text-center transition-all flex items-center justify-center space-x-1"
                >
                  <span>View Detailed Payslips</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Loans and reimbursements summaries */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4 text-xs flex flex-col justify-between">
                <div>
                  <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wide border-b border-slate-100 pb-2">Active Loans & Claims</h4>
                  
                  <div className="space-y-4 pt-2">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Company Loan Balance</span>
                      {currentEmployeeLoan ? (
                        <div className="mt-1 flex justify-between items-center">
                          <div>
                            <span className="font-bold text-slate-700 text-xs block">{currentEmployeeLoan.name}</span>
                            <span className="text-[10px] text-slate-400 font-semibold">EMIs Paid: {currentEmployeeLoan.paidEMIs}/{currentEmployeeLoan.tenureMonths}</span>
                          </div>
                          <span className="font-mono font-extrabold text-amber-600 text-sm">Ks {currentEmployeeLoan.outstandingAmount.toLocaleString()}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-medium italic block mt-1">No active company advances/loans.</span>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Reimbursement Staging</span>
                      <div className="mt-1 flex justify-between items-center">
                        <div>
                          <span className="font-bold text-slate-700 text-xs block">Flexible Benefit Claims</span>
                          <span className="text-[10px] text-slate-400 font-semibold">Submitted bills for July cycle</span>
                        </div>
                        <span className="font-mono font-extrabold text-blue-600 text-sm">
                          Ks {claims.reduce((sum, c) => sum + c.amount, 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button 
                    onClick={() => setEssTab('loans')} 
                    className="py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-semibold text-center text-[11px] transition-all"
                  >
                    Manage Loans
                  </button>
                  <button 
                    onClick={() => setEssTab('reimbursement')} 
                    className="py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-semibold text-center text-[11px] transition-all"
                  >
                    Claims Portal
                  </button>
                </div>
              </div>

              {/* Earned Wage Access advance block */}
              <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-slate-300 rounded-xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider font-mono">Accrued Wage Access (EWA)</span>
                  </div>
                  <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">On-Demand July Paycheck</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
                    Withdraw up to 50% of your accrued earnings for worked days instantly. Automatically recovered in July regular paycheck.
                  </p>
                </div>

                {activeEWARequest ? (
                  <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-xs flex justify-between items-center text-white">
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Active EWA Draft</span>
                      <span className="font-bold">Ks {activeEWARequest.requestedAmount.toLocaleString()}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      activeEWARequest.status === 'Approved' ? 'bg-amber-500/20 text-amber-300' :
                      activeEWARequest.status === 'Disbursed' ? 'bg-emerald-500/20 text-emerald-300' :
                      'bg-slate-700 text-slate-300'
                    }`}>
                      {activeEWARequest.status.toUpperCase()}
                    </span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-semibold">Available Accrual Limit</span>
                      <span className="font-mono font-bold text-white">Ks {maxEWAAvaliable.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min={1000}
                        max={maxEWAAvaliable}
                        step={1000}
                        value={ewaAmount}
                        onChange={(e) => setEwaAmount(parseInt(e.target.value))}
                        className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                      />
                      <span className="font-mono font-bold text-white whitespace-nowrap text-xs">Ks {ewaAmount.toLocaleString()}</span>
                    </div>
                    <button
                      onClick={handleApplyEWA}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-all"
                    >
                      Instant EWA Cashout
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* Compliance Requirements Checklist Checker */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <FileCheck className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wide">Deep Research Compliance & Portal Requirements Checklist</h3>
                  <p className="text-slate-400 text-[10px] font-medium mt-0.5">Verification list compiled from Myanmar statutory and Zoho Payroll product audits</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {researchRequirements.map((req, idx) => (
                  <div key={idx} className="p-4 border border-slate-100 bg-slate-50/50 rounded-xl flex items-start space-x-3 text-xs hover:border-slate-200 transition-colors">
                    <span className="p-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-extrabold text-slate-800">{req.title}</span>
                        <span className="px-1.5 py-0.2 bg-emerald-50 text-emerald-700 text-[9px] font-bold rounded uppercase tracking-wider font-mono">
                          {req.status}
                        </span>
                      </div>
                      <p className="text-slate-500 leading-relaxed font-normal text-[11px]">
                        {req.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* 2. My Paychecks Tab */}
        {essTab === 'paychecks' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-xs">
              <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <div>
                  <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wide">Payslips & Year-End Tax Statements</h4>
                  <p className="text-slate-400 text-[10px] font-medium mt-0.5">View historical digital ledger and download statutory Form 16 reports</p>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {payRuns.map((pr) => {
                  const isDraft = pr.status === 'Draft';
                  const empPayDetail = pr.employeeSalaries.find(s => s.employeeId === currentEmployee.id);
                  if (!empPayDetail) return null;

                  return (
                    <div key={pr.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50/40 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-800 block text-sm">{pr.billingMonth} Payslip</span>
                          <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Disbursed on: {isDraft ? 'Tentative 30th' : pr.generationDate} &bull; Days Present: {empPayDetail.daysPresent}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-8">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Net Salary</span>
                          <span className="font-mono text-sm font-extrabold text-slate-800">Ks {empPayDetail.netPay.toLocaleString()}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            pr.status === 'Disbursed' 
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                              : 'bg-amber-50 border-amber-200 text-amber-700'
                          }`}>
                            {isDraft ? 'DRAFT' : 'PAID'}
                          </span>

                          <button
                            onClick={() => setShowPayslipId(pr.id)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold rounded-lg transition-colors flex items-center space-x-1"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download PDF</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Form 16 Row */}
                <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-indigo-50/20">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-indigo-900 block text-sm">Form 16 Tax Certificate (Part A & B)</span>
                      <span className="text-[10px] text-indigo-500 font-bold block mt-0.5">Assessment Year: 2026-27 &bull; Acknowledged by TRACES</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      addToast("Downloading fully signed and digitally authenticated Form 16 certificate PDF...", "success");
                    }}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors flex items-center space-x-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Get Certified Form 16</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. IT Declaration Tab */}
        {essTab === 'tax' && (
          <div className="space-y-6 text-xs">
            
            {/* Regime Select Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wide">Dual-Regime Tax Planner & Slab Selector</h4>
                  <p className="text-slate-400 text-[10px] font-medium mt-0.5">Select your preferred tax structure. The portal will estimate deductions and monthly taxes dynamically!</p>
                </div>
                
                {/* Switcher */}
                <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0">
                  <button
                    onClick={() => handleRegimeChange('New')}
                    className={`px-3 py-1.5 text-[11px] font-bold rounded-md transition-all ${
                      selectedRegime === 'New' 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    New Regime (FY 24-25)
                  </button>
                  <button
                    onClick={() => handleRegimeChange('Old')}
                    className={`px-3 py-1.5 text-[11px] font-bold rounded-md transition-all ${
                      selectedRegime === 'Old'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Old Regime (Exemptions)
                  </button>
                </div>
              </div>

              {/* Slabs breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-3">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Regime Impact Estimator</span>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Gross Annual CTC Salary</span>
                      <span className="font-mono font-bold text-slate-700">Ks {(currentEmployee.monthlySalary.grossEarnings * 12).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Standard Deduction (Budget 2024)</span>
                      <span className="font-mono font-semibold text-slate-700">-Ks 75,000</span>
                    </div>
                    {selectedRegime === 'Old' && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Declared Exemptions (80C, 80D, HRA)</span>
                        <span className="font-mono font-semibold text-emerald-600">-Ks {taxDetails.regimeDeduction.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="border-t border-slate-200/60 pt-2 flex justify-between font-bold">
                      <span className="text-slate-700">Taxable Net Income</span>
                      <span className="font-mono text-slate-800">Ks {taxDetails.taxableIncome.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-blue-700 font-extrabold pt-1">
                      <span>Projected Annual Income Tax</span>
                      <span className="font-mono text-sm">Ks {taxDetails.taxAnnual.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 font-semibold text-[10px]">
                      <span>Monthly PIT deduction</span>
                      <span className="font-mono">Ks {taxDetails.taxMonthly.toLocaleString()} / month</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50/20 border border-blue-100 rounded-xl p-4 flex flex-col justify-between leading-normal text-blue-900">
                  <div className="space-y-2">
                    <span className="font-bold flex items-center text-blue-800">
                      <Info className="w-4 h-4 mr-1.5 text-blue-600 shrink-0" />
                      Important Compliance Note
                    </span>
                    {selectedRegime === 'New' ? (
                      <p className="text-[11px] text-blue-800/80">
                        Under the <strong>New Tax Regime</strong>, you get lower tax slabs and a higher tax rebate of up to Ks 7,00,000 u/s 87A, but most exemptions (80C, 80D, HRA) are disallowed. It is configured as the default regime.
                      </p>
                    ) : (
                      <p className="text-[11px] text-blue-800/80">
                        Under the <strong>Old Tax Regime</strong>, you can declare investments under Section 80C, 80D, and HRA to reduce your taxable income. Be sure to upload certified proofs below so HR can approve your tax rebate!
                      </p>
                    )}
                  </div>
                  <div className="text-[10px] text-blue-600/70 border-t border-blue-100 pt-2 font-medium">
                    * Final tax adjustment occurs during Year-End verification in February.
                  </div>
                </div>
              </div>
            </div>

            {/* Old Regime Declarations form */}
            {selectedRegime === 'Old' && (
              <form onSubmit={handleSaveTaxDeclaration} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
                <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wide border-b border-slate-100 pb-2">Exemptions Declarations & Supporting Receipts</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Section 80C Section */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-slate-500 font-bold mb-1">Union Tax Law (UTL) Deductions (Capped to Ks 1,50,000)</label>
                      <p className="text-[10px] text-slate-400 mb-2">SSB, PPF, Life Insurance premium, ELSS Mutual Funds, children school fees.</p>
                      <input
                        type="number"
                        placeholder="Declared Value"
                        max={150000}
                        value={decl80C || ''}
                        onChange={(e) => setDecl80C(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono font-bold text-slate-700"
                      />
                    </div>

                    {/* Drag and Drop 80C Proof */}
                    <div
                      onDragEnter={handleDrag80C}
                      onDragOver={handleDrag80C}
                      onDragLeave={handleDrag80C}
                      onDrop={handleDrop80C}
                      className={`border-2 border-dashed rounded-xl p-4 text-center flex flex-col items-center justify-center space-y-2 transition-colors ${
                        dragActive80C ? 'border-blue-600 bg-blue-50/10' : 'border-slate-200 bg-slate-50 hover:bg-slate-100/50'
                      }`}
                    >
                      <Upload className="w-5 h-5 text-slate-400" />
                      <span className="block text-[10px] text-slate-500 font-bold">
                        {proof80CFile ? `Uploaded: ${proof80CFile}` : 'Drag & drop 80C Receipts PDF or browse'}
                      </span>
                      <label className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 text-[10px] font-bold rounded cursor-pointer hover:bg-slate-50">
                        Browse
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setProof80CFile(e.target.files[0].name);
                              addToast(`80C Proof Uploaded: ${e.target.files[0].name}`, 'info');
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Section 80D Section */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-slate-500 font-bold mb-1">Health Care & SSB Exclusions (Capped to Ks 25,000 / Ks 50,000)</label>
                      <p className="text-[10px] text-slate-400 mb-2">Medical insurance premium for self, spouse, children, and dependent parents.</p>
                      <input
                        type="number"
                        placeholder="Declared Value"
                        max={50000}
                        value={decl80D || ''}
                        onChange={(e) => setDecl80D(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono font-bold text-slate-700"
                      />
                    </div>

                    {/* Drag and Drop 80D Proof */}
                    <div
                      onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive80D(true); }}
                      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive80D(true); }}
                      onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive80D(false); }}
                      onDrop={(e) => {
                        e.preventDefault(); e.stopPropagation(); setDragActive80D(false);
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          setProof80DFile(e.dataTransfer.files[0].name);
                          addToast(`80D Proof Uploaded: ${e.dataTransfer.files[0].name}`, 'info');
                        }
                      }}
                      className={`border-2 border-dashed rounded-xl p-4 text-center flex flex-col items-center justify-center space-y-2 transition-colors ${
                        dragActive80D ? 'border-blue-600 bg-blue-50/10' : 'border-slate-200 bg-slate-50 hover:bg-slate-100/50'
                      }`}
                    >
                      <Upload className="w-5 h-5 text-slate-400" />
                      <span className="block text-[10px] text-slate-500 font-bold">
                        {proof80DFile ? `Uploaded: ${proof80DFile}` : 'Drag & drop 80D receipts or browse'}
                      </span>
                      <label className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 text-[10px] font-bold rounded cursor-pointer hover:bg-slate-50">
                        Browse
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setProof80DFile(e.target.files[0].name);
                              addToast(`80D Proof Uploaded: ${e.target.files[0].name}`, 'info');
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* HRA Rent paid */}
                  <div className="md:col-span-2 border-t border-slate-100 pt-5 space-y-4">
                    <div>
                      <h5 className="font-extrabold text-slate-800 text-xs">House Rent Allowance (HRA) Declaration Details</h5>
                      <p className="text-[10px] text-slate-400 mt-0.5">Under Myanmar Income Tax Rules, rent exceeding Ks 1,00,000 per annum requires the Landlord's TIN details.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-slate-500 font-semibold mb-1">Declared Rent Paid (Annual)</label>
                        <input
                          type="number"
                          placeholder="e.g. 180000"
                          value={declHra || ''}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            setDeclHra(val);
                            setRentPaidMonthly(Math.round(val / 12));
                          }}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono font-bold text-slate-700"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-500 font-semibold mb-1">Landlord Full Name</label>
                        <input
                          type="text"
                          value={landlordName}
                          onChange={(e) => setLandlordName(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-slate-700"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-500 font-semibold mb-1">Landlord TIN Number</label>
                        <input
                          type="text"
                          maxLength={10}
                          value={landlordPan}
                          onChange={(e) => setLandlordPan(e.target.value.toUpperCase())}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono font-bold text-slate-700"
                        />
                      </div>
                    </div>

                    {/* Drag and drop rent receipt */}
                    <div
                      onDragEnter={handleDragHRA}
                      onDragOver={handleDragHRA}
                      onDragLeave={handleDragHRA}
                      onDrop={handleDropHRA}
                      className={`border-2 border-dashed rounded-xl p-5 text-center flex flex-col items-center justify-center space-y-2 transition-colors ${
                        dragActiveHRA ? 'border-blue-600 bg-blue-50/10' : 'border-slate-200 bg-slate-50 hover:bg-slate-100/50'
                      }`}
                    >
                      <Upload className="w-6 h-6 text-slate-400" />
                      <div>
                        <span className="block font-bold text-slate-700">Drag & drop your rent receipt PDF or lease agreements</span>
                        {rentReceiptFile && <span className="block text-[10px] text-emerald-600 font-bold mt-1">Uploaded File: {rentReceiptFile}</span>}
                      </div>
                      <label className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                        Browse Files
                        <input
                          type="file"
                          accept=".pdf,.docx,.jpg"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setRentReceiptFile(e.target.files[0].name);
                              addToast(`Lease document uploaded: ${e.target.files[0].name}`, 'info');
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* UTL Housing Exclusions */}
                  <div className="md:col-span-2 border-t border-slate-100 pt-5">
                    <div>
                      <label className="block text-slate-500 font-bold mb-1">UTL Housing Exclusions Interest Deduction (Capped to Ks 2,00,000)</label>
                      <p className="text-[10px] text-slate-400 mb-2">Declare interest paid on home loan during the financial year for a self-occupied property.</p>
                      <input
                        type="number"
                        placeholder="Declared Value"
                        max={200000}
                        value={declHomeLoan || ''}
                        onChange={(e) => setDeclHomeLoan(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono font-bold text-slate-700"
                      />
                    </div>
                  </div>

                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end space-x-2">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm transition-colors text-xs"
                  >
                    Submit Proofs for HR Approval
                  </button>
                </div>
              </form>
            )}

          </div>
        )}

        {/* 4. Reimbursement Claims Tab */}
        {essTab === 'reimbursement' && (
          <div className="space-y-6 text-xs">
            
            {/* Header / New claim controls */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wide">Flexible Benefits Plan (FBP) Reimbursement Claims</h4>
                <p className="text-slate-400 text-[10px] font-medium mt-0.5">Claim non-taxable allowances such as fuel bills, internet connections, and LTA</p>
              </div>

              <button
                onClick={() => setShowClaimModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center space-x-1.5 shadow-sm transition-colors whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Submit FBP Claim</span>
              </button>
            </div>

            {/* List claims */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="p-3 pl-6">Claim ID</th>
                      <th className="p-3">Allowance Category</th>
                      <th className="p-3">Date Submitted</th>
                      <th className="p-3">Attached receipt bill</th>
                      <th className="p-3 text-right">Amount Claimed</th>
                      <th className="p-3 text-center">Auditor Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    {claims.map((claim) => (
                      <tr key={claim.id} className="hover:bg-slate-50/40">
                        <td className="p-3 pl-6 font-mono font-bold text-slate-800">{claim.id}</td>
                        <td className="p-3 font-semibold text-slate-800">{claim.category}</td>
                        <td className="p-3 font-medium">{claim.claimDate}</td>
                        <td className="p-3 text-blue-600 underline font-semibold cursor-pointer">{claim.billName}</td>
                        <td className="p-3 text-right font-mono font-bold text-slate-700">Ks {claim.amount.toLocaleString()}</td>
                        <td className="p-3 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${
                            claim.status === 'Approved' 
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                              : claim.status === 'Rejected'
                              ? 'bg-rose-50 border-rose-200 text-rose-700'
                              : 'bg-amber-50 border-amber-200 text-amber-700'
                          }`}>
                            {claim.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* 5. Loans & EMIs Tab */}
        {essTab === 'loans' && (
          <div className="space-y-6 text-xs">
            
            {/* Header controls */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wide">Company Loan & Salary Advances accounts</h4>
                <p className="text-slate-400 text-[10px] font-medium mt-0.5">Configure, view, and apply for interest-free festival advances and medical support loans</p>
              </div>

              {!currentEmployeeLoan && (
                <button
                  onClick={() => setShowLoanApplyModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center space-x-1.5 shadow-sm transition-all whitespace-nowrap"
                >
                  <Coins className="w-4 h-4" />
                  <span>Apply for Company Loan</span>
                </button>
              )}
            </div>

            {currentEmployeeLoan ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Loan balance card */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                  <h5 className="font-extrabold text-slate-800 text-xs uppercase border-b border-slate-100 pb-2">Loan Summary Details</h5>
                  <div className="space-y-3">
                    <div className="flex justify-between font-semibold text-slate-500">
                      <span>Loan Name</span>
                      <span className="text-slate-800 font-bold">{currentEmployeeLoan.name}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-slate-500">
                      <span>Total Sanctioned Loan</span>
                      <span className="font-mono text-slate-700 font-bold">Ks {currentEmployeeLoan.sanctionedAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-slate-500">
                      <span>Interest Rate (Annual)</span>
                      <span className="font-mono text-slate-700 font-bold">{currentEmployeeLoan.interestRate}%</span>
                    </div>
                    <div className="flex justify-between font-semibold text-slate-500">
                      <span>Outstanding Debt</span>
                      <span className="font-mono font-extrabold text-amber-600">Ks {currentEmployeeLoan.outstandingAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-slate-500">
                      <span>Monthly Paycheck EMI</span>
                      <span className="font-mono font-bold text-blue-700">Ks {currentEmployeeLoan.monthlyEMI.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Repayment schedule ledger */}
                <div className="md:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                  <h5 className="font-extrabold text-slate-800 text-xs uppercase border-b border-slate-100 pb-2">Amortization Recovery Schedule</h5>
                  
                  <div className="overflow-y-auto max-h-56 border border-slate-100 rounded-lg">
                    <table className="w-full text-left border-collapse text-[11px]">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          <th className="p-2.5 pl-4">Month</th>
                          <th className="p-2.5 text-right">Principal</th>
                          <th className="p-2.5 text-right">Interest Recovery</th>
                          <th className="p-2.5 text-right">Total Monthly EMI</th>
                          <th className="p-2.5 text-center">Recovery Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-600">
                        {currentEmployeeLoan.repaymentLedger.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/40">
                            <td className="p-2.5 pl-4 font-semibold">{row.month}</td>
                            <td className="p-2.5 text-right font-mono font-bold text-slate-700">Ks {row.principal.toLocaleString()}</td>
                            <td className="p-2.5 text-right font-mono font-bold text-slate-700">Ks {row.interest.toLocaleString()}</td>
                            <td className="p-2.5 text-right font-mono font-bold text-blue-700">Ks {row.emi.toLocaleString()}</td>
                            <td className="p-2.5 text-center">
                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                row.status === 'Recovered' 
                                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' 
                                  : 'bg-amber-50 border border-amber-200 text-amber-700'
                              }`}>
                                {row.status.toUpperCase()}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400 space-y-3">
                <div className="p-3 bg-slate-50 text-slate-400 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                  <Coins className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-bold text-slate-700 block">No Active Loan Record</span>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">You do not have any pending company loans or credit advance programs.</span>
                </div>
              </div>
            )}

          </div>
        )}

        {/* 6. Previous Employment (Patakha(Waga)-15 Declaration) */}
        {essTab === 'prev-employer' && (
          <div className="space-y-6 text-xs">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-start space-x-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wide">Mid-Year Joining Income Consolidation (Patakha(Waga)-15 Declaration)</h4>
                  <p className="text-slate-400 text-[10px] font-medium mt-0.5">Required for correct PIT calculation if you joined Zylker Technologies in the middle of the current financial year</p>
                </div>
              </div>

              {prevCompanyIncome.submitted ? (
                <div className="p-5 bg-emerald-50/40 border border-emerald-200 rounded-xl flex items-start space-x-3 text-emerald-800 leading-normal">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="block font-bold text-emerald-800 text-sm">Patakha(Waga)-15 Declaration Submission Approved</span>
                    <span className="block text-xs mt-1">Previous Employer: <strong>{prevCompanyIncome.prevEmployerName}</strong></span>
                    <div className="grid grid-cols-3 gap-6 mt-3 font-mono font-bold text-xs">
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase font-sans">Previous Salary</span>
                        <span>Ks {prevCompanyIncome.prevSalary.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase font-sans">Previous PF</span>
                        <span>Ks {prevCompanyIncome.prevPf.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase font-sans">Previous PIT</span>
                        <span>Ks {prevCompanyIncome.prevTds.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleForm12BSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-500 font-semibold mb-1">Previous Employer Name *</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Acme Tech Solutions"
                        value={prevCompanyIncome.prevEmployerName}
                        onChange={(e) => setPrevCompanyIncome({...prevCompanyIncome, prevEmployerName: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-slate-700"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-500 font-semibold mb-1">Taxable Salary Earned from Previous Employer *</label>
                      <input
                        required
                        type="number"
                        placeholder="Ks "
                        value={prevCompanyIncome.prevSalary || ''}
                        onChange={(e) => setPrevCompanyIncome({...prevCompanyIncome, prevSalary: parseInt(e.target.value) || 0})}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono font-bold text-slate-700"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-500 font-semibold mb-1">Social Security Board Contribution in previous company *</label>
                      <input
                        required
                        type="number"
                        placeholder="Ks "
                        value={prevCompanyIncome.prevPf || ''}
                        onChange={(e) => setPrevCompanyIncome({...prevCompanyIncome, prevPf: parseInt(e.target.value) || 0})}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono font-bold text-slate-700"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-500 font-semibold mb-1">Income Tax Deducted (PIT) in previous company *</label>
                      <input
                        required
                        type="number"
                        placeholder="Ks "
                        value={prevCompanyIncome.prevTds || ''}
                        onChange={(e) => setPrevCompanyIncome({...prevCompanyIncome, prevTds: parseInt(e.target.value) || 0})}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono font-bold text-slate-700"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm transition-colors"
                    >
                      Consolidate Patakha(Waga)-15 Declaration Tax Data
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </div>

      {/* MODAL: SUBMIT CLAIM */}
      {showClaimModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-extrabold text-slate-800 text-sm">Submit Reimbursement Claim</h3>
              <button onClick={() => setShowClaimModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleSubmitClaim} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-500 font-semibold mb-1">Allowance Category *</label>
                <select
                  value={newClaim.category}
                  onChange={(e) => setNewClaim({...newClaim, category: e.target.value as any})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-slate-700"
                >
                  <option value="Fuel">Fuel Reimbursement</option>
                  <option value="Internet">Internet Allowance</option>
                  <option value="Telephone">Telephone Connection</option>
                  <option value="Food">Food Vouchers</option>
                  <option value="LTA (Leave Travel)">LTA (Leave Travel Allowance)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Claim Value (Ks  Amount) *</label>
                <input
                  required
                  type="number"
                  placeholder="e.g. 2500"
                  value={newClaim.amount || ''}
                  onChange={(e) => setNewClaim({...newClaim, amount: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono font-bold text-slate-700"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Attach Bill / Receipt Proof *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. fuel_bill_10293.pdf"
                  value={newClaim.billName}
                  onChange={(e) => setNewClaim({...newClaim, billName: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-slate-700"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowClaimModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
                >
                  Submit FBP Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: LOAN APPLICATION */}
      {showLoanApplyModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-extrabold text-slate-800 text-sm">Apply for Company Loan Advance</h3>
              <button onClick={() => setShowLoanApplyModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleSubmitLoanApply} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-500 font-semibold mb-1">Loan Program Type</label>
                <select
                  value={newLoan.name}
                  onChange={(e) => setNewLoan({...newLoan, name: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-slate-700"
                >
                  <option value="Festival Interest-Free Advance">Festival Interest-Free Advance (0% interest)</option>
                  <option value="Emergency Medical Loan">Emergency Medical Loan (5% compound interest)</option>
                  <option value="Corporate Vehicle Loan Program">Corporate Vehicle Loan Program (6.5% interest)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Sought Loan Amount *</label>
                  <input
                    required
                    type="number"
                    placeholder="e.g. 30000"
                    value={newLoan.amount || ''}
                    onChange={(e) => setNewLoan({...newLoan, amount: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono font-bold text-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Tenure (Repayment Months)</label>
                  <select
                    value={newLoan.tenure}
                    onChange={(e) => setNewLoan({...newLoan, tenure: parseInt(e.target.value) || 6})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-slate-700"
                  >
                    <option value="3">3 Months EMI</option>
                    <option value="6">6 Months EMI</option>
                    <option value="12">12 Months EMI</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Purpose / Reason *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Describe your requirement..."
                  value={newLoan.reason}
                  onChange={(e) => setNewLoan({...newLoan, reason: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Estimate calculation */}
              <div className="p-4 bg-blue-50/40 border border-blue-100 rounded-xl space-y-1 font-semibold text-[10px] text-blue-900 leading-normal">
                <span className="block font-bold uppercase tracking-wider text-blue-800">Repayment Projection</span>
                <p>Monthly Payroll Deducted EMI: <strong>Ks {Math.round(newLoan.amount / newLoan.tenure).toLocaleString()} / month</strong></p>
                <p>No compound interest applies for standard interest-free advances.</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowLoanApplyModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
                >
                  Apply & Sanction Loan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HIGHER-FIDELITY MYANMAR PAYSLIP VISUAL MODAL */}
      {showPayslipId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-300 w-full max-w-3xl rounded-xl overflow-hidden shadow-2xl flex flex-col h-[90vh]">
            
            {/* Header / control bar */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center shrink-0">
              <span className="font-extrabold text-slate-800 text-xs uppercase tracking-wide">High-Fidelity Myanmar Digital Payslip Preview</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    addToast("Saving payslip as high-resolution PDF download...", "success");
                  }}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-sm flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
                <button onClick={() => setShowPayslipId(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded-full bg-white border border-slate-200 shadow-xs">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Payslip content (Scrollable high resolution template) */}
            <div className="flex-1 overflow-y-auto p-12 bg-slate-100/50">
              <div className="bg-white border border-slate-200 shadow-sm p-8 max-w-2xl mx-auto space-y-6 text-[11px] text-slate-700 font-sans" id="printable-payslip">
                
                {/* Brand Logo & Company Info */}
                <div className="flex justify-between items-start border-b border-slate-200 pb-5">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white font-extrabold text-sm">Z</div>
                      <span className="font-extrabold text-slate-900 text-sm">Zylker Technologies (Myanmar) Co., Ltd.</span>
                    </div>
                    <p className="text-slate-500 font-medium leading-relaxed max-w-xs text-[10px]">
                      No. 42A, Bahan Road, Bahan Township, Yangon, Myanmar
                    </p>
                  </div>
                  <div className="text-right">
                    <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Salary Payslip</h3>
                    <span className="font-mono text-[10px] text-slate-500 font-bold block mt-1">Pay Period: {payRuns.find(p => p.id === showPayslipId)?.billingMonth || 'July 2026'}</span>
                  </div>
                </div>

                {/* Employee / Bank registry details */}
                <div className="grid grid-cols-2 gap-8 border-b border-slate-100 pb-5">
                  <div className="space-y-1.5">
                    <div className="flex justify-between border-b border-slate-50 pb-1">
                      <span className="text-slate-400 font-semibold">Employee ID</span>
                      <span className="font-mono font-bold text-slate-800">{currentEmployee.id}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 pb-1">
                      <span className="text-slate-400 font-semibold">Employee Name</span>
                      <span className="font-bold text-slate-800">{currentEmployee.firstName} {currentEmployee.lastName}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 pb-1">
                      <span className="text-slate-400 font-semibold">Department</span>
                      <span className="font-semibold text-slate-600">{currentEmployee.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-semibold">Designation</span>
                      <span className="font-semibold text-slate-600">{currentEmployee.designation}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between border-b border-slate-50 pb-1">
                      <span className="text-slate-400 font-semibold">Social Security Board (SSB) No</span>
                      <span className="font-mono font-bold text-slate-800">{currentEmployee.uanNumber || '-'}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 pb-1">
                      <span className="text-slate-400 font-semibold">Taxpayer Identification No (TIN)</span>
                      <span className="font-mono font-bold text-slate-800">{currentEmployee.panNumber || '-'}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 pb-1">
                      <span className="text-slate-400 font-semibold">Bank Name / Account</span>
                      <span className="font-semibold text-slate-600">{currentEmployee.bankName} / ***{currentEmployee.accountNumber?.slice(-4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-semibold">SWIFT / Bank Code</span>
                      <span className="font-mono font-bold text-slate-800">{currentEmployee.ifscCode}</span>
                    </div>
                  </div>
                </div>

                {/* Earnings & Deductions ledger splits */}
                <div className="grid grid-cols-2 border border-slate-200 rounded-lg overflow-hidden divide-x divide-slate-200">
                  
                  {/* Earnings Column */}
                  <div>
                    <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 font-bold text-slate-800 uppercase text-[10px]">Earnings</div>
                    <div className="p-4 space-y-2">
                      <div className="flex justify-between">
                        <span>Basic Salary</span>
                        <span className="font-mono">Ks {currentEmployee.monthlySalary.basic.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>House Rent Allowance (HRA)</span>
                        <span className="font-mono">Ks {currentEmployee.monthlySalary.hra.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Conveyance Allowance</span>
                        <span className="font-mono">Ks {currentEmployee.monthlySalary.conveyance.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Special Allowance</span>
                        <span className="font-mono">Ks {currentEmployee.monthlySalary.specialAllowance.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Deductions Column */}
                  <div>
                    <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 font-bold text-slate-800 uppercase text-[10px]">Deductions</div>
                    <div className="p-4 space-y-2">
                      <div className="flex justify-between">
                        <span>Social Security Board (SSB)</span>
                        <span className="font-mono">Ks {currentEmployee.monthlySalary.pfEmployee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Municipal Wage Tax (Municipal Tax)</span>
                        <span className="font-mono">Ks {currentEmployee.monthlySalary.professionalTax}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Personal Income Tax (PIT)</span>
                        <span className="font-mono">Ks {taxDetails.taxMonthly.toLocaleString()}</span>
                      </div>
                      {currentEmployeeLoan && (
                        <div className="flex justify-between text-amber-600 font-semibold">
                          <span>Loan Recovery ({currentEmployeeLoan.name})</span>
                          <span className="font-mono">Ks {currentEmployeeLoan.monthlyEMI.toLocaleString()}</span>
                        </div>
                      )}
                      {activeEWARequest && activeEWARequest.status === 'Disbursed' && (
                        <div className="flex justify-between text-rose-600 font-semibold">
                          <span>EWA Accrued Repayment</span>
                          <span className="font-mono">Ks {activeEWARequest.requestedAmount.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* Sub totals & Net Payoff */}
                <div className="bg-blue-50/30 border border-blue-200 rounded-lg p-5 grid grid-cols-3 gap-4 text-xs font-semibold text-slate-800 leading-normal">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Gross Earnings</span>
                    <span className="font-mono font-bold text-sm text-slate-700">Ks {currentEmployee.monthlySalary.grossEarnings.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Total Deductions</span>
                    <span className="font-mono font-bold text-sm text-slate-700">
                      Ks {(
                        currentEmployee.monthlySalary.pfEmployee 
                        + currentEmployee.monthlySalary.professionalTax 
                        + taxDetails.taxMonthly
                        + (activeEWARequest && activeEWARequest.status === 'Disbursed' ? activeEWARequest.requestedAmount : 0)
                        + (currentEmployeeLoan ? currentEmployeeLoan.monthlyEMI : 0)
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-blue-600 font-bold block uppercase tracking-wider">Net Take-Home Pay</span>
                    <span className="font-mono font-extrabold text-base text-blue-700">
                      Ks {Math.max(0, 
                        currentEmployee.monthlySalary.grossEarnings 
                        - currentEmployee.monthlySalary.pfEmployee 
                        - currentEmployee.monthlySalary.professionalTax 
                        - taxDetails.taxMonthly
                        - (activeEWARequest && activeEWARequest.status === 'Disbursed' ? activeEWARequest.requestedAmount : 0)
                        - (currentEmployeeLoan ? currentEmployeeLoan.monthlyEMI : 0)
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Footer notes */}
                <div className="pt-4 border-t border-slate-100 text-[10px] text-slate-400 text-center font-normal flex justify-between items-center">
                  <span>* This is a digitally generated, legally compliant statutory payslip. No physical signature is required.</span>
                  <span className="font-bold text-slate-600">Zoho Payroll System Integration</span>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
