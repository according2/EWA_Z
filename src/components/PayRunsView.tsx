import React, { useState } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  Download, 
  ArrowRight, 
  Printer, 
  FileCheck,
  Building,
  User,
  ShieldCheck,
  AlertCircle,
  Clock,
  X,
  PlayCircle
} from 'lucide-react';
import { Employee, PayRun } from '../types';

interface PayRunsViewProps {
  payRuns: PayRun[];
  setPayRuns: React.Dispatch<React.SetStateAction<PayRun[]>>;
  employees: Employee[];
  addToast: (message: string, type: 'success' | 'info' | 'error') => void;
}

export default function PayRunsView({ payRuns, setPayRuns, employees, addToast }: PayRunsViewProps) {
  const [activePayRunId, setActivePayRunId] = useState<string>('PR-2026-07'); // Default to active July 2026 draft
  
  // Disbursement animation states
  const [disbursementStep, setDisbursementStep] = useState<number>(0); // 0 = idle, 1 = bank validation, 2 = wire transfer, 3 = generating slips, 4 = complete
  const [isProcessingDisburse, setIsProcessingDisburse] = useState<boolean>(false);
  
  // Payslip preview modal states
  const [previewPayslipEmpId, setPreviewPayslipEmpId] = useState<string | null>(null);

  const selectedPayRun = payRuns.find(p => p.id === activePayRunId) || payRuns[0];

  const handleApprovePayRun = () => {
    setPayRuns(prev => prev.map(p => {
      if (p.id !== selectedPayRun.id) return p;
      return { ...p, status: 'Approved' };
    }));
    addToast(`Pay run for ${selectedPayRun.billingMonth} has been approved. Ready for Automated Disbursement.`, 'success');
  };

  const handleDisbursementSimulation = () => {
    setIsProcessingDisburse(true);
    setDisbursementStep(1);
    
    // Simulate multi-step enterprise salary disbursement
    setTimeout(() => {
      setDisbursementStep(2);
      setTimeout(() => {
        setDisbursementStep(3);
        setTimeout(() => {
          setDisbursementStep(4);
          setTimeout(() => {
            // Update state to Disbursed
            setPayRuns(prev => prev.map(p => {
              if (p.id !== selectedPayRun.id) return p;
              return { 
                ...p, 
                status: 'Disbursed',
                employeeSalaries: p.employeeSalaries.map(sal => ({ ...sal, paymentStatus: 'Paid' }))
              };
            }));
            setIsProcessingDisburse(false);
            setDisbursementStep(0);
            addToast(`Successfully disbursed Ks ${selectedPayRun.totalNetPay.toLocaleString()} to ${selectedPayRun.totalEmployees} employee bank accounts!`, 'success');
          }, 1500);
        }, 1500);
      }, 1500);
    }, 1500);
  };

  // Simulates downloading the standard SBI/HDFC Corporate Bulk Transfer Text File
  const handleExportBankFile = () => {
    const header = `ZYLKER_TECH_BULK_PAYROLL_${selectedPayRun.billingMonth.toUpperCase().replace(' ', '_')}\n`;
    const rows = selectedPayRun.employeeSalaries.map(sal => {
      const emp = employees.find(e => e.id === sal.employeeId);
      const bank = emp ? emp.bankName : 'UNKNOWN BANK';
      const acct = emp ? emp.accountNumber : '0000000000';
      const ifsc = emp ? emp.ifscCode : 'IFSC000000';
      return `${sal.employeeId},${sal.employeeName.padEnd(20, ' ')},${bank.padEnd(15, ' ')},${acct},${ifsc},MMK,${sal.netPay}.00`;
    }).join('\n');

    const fileContent = header + rows;
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `zylker_payroll_bank_transfer_${selectedPayRun.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    addToast(`Successfully generated and downloaded bank integration transfer instruction file (${selectedPayRun.employeeSalaries.length} lines)`, 'success');
  };

  const getPayslipDetails = () => {
    if (!previewPayslipEmpId) return null;
    const emp = employees.find(e => e.id === previewPayslipEmpId);
    const payDetail = selectedPayRun.employeeSalaries.find(s => s.employeeId === previewPayslipEmpId);
    return { emp, payDetail };
  };

  const payslipData = getPayslipDetails();

  return (
    <div className="space-y-6" id="payruns-module">
      
      {/* Switcher & Core Actions */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <CreditCard className="w-5 h-5 text-blue-600" />
          <span className="font-bold text-slate-800 text-xs uppercase">Pay Cycle History:</span>
          <select
            value={activePayRunId}
            onChange={(e) => setActivePayRunId(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {payRuns.map(pr => (
              <option key={pr.id} value={pr.id}>
                {pr.billingMonth} ({pr.status})
              </option>
            ))}
          </select>
        </div>

        {/* Action controls based on status */}
        <div className="flex flex-wrap gap-3 items-center w-full md:w-auto justify-end">
          {selectedPayRun.status === 'Draft' && (
            <button
              onClick={handleApprovePayRun}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center space-x-1.5"
            >
              <FileCheck className="w-4 h-4" />
              <span>Approve Pay Run Structure</span>
            </button>
          )}

          {selectedPayRun.status === 'Approved' && (
            <button
              onClick={handleDisbursementSimulation}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center space-x-1.5"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Disburse Automated Salaries</span>
            </button>
          )}

          {selectedPayRun.status === 'Disbursed' && (
            <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-xs font-extrabold flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>SALARIES DISBURSED IN BULK</span>
            </span>
          )}

          <button
            onClick={handleExportBankFile}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export Bank File</span>
          </button>
        </div>
      </div>

      {/* PayRun Details Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Gross Salary Budget</span>
          <span className="text-xl font-extrabold text-slate-800 mt-1 block">Ks {selectedPayRun.totalGrossEarnings.toLocaleString()}</span>
          <span className="text-[11px] text-slate-500 font-medium block mt-1.5">For {selectedPayRun.totalEmployees} Employees</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Pre & Post-Tax Deductions</span>
          <span className="text-xl font-extrabold text-red-600 mt-1 block">Ks {selectedPayRun.totalDeductions.toLocaleString()}</span>
          <span className="text-[11px] text-slate-500 font-medium block mt-1.5">Includes PF, ESI, TDS, EWA</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Net Take-Home Disbursed</span>
          <span className="text-xl font-extrabold text-blue-700 mt-1 block">Ks {selectedPayRun.totalNetPay.toLocaleString()}</span>
          <span className="text-[11px] text-slate-500 font-medium block mt-1.5">Disbursement via NEFT/IMPS</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Pay Run Status</span>
          <div className="mt-2.5">
            <span className={`px-2.5 py-1 rounded text-xs font-extrabold border ${
              selectedPayRun.status === 'Disbursed'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : selectedPayRun.status === 'Approved'
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-amber-50 border-amber-200 text-amber-700'
            }`}>
              {selectedPayRun.status.toUpperCase()}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium block mt-3">Ref ID: {selectedPayRun.id}</span>
        </div>
      </div>

      {/* Disbursement Simulator UI */}
      {isProcessingDisburse && (
        <div className="bg-slate-900 text-slate-200 rounded-xl p-6 shadow-xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl flex items-center justify-center animate-pulse">
                <CreditCard className="w-5 h-5 animate-spin" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Automated Salary Disbursement Active</h3>
                <p className="text-slate-400 text-xs">Direct bank integration transferring salary tokens bulk</p>
              </div>
            </div>
            <span className="text-xs text-blue-400 font-mono font-bold uppercase tracking-widest animate-pulse">Processing...</span>
          </div>

          {/* Stepper progress */}
          <div className="grid grid-cols-4 gap-4">
            <div className={`p-4 rounded-lg border text-xs font-semibold ${
              disbursementStep >= 1 ? 'bg-blue-950/40 border-blue-800 text-blue-300' : 'bg-slate-950 border-slate-800 text-slate-600'
            }`}>
              <div className="flex justify-between items-center mb-1">
                <span>1. Bank Verification</span>
                {disbursementStep > 1 && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
              </div>
              <p className="text-[10px] text-slate-500 font-normal">Validating 6 recipient IFSC and bank routes</p>
            </div>

            <div className={`p-4 rounded-lg border text-xs font-semibold ${
              disbursementStep >= 2 ? 'bg-blue-950/40 border-blue-800 text-blue-300' : 'bg-slate-950 border-slate-800 text-slate-600'
            }`}>
              <div className="flex justify-between items-center mb-1">
                <span>2. Funds Transfer</span>
                {disbursementStep > 2 && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
              </div>
              <p className="text-[10px] text-slate-500 font-normal">Broadcasting bulk NEFT tokens to clearing house</p>
            </div>

            <div className={`p-4 rounded-lg border text-xs font-semibold ${
              disbursementStep >= 3 ? 'bg-blue-950/40 border-blue-800 text-blue-300' : 'bg-slate-950 border-slate-800 text-slate-600'
            }`}>
              <div className="flex justify-between items-center mb-1">
                <span>3. Digital Payslips</span>
                {disbursementStep > 3 && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
              </div>
              <p className="text-[10px] text-slate-500 font-normal">Generating and signing tax-compliant payslips</p>
            </div>

            <div className={`p-4 rounded-lg border text-xs font-semibold ${
              disbursementStep >= 4 ? 'bg-emerald-950/30 border-emerald-800 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-600'
            }`}>
              <div className="flex justify-between items-center mb-1">
                <span>4. Complete</span>
                {disbursementStep >= 4 && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </div>
              <p className="text-[10px] text-slate-500 font-normal">Email notifications sent automatically</p>
            </div>
          </div>
        </div>
      )}

      {/* Roster-based Salary Details */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">Recipients & Net Pay calculations</h3>
            <p className="text-slate-500 text-[11px] mt-0.5">Summary of payroll calculations for {selectedPayRun.billingMonth}</p>
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Disbursement Model: Direct Deposit</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 tracking-wider">
                <th className="p-4 pl-6">Employee ID / Name</th>
                <th className="p-4 text-right">Gross Earnings</th>
                <th className="p-4 text-right">Taxes & PF Deductions</th>
                <th className="p-4 text-right">EWA Recoveries</th>
                <th className="p-4 text-right">Net Disbursement Pay</th>
                <th className="p-4 text-center">Transfer Status</th>
                <th className="p-4 text-center">Digital Payslip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {selectedPayRun.employeeSalaries.map((sal) => (
                <tr key={sal.employeeId} className="hover:bg-slate-50/40 transition-colors">
                  <td className="p-4 pl-6">
                    <div>
                      <span className="font-bold text-slate-800 block">{sal.employeeName}</span>
                      <span className="text-[10px] text-slate-400 block font-medium">{sal.employeeId} &bull; {sal.designation}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right font-mono font-medium text-slate-600">
                    Ks {sal.grossEarnings.toLocaleString()}
                  </td>
                  <td className="p-4 text-right font-mono text-red-600">
                    -Ks {sal.deductions.toLocaleString()}
                  </td>
                  <td className="p-4 text-right font-mono text-amber-700">
                    {sal.ewaDeduction > 0 ? `-Ks ${sal.ewaDeduction.toLocaleString()}` : '—'}
                  </td>
                  <td className="p-4 text-right font-mono font-bold text-slate-800 bg-slate-50/30">
                    Ks {sal.netPay.toLocaleString()}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border inline-block ${
                      sal.paymentStatus === 'Paid'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'bg-amber-50 border-amber-200 text-amber-700'
                    }`}>
                      {sal.paymentStatus}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => setPreviewPayslipEmpId(sal.employeeId)}
                      className="px-3 py-1 bg-slate-100 hover:bg-blue-600 hover:text-white transition-colors rounded text-xs text-slate-600 font-semibold inline-flex items-center space-x-1"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Generate / View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Payslip Modal */}
      {previewPayslipEmpId && payslipData?.emp && payslipData?.payDetail && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col h-[90vh]">
            {/* Modal Actions Header */}
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
              <span className="font-bold text-slate-700 text-sm">Corporate Digital Payslip Draft</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold rounded-lg text-xs flex items-center space-x-1 transition-all"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>
                <button 
                  onClick={() => setPreviewPayslipEmpId(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            {/* Printable Payslip Body */}
            <div className="flex-1 overflow-y-auto p-10 space-y-8" id="printable-payslip">
              
              {/* Header Info */}
              <div className="flex justify-between items-start border-b-2 border-slate-800 pb-6">
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 bg-blue-600 text-white font-bold flex items-center justify-center text-sm rounded">Z</div>
                    <h2 className="font-extrabold text-slate-800 text-base">Zylker Technologies (Myanmar) Co., Ltd.</h2>
                  </div>
                  <p className="text-[11px] text-slate-500 max-w-xs leading-normal">
                    No. 42A, Bahan Road, Bahan Township, Yangon, Myanmar
                  </p>
                </div>
                <div className="text-right">
                  <h3 className="font-extrabold text-slate-800 text-sm">PAY SLIP DIRECT DEPOSIT</h3>
                  <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block mt-1">Month: {selectedPayRun.billingMonth}</span>
                  <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Ref No: PAY-{payslipData.payDetail.employeeId}-{selectedPayRun.id}</span>
                </div>
              </div>

              {/* Employee Particulars Grid */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-3.5 text-xs pb-6 border-b border-slate-200">
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span className="text-slate-400 font-semibold">Employee Name:</span>
                  <span className="font-bold text-slate-700">{payslipData.emp.firstName} {payslipData.emp.lastName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span className="text-slate-400 font-semibold">PAN (Income Tax):</span>
                  <span className="font-bold font-mono text-slate-700">{payslipData.emp.panNumber}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span className="text-slate-400 font-semibold">Designation & Dept:</span>
                  <span className="font-bold text-slate-700">{payslipData.emp.designation} ({payslipData.emp.department})</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span className="text-slate-400 font-semibold">PF Universal Acct No (UAN):</span>
                  <span className="font-bold font-mono text-slate-700">{payslipData.emp.uanNumber || 'N/A'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span className="text-slate-400 font-semibold">Bank & Account:</span>
                  <span className="font-bold text-slate-700">{payslipData.emp.bankName} - {payslipData.emp.accountNumber}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span className="text-slate-400 font-semibold">Days Paid:</span>
                  <span className="font-bold text-slate-700">{payslipData.payDetail.daysPresent} Days / 31</span>
                </div>
              </div>

              {/* Earnings vs Deductions Table */}
              <div className="grid grid-cols-2 gap-8 text-xs">
                {/* Earnings */}
                <div>
                  <h4 className="font-extrabold text-slate-800 border-b border-slate-800 pb-1.5 uppercase tracking-wide">Earnings</h4>
                  <div className="divide-y divide-slate-100 py-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Basic Salary</span>
                      <span className="font-mono font-semibold">Ks {payslipData.emp.monthlySalary.basic.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">House Rent Allowance (HRA)</span>
                      <span className="font-mono font-semibold">Ks {payslipData.emp.monthlySalary.hra.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Conveyance Allowance</span>
                      <span className="font-mono font-semibold">Ks {payslipData.emp.monthlySalary.conveyance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Special Allowance</span>
                      <span className="font-mono font-semibold">Ks {payslipData.emp.monthlySalary.specialAllowance.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex justify-between border-t border-slate-800 pt-2 font-extrabold text-slate-800 text-sm">
                    <span>Total Earnings (Gross)</span>
                    <span className="font-mono">Ks {payslipData.payDetail.grossEarnings.toLocaleString()}</span>
                  </div>
                </div>

                {/* Deductions */}
                <div>
                  <h4 className="font-extrabold text-slate-800 border-b border-slate-800 pb-1.5 uppercase tracking-wide">Deductions</h4>
                  <div className="divide-y divide-slate-100 py-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Provident Fund (EPF)</span>
                      <span className="font-mono font-semibold text-rose-600">Ks {payslipData.emp.monthlySalary.pfEmployee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Municipal Wage Tax (PT)</span>
                      <span className="font-mono font-semibold text-rose-600">Ks {payslipData.emp.monthlySalary.professionalTax.toLocaleString()}</span>
                    </div>
                    {payslipData.payDetail.ewaDeduction > 0 && (
                      <div className="flex justify-between font-bold text-amber-700 bg-amber-50 px-1 py-0.5 rounded">
                        <span>EWA Advance Recovery</span>
                        <span className="font-mono">-Ks {payslipData.payDetail.ewaDeduction.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between border-t border-slate-800 pt-2 font-extrabold text-slate-800 text-sm">
                    <span>Total Deductions</span>
                    <span className="font-mono text-rose-600">
                      Ks {(payslipData.payDetail.deductions + payslipData.payDetail.ewaDeduction).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Final net pay box */}
              <div className="bg-slate-900 text-white rounded-xl p-5 flex justify-between items-center mt-6">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">NET SALARY PAYOUT</span>
                  <p className="text-[11px] text-slate-300">NEFT Authorized transfer to recipient bank account</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-extrabold font-mono text-white">Ks {payslipData.payDetail.netPay.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Kyat {payslipData.payDetail.netPay.toLocaleString()} Only</span>
                </div>
              </div>

              {/* Disclaimers & Signatures */}
              <div className="grid grid-cols-2 gap-8 pt-8 text-[10px] text-slate-400 leading-normal border-t border-slate-200">
                <p>
                  * This is a system-generated secure pay slip matching Section 192 rules. No physical signature is required. Zylker Technologies is direct-reporting with NSDL.
                </p>
                <div className="text-right flex flex-col justify-end items-end space-y-1">
                  <span className="font-bold text-slate-600 uppercase tracking-wider text-[9px] block">Authorized HR Signatory</span>
                  <div className="w-32 h-1 bg-slate-200 mt-6"></div>
                  <span className="text-[9px] text-slate-400">Priya Nair, Head of Operations</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
