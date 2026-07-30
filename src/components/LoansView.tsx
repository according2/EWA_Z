import React, { useState } from 'react';
import { 
  Calculator, 
  DollarSign, 
  Plus, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  UserCheck
} from 'lucide-react';
import { Employee } from '../types';

interface LoansViewProps {
  employees: Employee[];
  addToast: (message: string, type: 'success' | 'info' | 'error') => void;
}

export default function LoansView({ employees, addToast }: LoansViewProps) {
  // Calculator inputs
  const [loanAmount, setLoanAmount] = useState<number>(1500000);
  const [loanTenure, setLoanTenure] = useState<number>(12);
  const [loanRate, setLoanRate] = useState<number>(8.5);

  // Active Loans ledger
  const [loans, setLoans] = useState([
    { id: 'L-101', empName: 'Aung Min', principal: 1500000, emi: 130000, tenure: 12, balance: 650000, status: 'Active', approvedBy: 'Finance Board' },
    { id: 'L-102', empName: 'Thae Su Naing', principal: 1000000, emi: 87000, tenure: 12, balance: 435000, status: 'Active', approvedBy: 'VP Operations' },
    { id: 'L-103', empName: 'Khin Sandar', principal: 3000000, emi: 260000, tenure: 12, balance: 3000000, status: 'Approved', approvedBy: 'CEO Desk' }
  ]);

  const [applyEmpId, setApplyEmpId] = useState(employees[0]?.id || '');
  const [applyPrincipal, setApplyPrincipal] = useState<number>(1000000);
  const [applyTenure, setApplyTenure] = useState<number>(12);

  // EMI Calculator Formulas
  const monthlyRate = (loanRate / 100) / 12;
  const rawEMI = monthlyRate > 0 
    ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTenure)) / (Math.pow(1 + monthlyRate, loanTenure) - 1)
    : loanAmount / loanTenure;
  const emiVal = Math.round(rawEMI);
  const totalInterest = Math.round((emiVal * loanTenure) - loanAmount);
  const totalRepayment = loanAmount + totalInterest;

  const handleApplyLoan = (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmp = employees.find(emp => emp.id === applyEmpId);
    if (!targetEmp) return;

    // Calculate applied EMI
    const appRate = (8.5 / 100) / 12;
    const appEMI = Math.round((applyPrincipal * appRate * Math.pow(1 + appRate, applyTenure)) / (Math.pow(1 + appRate, applyTenure) - 1));

    const newL = {
      id: `L-${101 + loans.length}`,
      empName: `${targetEmp.firstName} ${targetEmp.lastName}`,
      principal: applyPrincipal,
      emi: appEMI,
      tenure: applyTenure,
      balance: applyPrincipal,
      status: 'Approved',
      approvedBy: 'Auto-Calculated Policy'
    };

    setLoans([...loans, newL]);
    addToast(`Corporate loan requested for ${targetEmp.firstName}! Disbursed to bank soon.`, 'success');
  };

  return (
    <div className="space-y-6" id="loans-advances-module">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: EMI Calculator Slider Panel */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          <div>
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Salary Advance & EMI Calculator</h3>
            <p className="text-[11px] text-slate-400">Estimate interest burdens, tenures, and monthly pre-payroll subtractions.</p>
          </div>

          <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100 font-semibold text-slate-600">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span>Loan Principal Amount</span>
                <span className="text-blue-600 font-extrabold">{loanAmount.toLocaleString()} Ks</span>
              </div>
              <input 
                type="range" 
                min={100000} 
                max={5000000} 
                step={50000}
                value={loanAmount} 
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer" 
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>100,000 Ks</span>
                <span>5,000,000 Ks Limit</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span>Repayment Tenure (Months)</span>
                <span className="text-blue-600 font-extrabold">{loanTenure} Months</span>
              </div>
              <input 
                type="range" 
                min={6} 
                max={36} 
                step={6}
                value={loanTenure} 
                onChange={(e) => setLoanTenure(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer" 
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>6 M</span>
                <span>36 Months Max</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span>Interest Rate (Annual)</span>
                <span className="text-blue-600 font-extrabold">{loanRate}%</span>
              </div>
              <input 
                type="range" 
                min={4} 
                max={15} 
                step={0.5}
                value={loanRate} 
                onChange={(e) => setLoanRate(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer" 
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>4% Low</span>
                <span>15% Max</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 text-center bg-blue-50/30 border border-blue-100 rounded-xl p-4 font-semibold text-slate-600">
            <div>
              <span className="block text-[9px] text-slate-400 font-bold uppercase">Estimated EMI</span>
              <span className="text-xs font-black text-blue-600 mt-0.5 block">{emiVal.toLocaleString()} Ks</span>
            </div>
            <div>
              <span className="block text-[9px] text-slate-400 font-bold uppercase">Interest Total</span>
              <span className="text-xs font-bold text-slate-700 mt-0.5 block">{totalInterest.toLocaleString()} Ks</span>
            </div>
            <div>
              <span className="block text-[9px] text-slate-400 font-bold uppercase">Repay Total</span>
              <span className="text-xs font-bold text-slate-700 mt-0.5 block">{totalRepayment.toLocaleString()} Ks</span>
            </div>
          </div>

          <button 
            onClick={() => addToast(`Amortization ledger compiled for ${loanAmount.toLocaleString()} Ks`, 'success')}
            className="w-full py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center space-x-2 cursor-pointer shadow-xs transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Generate Amortization Schedule</span>
          </button>
        </div>

        {/* Right: Apply & Corporate Advance Policies */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider border-b pb-3 border-slate-100">
              Apply Corporate Advance Loan
            </h3>
            <form onSubmit={handleApplyLoan} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-500 font-semibold mb-1">Select Employee</label>
                <select
                  value={applyEmpId}
                  onChange={(e) => setApplyEmpId(e.target.value)}
                  className="w-full border border-slate-200 rounded p-2 text-xs bg-white focus:outline-none font-bold text-slate-800"
                >
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>{e.firstName} {e.lastName} ({e.id})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-500 font-semibold mb-1">Loan Principal (Ks)</label>
                <input
                  type="number"
                  min="50000"
                  max="10000000"
                  value={applyPrincipal}
                  onChange={(e) => setApplyPrincipal(Number(e.target.value))}
                  className="w-full border border-slate-200 rounded p-2 text-xs focus:outline-none font-bold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-slate-500 font-semibold mb-1">Repayment Tenure</label>
                <select
                  value={applyTenure}
                  onChange={(e) => setApplyTenure(Number(e.target.value))}
                  className="w-full border border-slate-200 rounded p-2 text-xs bg-white focus:outline-none font-bold text-slate-800"
                >
                  <option value={6}>6 Months (Short term)</option>
                  <option value={12}>12 Months (Standard)</option>
                  <option value={24}>24 Months (Long term)</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg cursor-pointer transition flex items-center justify-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Disburse New Loan</span>
                </button>
              </div>
            </form>
          </div>

          <div className="bg-slate-900 text-slate-300 rounded-xl p-5 border border-slate-800 space-y-3.5">
            <div className="flex items-center space-x-2 text-white">
              <UserCheck className="w-5 h-5 text-blue-500" />
              <h4 className="text-xs font-bold uppercase tracking-wider">Salary Advance Guidelines</h4>
            </div>
            <div className="text-[11px] leading-relaxed space-y-2 text-slate-400">
              <p>
                1. Total outstanding loan principles must never exceed <strong>3x the employee's gross monthly pay check</strong> to preserve livelihood safety under Myanmar Ministry of Labour rules.
              </p>
              <p>
                2. Standard monthly EMI deductions are recovered automatically during the active pay run. Late fees are set at <strong>0% (Corporate Welfare Grant)</strong>.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Active Loans Ledger Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-3 border-slate-100">
          Corporate Loan & Advances Register Ledger
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-slate-500">
                <th className="p-3 font-bold">Loan ID</th>
                <th className="p-3 font-bold">Employee Name</th>
                <th className="p-3 font-bold">Principal Amount</th>
                <th className="p-3 font-bold">Monthly EMI Deduct</th>
                <th className="p-3 font-bold">Remaining Balance</th>
                <th className="p-3 font-bold">Tenure Range</th>
                <th className="p-3 font-bold">Authority Level</th>
                <th className="p-3 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600 font-semibold">
              {loans.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/50">
                  <td className="p-3 font-mono font-bold text-slate-900">{l.id}</td>
                  <td className="p-3 font-bold text-slate-800">{l.empName}</td>
                  <td className="p-3 font-bold text-slate-700">{l.principal.toLocaleString()} Ks</td>
                  <td className="p-3 text-blue-600 font-bold">{l.emi.toLocaleString()} Ks</td>
                  <td className="p-3 font-bold text-slate-700">{l.balance.toLocaleString()} Ks</td>
                  <td className="p-3">{l.tenure} Months</td>
                  <td className="p-3 text-slate-500 font-semibold">{l.approvedBy}</td>
                  <td className="p-3">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                      l.status === 'Active' 
                        ? 'bg-blue-50 text-blue-700 border-blue-100'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                    }`}>
                      {l.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
