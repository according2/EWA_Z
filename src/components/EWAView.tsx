import React, { useState } from 'react';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  HelpCircle,
  ArrowUpRight,
  ShieldAlert,
  Sliders,
  DollarSign,
  UserCheck
} from 'lucide-react';
import { EWARequest, Employee } from '../types';

interface EWAViewProps {
  ewaRequests: EWARequest[];
  setEwaRequests: React.Dispatch<React.SetStateAction<EWARequest[]>>;
  employees: Employee[];
  onDisburseEwa: (empId: string, amount: number) => void;
  addToast: (message: string, type: 'success' | 'info' | 'error') => void;
}

export default function EWAView({ 
  ewaRequests, 
  setEwaRequests, 
  employees, 
  onDisburseEwa, 
  addToast 
}: EWAViewProps) {
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Processed'>('All');
  
  // Stats
  const totalRequests = ewaRequests.length;
  const pendingRequests = ewaRequests.filter(r => r.status === 'Pending');
  const disbursedRequests = ewaRequests.filter(r => r.status === 'Disbursed');
  const totalDisbursedAmt = disbursedRequests.reduce((sum, r) => sum + r.requestedAmount, 0);
  
  const utilizationRate = Math.round((disbursedRequests.length / (employees.length || 1)) * 100);

  // Filtered requests
  const filteredRequests = ewaRequests.filter(req => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Pending') return req.status === 'Pending';
    return req.status === 'Approved' || req.status === 'Disbursed' || req.status === 'Rejected';
  });

  const handleStatusChange = (requestId: string, newStatus: 'Approved' | 'Rejected' | 'Disbursed') => {
    setEwaRequests(prev => prev.map(req => {
      if (req.id !== requestId) return req;
      return { ...req, status: newStatus };
    }));

    const targetRequest = ewaRequests.find(r => r.id === requestId);
    if (!targetRequest) return;

    if (newStatus === 'Approved') {
      addToast(`EWA request approved for ${targetRequest.employeeName}. Ready for automated bank advance transfer.`, 'success');
    } else if (newStatus === 'Rejected') {
      addToast(`EWA request for ${targetRequest.employeeName} was rejected.`, 'info');
    } else if (newStatus === 'Disbursed') {
      // Core linking trigger: Disburse the advance to employee's bank account, which triggers recovery setup!
      onDisburseEwa(targetRequest.employeeId, targetRequest.requestedAmount);
      addToast(`Advance salary disbursed. Ks ${targetRequest.requestedAmount.toLocaleString()} has been sent to ${targetRequest.employeeName}'s registered bank account and scheduled for recovery.`, 'success');
    }
  };

  return (
    <div className="space-y-6" id="ewa-module">
      
      {/* Overview stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Disbursed Advances</span>
          <span className="text-xl font-extrabold text-slate-800 mt-1 block">Ks {totalDisbursedAmt.toLocaleString()}</span>
          <span className="text-[11px] text-emerald-600 font-semibold block mt-1.5">Scheduled for repayment in July</span>
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Pending EWA Queue</span>
          <span className="text-xl font-extrabold text-slate-800 mt-1 block">{pendingRequests.length} Requests</span>
          <span className="text-[11px] text-slate-500 font-medium block mt-1.5">
            Summing to Ks {pendingRequests.reduce((sum, r) => sum + r.requestedAmount, 0).toLocaleString()}
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">EWA Utilization Rate</span>
          <span className="text-xl font-extrabold text-slate-800 mt-1 block">{utilizationRate}%</span>
          <span className="text-[11px] text-slate-500 font-medium block mt-1.5">Ratio of active employee base</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Security Safeguard</span>
          <div className="mt-2 text-xs text-slate-700 font-bold flex items-center space-x-1.5">
            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-[10px] font-bold">50% MAX LIMIT</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium block mt-3">Protects company cash liquidity</span>
        </div>
      </div>

      {/* Explanatory card */}
      <div className="bg-blue-50/20 border border-blue-200 rounded-xl p-5 flex items-start space-x-4">
        <span className="p-2 bg-blue-50 text-blue-600 rounded-lg mt-0.5 shrink-0">
          <HelpCircle className="w-5 h-5" />
        </span>
        <div className="space-y-1 text-xs">
          <h4 className="font-bold text-slate-800 text-sm">How does Earned Wage Access (EWA) work?</h4>
          <p className="text-slate-600 leading-relaxed font-normal">
            Earned Wage Access (EWA) is a high-demand financial wellness benefit. Staff members draw up to 50% of the wages they have already earned (accrued) up to the current day in the active month. Because the funds represent already-rendered service, disbursement has zero interest. The full amount is automatically added to the upcoming pay run's recovery ledger, guaranteeing <strong className="text-slate-800">100% repayment security</strong>.
          </p>
        </div>
      </div>

      {/* Requests ledger list */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">Advance Requests Ledger</h3>
            <p className="text-slate-500 text-[11px] mt-0.5 font-medium">Verify employee accrued wages and authorize instant disbursement</p>
          </div>

          {/* Filter switcher */}
          <div className="flex bg-slate-100 rounded-lg p-1 text-[10px] font-bold">
            {(['All', 'Pending', 'Processed'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded transition-all ${
                  activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 tracking-wider">
                <th className="p-4 pl-6">Applicant Name / Department</th>
                <th className="p-4">Request Date</th>
                <th className="p-4 text-right">Accrued Wage limit</th>
                <th className="p-4 text-right">Requested Advance</th>
                <th className="p-4">Repayment Cycle</th>
                <th className="p-4 text-center">Request Status</th>
                <th className="p-4 text-center">Administrative Approval</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    No EWA requests matching this filter are currently in the ledger.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="p-4 pl-6">
                      <div>
                        <span className="font-bold text-slate-800 block">{req.employeeName}</span>
                        <span className="text-[10px] text-slate-400 block font-semibold uppercase">{req.department} &bull; {req.employeeId}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-500 font-medium">
                      {req.requestDate}
                    </td>
                    <td className="p-4 text-right font-mono font-semibold text-slate-600">
                      Ks {req.accruedSalary.toLocaleString()}
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-blue-700">
                      Ks {req.requestedAmount.toLocaleString()}
                    </td>
                    <td className="p-4 text-slate-500 font-semibold">
                      {req.repaymentPayCycle} payroll
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border inline-block ${
                        req.status === 'Disbursed'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                          : req.status === 'Approved'
                          ? 'bg-blue-50 border-blue-200 text-blue-700'
                          : req.status === 'Rejected'
                          ? 'bg-red-50 border-red-200 text-red-700'
                          : 'bg-amber-50 border-amber-200 text-amber-700 animate-pulse'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {req.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(req.id, 'Approved')}
                              className="px-2.5 py-1 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusChange(req.id, 'Rejected')}
                              className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {req.status === 'Approved' && (
                          <button
                            onClick={() => handleStatusChange(req.id, 'Disbursed')}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded transition-all flex items-center space-x-1"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                            <span>Transfer Funds</span>
                          </button>
                        )}

                        {req.status === 'Disbursed' && (
                          <span className="text-[10px] text-slate-400 font-medium flex items-center space-x-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Advance Disbursed</span>
                          </span>
                        )}

                        {req.status === 'Rejected' && (
                          <span className="text-[10px] text-slate-400 font-medium flex items-center space-x-1">
                            <XCircle className="w-3.5 h-3.5 text-red-500" />
                            <span>Rejected & Closed</span>
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
