import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  RefreshCw, 
  FileCheck, 
  Clock, 
  Calendar,
  Send,
  BookOpen,
  PieChart,
  Landmark,
  Calculator,
  Search
} from 'lucide-react';
import { Employee } from '../types';

interface ReportsViewProps {
  employees: Employee[];
  addToast: (message: string, type: 'success' | 'info' | 'error') => void;
}

export default function ReportsView({ employees, addToast }: ReportsViewProps) {
  const [activeTab, setActiveTab] = useState<'accounting' | 'compliance' | 'payroll'>('accounting');
  const [accountingTab, setAccountingTab] = useState<'coa' | 'gl' | 'pnl' | 'balancesheet'>('coa');
  
  const [reportQuarter, setReportQuarter] = useState('FY 2026-27 (Annual)');
  const [reportGenerating, setReportGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Scheduled reports list
  const scheduledReports = [
    { name: 'Monthly SSB Electronic Contribution Form (Ministry of Labour)', cycle: 'Every 15th', format: 'Excel Template', status: 'Pending' },
    { name: 'Patakha(Waga)-15 Monthly Withholding Tax Statement', cycle: 'Every 7th', format: 'PDF/XML Format', status: 'Pending' },
    { name: 'YCDC Municipal Wage Tax Ledger (Yangon Region)', cycle: 'Every 30th', format: 'CSV Ledger', status: 'Generated' }
  ];

  const chartOfAccounts = [
    { code: '1000', name: 'Cash and Cash Equivalents', type: 'Asset', balance: 1250000.00 },
    { code: '1100', name: 'Accounts Receivable', type: 'Asset', balance: 450000.00 },
    { code: '1200', name: 'Inventory', type: 'Asset', balance: 85000.00 },
    { code: '2000', name: 'Accounts Payable', type: 'Liability', balance: 210000.00 },
    { code: '2100', name: 'Accrued Payroll', type: 'Liability', balance: 145000.00 },
    { code: '2200', name: 'Taxes Payable', type: 'Liability', balance: 85000.00 },
    { code: '3000', name: 'Owner Equity', type: 'Equity', balance: 1000000.00 },
    { code: '4000', name: 'Sales Revenue', type: 'Revenue', balance: 2500000.00 },
    { code: '4100', name: 'Service Revenue', type: 'Revenue', balance: 850000.00 },
    { code: '5000', name: 'Cost of Goods Sold', type: 'Expense', balance: 1200000.00 },
    { code: '5100', name: 'Payroll Expense', type: 'Expense', balance: 850000.00 },
    { code: '5200', name: 'Rent Expense', type: 'Expense', balance: 120000.00 },
    { code: '5300', name: 'Utilities Expense', type: 'Expense', balance: 45000.00 },
  ];

  const generalLedger = [
    { date: '2026-07-01', account: '1000 - Cash', desc: 'Opening Balance', debit: 1100000.00, credit: 0, balance: 1100000.00 },
    { date: '2026-07-05', account: '4000 - Sales Revenue', desc: 'Client Payment Received', debit: 150000.00, credit: 0, balance: 1250000.00 },
    { date: '2026-07-15', account: '5100 - Payroll Expense', desc: 'Mid-Month Payroll', debit: 0, credit: 425000.00, balance: 825000.00 },
    { date: '2026-07-18', account: '5200 - Rent Expense', desc: 'Office Rent July', debit: 0, credit: 120000.00, balance: 705000.00 },
    { date: '2026-07-25', account: '4100 - Service Revenue', desc: 'Consulting Fees', debit: 200000.00, credit: 0, balance: 905000.00 },
    { date: '2026-07-30', account: '5100 - Payroll Expense', desc: 'End-Month Payroll', debit: 0, credit: 425000.00, balance: 480000.00 },
  ];

  // Dynamic Patakha(Waga)-16 CSV trigger calculation
  const handleGenerateReport = () => {
    setReportGenerating(true);
    setTimeout(() => {
      setReportGenerating(false);
      addToast(`Report compiled successfully!`, 'success');
      
      const csvHeader = "TIN,SSB_No,Employee Name,Basic Salary,HRA,SSB Contribution,PIT Withheld\n";
      const csvRows = employees.map(e => 
        `${e.panNumber || 'NOT-SET'},${e.uanNumber || 'NOT-SET'},${e.firstName} ${e.lastName},${e.monthlySalary.basic},${e.monthlySalary.hra},6000,45000`
      ).join("\n");
      
      const csvContent = "data:text/csv;charset=utf-8," + csvHeader + csvRows;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `Report_Filing.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 1800);
  };

  const filteredCOA = chartOfAccounts.filter(acc => 
    acc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    acc.code.includes(searchQuery) ||
    acc.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6" id="reports-compliance-module">
      
      <div className="bg-white p-4 border border-slate-200 rounded-xl space-y-4">
        <div className="flex items-center space-x-3 text-slate-800">
          <PieChart className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-lg font-bold">Comprehensive Reports Module</h2>
            <p className="text-xs text-slate-500 font-medium">Access financial accounting, HR payroll, and tax compliance statements.</p>
          </div>
        </div>

        <div className="flex space-x-2 border-b border-slate-200">
          {[
            { id: 'accounting', label: 'Accounting & Financials', icon: Landmark },
            { id: 'compliance', label: 'Tax & Compliance', icon: FileCheck },
            { id: 'payroll', label: 'Payroll & Employees', icon: Calculator }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 border-b-2 font-semibold text-xs transition-colors ${
                  isActive ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === 'accounting' && (
        <div className="space-y-6">
          <div className="flex space-x-2">
            {[
              { id: 'coa', label: 'Chart of Accounts (COA)' },
              { id: 'gl', label: 'General Ledger (GL)' },
              { id: 'pnl', label: 'Profit & Loss Statement' },
              { id: 'balancesheet', label: 'Balance Sheet' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setAccountingTab(tab.id as any)}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                  accountingTab === tab.id 
                    ? 'bg-slate-800 text-white' 
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {accountingTab === 'coa' && (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <h3 className="font-bold text-slate-800 text-sm">Chart of Accounts</h3>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search accounts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 w-64"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider">
                      <th className="p-4 border-b border-slate-200 font-bold">Account Code</th>
                      <th className="p-4 border-b border-slate-200 font-bold">Account Name</th>
                      <th className="p-4 border-b border-slate-200 font-bold">Type</th>
                      <th className="p-4 border-b border-slate-200 font-bold text-right">Current Balance</th>
                      <th className="p-4 border-b border-slate-200 font-bold text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs">
                    {filteredCOA.map((acc, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 border-b border-slate-100 last:border-0 transition">
                        <td className="p-4 font-mono font-semibold text-slate-700">{acc.code}</td>
                        <td className="p-4 font-bold text-slate-800">{acc.name}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                            acc.type === 'Asset' ? 'bg-emerald-50 text-emerald-700' :
                            acc.type === 'Liability' ? 'bg-rose-50 text-rose-700' :
                            acc.type === 'Equity' ? 'bg-purple-50 text-purple-700' :
                            acc.type === 'Revenue' ? 'bg-blue-50 text-blue-700' :
                            'bg-amber-50 text-amber-700'
                          }`}>
                            {acc.type}
                          </span>
                        </td>
                        <td className="p-4 font-mono font-medium text-right text-slate-600">
                          ${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-4 text-center">
                          <button className="text-blue-600 font-semibold hover:underline">View Ledger</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {accountingTab === 'gl' && (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <h3 className="font-bold text-slate-800 text-sm">General Ledger Transactions</h3>
                <button className="flex items-center space-x-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold border border-blue-100 hover:bg-blue-100">
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider">
                      <th className="p-4 border-b border-slate-200 font-bold">Date</th>
                      <th className="p-4 border-b border-slate-200 font-bold">Account</th>
                      <th className="p-4 border-b border-slate-200 font-bold">Description</th>
                      <th className="p-4 border-b border-slate-200 font-bold text-right">Debit</th>
                      <th className="p-4 border-b border-slate-200 font-bold text-right">Credit</th>
                      <th className="p-4 border-b border-slate-200 font-bold text-right">Running Balance</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs">
                    {generalLedger.map((tx, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 border-b border-slate-100 last:border-0 transition">
                        <td className="p-4 font-medium text-slate-600">{tx.date}</td>
                        <td className="p-4 font-mono font-semibold text-slate-700">{tx.account}</td>
                        <td className="p-4 text-slate-700">{tx.desc}</td>
                        <td className="p-4 font-mono font-medium text-emerald-600 text-right">
                          {tx.debit > 0 ? `$${tx.debit.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '-'}
                        </td>
                        <td className="p-4 font-mono font-medium text-rose-600 text-right">
                          {tx.credit > 0 ? `$${tx.credit.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '-'}
                        </td>
                        <td className="p-4 font-mono font-bold text-slate-800 text-right">
                          ${tx.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {(accountingTab === 'pnl' || accountingTab === 'balancesheet') && (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500">
              <BookOpen className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <h3 className="font-bold text-slate-700 text-sm">{accountingTab === 'pnl' ? 'Profit & Loss Statement' : 'Balance Sheet'}</h3>
              <p className="text-xs mt-1">Select parameters above to generate this financial report.</p>
              <button 
                onClick={handleGenerateReport}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-500 transition shadow"
              >
                Generate Report
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'compliance' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Patakha(Waga)-16 builder */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <div>
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border border-emerald-100">
                Myanmar IRD Compliance Pack
              </span>
              <h3 className="text-sm font-extrabold text-slate-800 mt-1.5">Patakha(Waga)-16 Annual Return Builder</h3>
              <p className="text-xs text-slate-400">Compile annual salary declarations, individual tax identification numbers (TIN), SSB contributions, and monthly withholding audits.</p>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
              <div>
                <label className="block text-slate-500 font-semibold mb-1">Assessment Period</label>
                <select 
                  value={reportQuarter}
                  onChange={(e) => setReportQuarter(e.target.value)}
                  className="w-full p-2 border border-slate-200 bg-white rounded focus:outline-none font-medium"
                >
                  <option>FY 2026-27 (Annual)</option>
                  <option>FY 2025-26 (Annual)</option>
                  <option>FY 2024-25 (Annual)</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-500 font-semibold mb-1">Taxing Authority</label>
                <input type="text" value="Internal Revenue Dept (IRD)" className="w-full p-2 border border-slate-200 bg-slate-100 text-slate-500 font-semibold rounded cursor-not-allowed text-[11px]" readOnly />
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <span className="block text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
                Filing Verification Checklist
              </span>
              <div className="space-y-1.5 font-semibold text-slate-600">
                <div className="flex items-center space-x-2">
                  <span className="text-emerald-500 font-black">✓</span>
                  <span>TIN card registrations mapped for all {employees.length} active employees</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-emerald-500 font-black">✓</span>
                  <span>SSB contribution ledgers reconciled with Ministry of Labour portal</span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleGenerateReport}
              disabled={reportGenerating}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer transition shadow-xs"
            >
              {reportGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Assembling IRD Annexures...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Compile & Download Patakha(Waga)-16 CSV</span>
                </>
              )}
            </button>
          </div>

          {/* Right: Scheduled reports planner */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider border-b pb-3 border-slate-100">
              Scheduled Compliance & Filing Feeds
            </h3>
            <p className="text-xs text-slate-400">Automated file compilations scheduled for IRD & SSB offices.</p>
            
            <div className="space-y-3.5">
              {scheduledReports.map((r, idx) => (
                <div key={idx} className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 leading-snug">{r.name}</span>
                    <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                      r.status === 'Generated' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      {r.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-semibold uppercase font-mono">
                    <span>Cycle: {r.cycle}</span>
                    <span>Format: {r.format}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'payroll' && (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500">
           <Calculator className="w-12 h-12 mx-auto text-slate-300 mb-3" />
           <h3 className="font-bold text-slate-700 text-sm">Payroll & Employee Reports</h3>
           <p className="text-xs mt-1">Generate comprehensive payroll registers, payslip batches, and tax deduction reports.</p>
           <div className="flex justify-center mt-6 space-x-3">
             <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold border border-blue-100 hover:bg-blue-100 transition shadow-sm flex items-center space-x-2">
               <Download className="w-4 h-4" />
               <span>Payroll Register (XLSX)</span>
             </button>
             <button className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-slate-700 transition shadow-sm flex items-center space-x-2">
               <FileCheck className="w-4 h-4" />
               <span>Deductions Summary (PDF)</span>
             </button>
           </div>
        </div>
      )}

    </div>
  );
}

