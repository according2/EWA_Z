import React from 'react';
import { ShieldAlert, Briefcase, Activity, Landmark, TrendingUp, Users, DollarSign, FileText } from 'lucide-react';

export function ProviderDashboardView() {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold mb-1">EWA Provider Command Center</h2>
          <p className="text-slate-400 text-sm">System-wide performance, liquidity pools, and underwriting metrics.</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-xl text-center">
          <p className="text-slate-400 text-[10px] uppercase tracking-wider font-bold">Total Liquidity Disbursed (MTD)</p>
          <p className="text-2xl font-mono font-bold text-emerald-400 mt-1">45,250,000 Ks</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Client Employers', value: '142', icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Total Enrolled Employees', value: '45.2K', icon: Users, color: 'text-purple-500', bg: 'bg-purple-50' },
          { label: 'Default Rate', value: '0.12%', icon: ShieldAlert, color: 'text-rose-500', bg: 'bg-rose-50' },
          { label: 'Est. Revenue (Fees)', value: '1.2M Ks', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        ].map(stat => (
          <div key={stat.label} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center space-x-4">
            <div className={`p-3 rounded-full ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{stat.label}</p>
              <p className="text-lg font-bold text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center"><Activity className="w-4 h-4 mr-2 text-blue-500" /> System Health & API</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
              <span className="text-slate-600 font-medium">Core Banking Integration (CB Bank)</span>
              <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-xs font-bold">100% Uptime</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
              <span className="text-slate-600 font-medium">Payment Gateway (KBZPay)</span>
              <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-xs font-bold">99.9% Uptime</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600 font-medium">Average Disbursement Latency</span>
              <span className="font-mono font-bold text-slate-800">1.2 seconds</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center"><TrendingUp className="w-4 h-4 mr-2 text-purple-500" /> Recent EWA Velocity</h3>
          <div className="h-40 flex items-end justify-between space-x-2 px-2 pb-2">
            {[40, 70, 45, 90, 65, 100, 85].map((val, i) => (
              <div key={i} className="w-full bg-blue-100 rounded-t-sm relative group">
                <div 
                  className="absolute bottom-0 w-full bg-blue-500 rounded-t-sm transition-all duration-500 hover:bg-blue-600"
                  style={{ height: `${val}%` }}
                ></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase mt-2 px-2">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProviderSalesView() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-sm">
      <div className="p-5 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-slate-800">Client Organizations (Employers)</h3>
          <p className="text-xs text-slate-500 mt-1">Manage B2B employer accounts and their respective underwriting limits.</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-lg hover:bg-blue-700">
          + Onboard Employer
        </button>
      </div>
      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
          <tr>
            <th className="p-4">Employer ID & Name</th>
            <th className="p-4">Status</th>
            <th className="p-4">Enrolled Staff</th>
            <th className="p-4">EWA Fee Model</th>
            <th className="p-4 text-right">Mothly Limit (Ks)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {[
            { id: 'ORG-001', name: 'Zylker Tech', status: 'Active', staff: 145, fee: 'Employer Paid (1500 Ks/tx)', limit: '50M' },
            { id: 'ORG-042', name: 'Acme Logistics', status: 'Active', staff: 850, fee: 'Employee Paid (3%)', limit: '200M' },
            { id: 'ORG-089', name: 'Global Retail', status: 'Pending KYC', staff: 320, fee: 'Hybrid Model', limit: '75M' },
          ].map(org => (
            <tr key={org.id} className="hover:bg-slate-50">
              <td className="p-4">
                <span className="block font-bold text-slate-800">{org.name}</span>
                <span className="text-xs text-slate-400 font-mono">{org.id}</span>
              </td>
              <td className="p-4">
                <span className={`px-2 py-1 text-[10px] font-bold rounded ${
                  org.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {org.status}
                </span>
              </td>
              <td className="p-4 font-semibold text-slate-600">{org.staff}</td>
              <td className="p-4 text-xs text-slate-500">{org.fee}</td>
              <td className="p-4 text-right font-mono font-bold text-slate-700">{org.limit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ProviderFinancesView() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-sm">
      <div className="p-5 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-slate-800">Treasury & Liquidity Ledger</h3>
          <p className="text-xs text-slate-500 mt-1">Real-time view of master disbursement accounts and collection reconciliations.</p>
        </div>
      </div>
      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
          <tr>
            <th className="p-4">Tx ID / Date</th>
            <th className="p-4">Type</th>
            <th className="p-4">Employer / Destination</th>
            <th className="p-4 text-right">Debit (Ks)</th>
            <th className="p-4 text-right">Credit (Ks)</th>
            <th className="p-4 text-right">Running Balance (Ks)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {[
            { id: 'TRX-9982', date: '2026-07-30', type: 'EWA Advance', dest: 'Employee E-1004 (Zylker)', debit: '50,000', credit: '-', bal: '4,850,000' },
            { id: 'TRX-9983', date: '2026-07-30', type: 'Platform Fee', dest: 'System Revenue', debit: '-', credit: '1,500', bal: '4,851,500' },
            { id: 'TRX-9984', date: '2026-07-31', type: 'Repayment', dest: 'Zylker Tech Payroll Deduction', debit: '-', credit: '300,000', bal: '5,151,500' },
          ].map(trx => (
            <tr key={trx.id} className="hover:bg-slate-50 font-mono">
              <td className="p-4">
                <span className="block font-bold text-slate-800">{trx.id}</span>
                <span className="text-xs text-slate-400 font-sans">{trx.date}</span>
              </td>
              <td className="p-4 text-xs font-sans font-semibold text-slate-600">{trx.type}</td>
              <td className="p-4 text-xs font-sans text-slate-500 truncate max-w-[150px]">{trx.dest}</td>
              <td className="p-4 text-right text-rose-600">{trx.debit}</td>
              <td className="p-4 text-right text-emerald-600">{trx.credit}</td>
              <td className="p-4 text-right font-bold text-slate-800">{trx.bal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ProviderRiskView() {
  return (
    <div className="space-y-6">
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 shadow-sm flex items-start space-x-4">
        <ShieldAlert className="w-6 h-6 text-rose-600 mt-1" />
        <div>
          <h3 className="font-bold text-rose-800">Risk & Exposure Alerts</h3>
          <p className="text-sm text-rose-700 mt-1">Acme Logistics (ORG-042) is nearing 90% of their monthly EWA liquidity limit. Recommend reviewing their treasury deposit terms.</p>
          <button className="mt-3 px-3 py-1.5 bg-rose-600 text-white font-bold text-xs rounded hover:bg-rose-700">Review Exposure</button>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-center text-slate-500">
        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="font-bold text-slate-800">Underwriting Engine Console</h3>
        <p className="text-sm mt-2 max-w-md mx-auto">Configure systemic limits, dynamic advance caps, and automated KYC/KYB approval workflows for employers.</p>
      </div>
    </div>
  );
}

export function ProviderOperationsView() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-center text-slate-500">
      <Activity className="w-12 h-12 text-slate-300 mx-auto mb-4" />
      <h3 className="font-bold text-slate-800">Operations Control Center</h3>
      <p className="text-sm mt-2 max-w-md mx-auto">Manage disbursement queues, monitor API webhook failures, and resolve employee escalation tickets.</p>
    </div>
  );
}
