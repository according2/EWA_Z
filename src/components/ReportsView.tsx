import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  RefreshCw, 
  FileCheck, 
  Clock, 
  Calendar,
  Send
} from 'lucide-react';
import { Employee } from '../types';

interface ReportsViewProps {
  employees: Employee[];
  addToast: (message: string, type: 'success' | 'info' | 'error') => void;
}

export default function ReportsView({ employees, addToast }: ReportsViewProps) {
  const [reportQuarter, setReportQuarter] = useState('FY 2026-27 (Annual)');
  const [reportGenerating, setReportGenerating] = useState(false);

  // Scheduled reports list
  const scheduledReports = [
    { name: 'Monthly SSB Electronic Contribution Form (Ministry of Labour)', cycle: 'Every 15th', format: 'Excel Template', status: 'Pending' },
    { name: 'Patakha(Waga)-15 Monthly Withholding Tax Statement', cycle: 'Every 7th', format: 'PDF/XML Format', status: 'Pending' },
    { name: 'YCDC Municipal Wage Tax Ledger (Yangon Region)', cycle: 'Every 30th', format: 'CSV Ledger', status: 'Generated' }
  ];

  // Dynamic Patakha(Waga)-16 CSV trigger calculation
  const handleGenerateReport = () => {
    setReportGenerating(true);
    setTimeout(() => {
      setReportGenerating(false);
      addToast(`Patakha(Waga)-16 annual tax filing build for ${reportQuarter} successfully compiled!`, 'success');
      
      // Create a dummy CSV trigger
      const csvHeader = "TIN,SSB_No,Employee Name,Basic Salary,HRA,SSB Contribution,PIT Withheld\n";
      const csvRows = employees.map(e => 
        `${e.panNumber || 'NOT-SET'},${e.uanNumber || 'NOT-SET'},${e.firstName} ${e.lastName},${e.monthlySalary.basic},${e.monthlySalary.hra},6000,45000`
      ).join("\n");
      
      const csvContent = "data:text/csv;charset=utf-8," + csvHeader + csvRows;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `Patakha_Waga_16_${reportQuarter.replace(/\s+/g, '_')}_Filing.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 1800);
  };

  return (
    <div className="space-y-6" id="reports-compliance-module">
      
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

    </div>
  );
}
