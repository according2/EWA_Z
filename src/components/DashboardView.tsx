import React from 'react';
import { 
  Users, 
  CreditCard, 
  Clock, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  UserPlus,
  Percent,
  Calculator
} from 'lucide-react';
import { Employee, PayRun, EWARequest } from '../types';

interface DashboardViewProps {
  employees: Employee[];
  payRuns: PayRun[];
  ewaRequests: EWARequest[];
  taxFilings: any[];
  setActiveTab: (tab: string) => void;
}

export default function DashboardView({ 
  employees, 
  payRuns, 
  ewaRequests, 
  taxFilings, 
  setActiveTab 
}: DashboardViewProps) {
  // Compute dynamic stats based on props
  const activeEmployees = employees.filter(e => e.status === 'Active').length;
  const onboardingEmployees = employees.filter(e => e.status === 'Onboarding').length;
  
  // July 2026 Draft Payrun
  const activePayRun = payRuns.find(p => p.status === 'Draft') || payRuns[0];
  const totalPayrollGross = activePayRun?.totalGrossEarnings || 0;
  const totalNetDisbursement = activePayRun?.totalNetPay || 0;
  
  const pendingEwa = ewaRequests.filter(r => r.status === 'Pending');
  const totalPendingEwaAmt = pendingEwa.reduce((sum, r) => sum + r.requestedAmount, 0);

  // Department counts for Donut Chart
  const deptCounts: { [key: string]: number } = {};
  employees.forEach(emp => {
    deptCounts[emp.department] = (deptCounts[emp.department] || 0) + 1;
  });
  const deptData = Object.entries(deptCounts).map(([name, value]) => ({ name, value }));
  const totalEmployees = employees.length;

  // Render SVG Donut segments
  let cumulativePercent = 0;
  const donutSegments = deptData.map((dept, index) => {
    const percentage = dept.value / totalEmployees;
    const strokeDasharray = `${percentage * 100} ${100 - percentage * 100}`;
    const strokeDashoffset = -cumulativePercent * 100;
    cumulativePercent += percentage;

    const colors = [
      'stroke-blue-600',
      'stroke-indigo-500',
      'stroke-amber-500',
      'stroke-emerald-500',
      'stroke-rose-500'
    ];
    const colorClass = colors[index % colors.length];
    
    return {
      ...dept,
      percentage,
      strokeDasharray,
      strokeDashoffset,
      colorClass,
      bgClass: colorClass.replace('stroke-', 'bg-')
    };
  });

  return (
    <div className="space-y-8 p-1">
      {/* Overview Metric Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 flex items-center justify-between shadow-sm">
          <div>
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Force</span>
            <span className="block text-3xl font-extrabold text-slate-800 mt-1">{activeEmployees}</span>
            <span className="text-[11px] text-slate-500 font-medium block mt-1.5">
              {onboardingEmployees} currently onboarding
            </span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 flex items-center justify-between shadow-sm">
          <div>
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Pay Run CTC</span>
            <span className="block text-3xl font-extrabold text-slate-800 mt-1">Ks {(totalPayrollGross / 100000).toFixed(2)}L</span>
            <span className="text-[11px] text-slate-500 font-medium block mt-1.5">
              Cycle: {activePayRun?.billingMonth || 'July 2026'}
            </span>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 flex items-center justify-between shadow-sm">
          <div>
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Net Disbursement</span>
            <span className="block text-3xl font-extrabold text-slate-800 mt-1">Ks {(totalNetDisbursement / 100000).toFixed(2)}L</span>
            <span className="text-[11px] text-emerald-600 font-semibold block mt-1.5">
              Statutory Deductions applied
            </span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 flex items-center justify-between shadow-sm">
          <div>
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">EWA Advances Pending</span>
            <span className="block text-3xl font-extrabold text-slate-800 mt-1">
              {pendingEwa.length > 0 ? `Ks ${(totalPendingEwaAmt / 1000).toFixed(0)}k` : 'Ks 0'}
            </span>
            <span className="text-[11px] text-amber-600 font-semibold block mt-1.5">
              {pendingEwa.length} requests awaiting check
            </span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Primary Payroll Alert Card */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50/20 border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800">
              ACTION REQUIRED
            </span>
            <h3 className="font-bold text-slate-800 text-sm">Review & Process {activePayRun?.billingMonth} Payroll</h3>
          </div>
          <p className="text-slate-600 text-xs max-w-2xl leading-relaxed">
            The {activePayRun?.billingMonth} draft pay run has been processed. Total net disbursement is <strong className="text-slate-700">Ks {totalNetDisbursement.toLocaleString()}</strong> for {activePayRun?.totalEmployees} employees. Confirm the attendance checklist, deduction adjustments, and EWA recoveries before executing the bank disbursement.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('payruns')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center space-x-2 transition-colors shrink-0"
        >
          <span>Go to Active Pay Run</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Charts & compliance section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Salary Cost Trends Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Monthly Net Disbursement</h3>
              <p className="text-slate-500 text-[11px]">Salary disbursement trend over past cycles</p>
            </div>
            <span className="text-[11px] text-slate-400 font-medium font-mono">Financial Year 2026-27</span>
          </div>
          
          {/* Custom SVG Bar Chart */}
          <div className="h-64 flex flex-col justify-between pt-4">
            <div className="flex-1 flex items-end justify-between px-4 relative">
              {/* Grid Lines */}
              <div className="absolute inset-x-0 top-0 border-t border-slate-100 h-0 w-full"></div>
              <div className="absolute inset-x-0 top-1/3 border-t border-slate-100 h-0 w-full"></div>
              <div className="absolute inset-x-0 top-2/3 border-t border-slate-100 h-0 w-full"></div>
              <div className="absolute inset-x-0 bottom-0 border-t border-slate-200 h-0 w-full"></div>

              {/* Data Bars */}
              <div className="flex flex-col items-center group z-10 w-16">
                <span className="text-[10px] font-bold text-slate-500 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">3.8M Ks</span>
                <div className="w-8 bg-slate-200 hover:bg-slate-300 transition-all rounded-t-md h-36"></div>
                <span className="text-xs font-semibold text-slate-500 mt-2">Apr 26</span>
              </div>
              <div className="flex flex-col items-center group z-10 w-16">
                <span className="text-[10px] font-bold text-slate-500 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">3.9M Ks</span>
                <div className="w-8 bg-slate-200 hover:bg-slate-300 transition-all rounded-t-md h-40"></div>
                <span className="text-xs font-semibold text-slate-500 mt-2">May 26</span>
              </div>
              <div className="flex flex-col items-center group z-10 w-16">
                <span className="text-[10px] font-bold text-slate-700 mb-2 opacity-100 transition-opacity duration-150 font-mono">4.0M Ks</span>
                <div className="w-8 bg-slate-400 hover:bg-slate-500 transition-all rounded-t-md h-44"></div>
                <span className="text-xs font-semibold text-slate-600 mt-2">Jun 26</span>
              </div>
              <div className="flex flex-col items-center group z-10 w-16">
                <span className="text-[10px] font-bold text-blue-700 mb-2 opacity-100 transition-opacity duration-150 font-mono">4.3M Ks</span>
                <div className="w-8 bg-blue-600 hover:bg-blue-700 transition-all rounded-t-md h-48 shadow-md shadow-blue-500/10"></div>
                <span className="text-xs font-bold text-blue-700 mt-2">Jul 26 (Draft)</span>
              </div>
              <div className="flex flex-col items-center group z-10 w-16">
                <span className="text-[10px] font-bold text-slate-400 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">4.5M Ks</span>
                <div className="w-8 bg-slate-100 border-dashed border border-slate-200 rounded-t-md h-52"></div>
                <span className="text-xs font-semibold text-slate-400 mt-2">Aug 26 (Est)</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium px-4 mt-4 border-t border-slate-100 pt-3">
              <span>* Projected figures based on current employee onboarding trajectory.</span>
              <span className="text-slate-500 font-bold">100% Automatic Recovery</span>
            </div>
          </div>
        </div>

        {/* Headcount by Department Donut Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-800 text-sm">Department Distribution</h3>
          <p className="text-slate-500 text-[11px] mb-6">Staff count allocation across departments</p>

          <div className="flex flex-col items-center justify-center">
            {/* Donut SVG */}
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 42 42">
                <circle
                  className="stroke-slate-100"
                  cx="21"
                  cy="21"
                  r="15.915"
                  fill="transparent"
                  strokeWidth="4.5"
                />
                {donutSegments.map((seg, i) => (
                  <circle
                    key={seg.name}
                    className={`${seg.colorClass} transition-all duration-300`}
                    cx="21"
                    cy="21"
                    r="15.915"
                    fill="transparent"
                    strokeWidth="4.5"
                    strokeDasharray={seg.strokeDasharray}
                    strokeDashoffset={seg.strokeDashoffset}
                  />
                ))}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold text-slate-800">{totalEmployees}</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Members</span>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-6 w-full space-y-2 text-xs">
              {donutSegments.map((seg) => (
                <div key={seg.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-slate-600">
                    <span className={`w-2.5 h-2.5 rounded-full ${seg.bgClass}`}></span>
                    <span className="font-medium text-slate-700">{seg.name}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-600">
                    {seg.value} ({Math.round(seg.percentage * 100)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Checklist & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Compliance checklist */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Compliance & Tax Filings</h3>
              <p className="text-slate-500 text-[11px]">Statutory returns and mandatory form submissions</p>
            </div>
            <button
              onClick={() => setActiveTab('taxfilings')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-1"
            >
              <span>View All Compliance</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {taxFilings.slice(0, 4).map((filing) => (
              <div key={filing.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  {filing.status === 'Filed' || filing.status === 'Generated' ? (
                    <span className="p-1 bg-emerald-50 text-emerald-600 rounded-full">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                  ) : (
                    <span className="p-1 bg-amber-50 text-amber-600 rounded-full">
                      <AlertCircle className="w-4 h-4" />
                    </span>
                  )}
                  <div>
                    <span className="font-bold text-slate-700 block">{filing.formType}</span>
                    <span className="text-[10px] text-slate-400 font-medium">Financial Year {filing.financialYear}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div>
                    <span className="text-slate-400 block text-[10px] text-right font-semibold uppercase tracking-wider">Due Date</span>
                    <span className="font-medium text-slate-600 text-right block">{filing.dueDate}</span>
                  </div>
                  <div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold inline-block border white-space:nowrap ${
                      filing.status === 'Filed' 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                        : filing.status === 'Generated'
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : filing.status === 'Pending'
                        ? 'bg-red-50 border-red-200 text-red-700'
                        : 'bg-amber-50 border-amber-200 text-amber-700'
                    }`}>
                      {filing.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Panel */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Quick Administrative Links</h3>
            <p className="text-slate-500 text-[11px] mb-6">Perform quick actions with visual assistants</p>

            <div className="space-y-3">
              <button
                onClick={() => setActiveTab('employees')}
                className="w-full text-left p-3 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all flex items-center space-x-3 text-xs"
              >
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                  <UserPlus className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="font-bold text-slate-700 block">Onboard New Employee</span>
                  <span className="text-[10px] text-slate-400 font-medium">Launch standard multi-step portal</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('deductions')}
                className="w-full text-left p-3 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all flex items-center space-x-3 text-xs"
              >
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg shrink-0">
                  <Percent className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="font-bold text-slate-700 block">Manage Deductions File</span>
                  <span className="text-[10px] text-slate-400 font-medium">Upload adjustments CSV / bulk edits</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className="w-full text-left p-3 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all flex items-center space-x-3 text-xs"
              >
                <div className="p-2 bg-slate-100 text-slate-600 rounded-lg shrink-0">
                  <Calculator className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="font-bold text-slate-700 block">Statutory CTC Config</span>
                  <span className="text-[10px] text-slate-400 font-medium">Manage Provident Fund (PF) slabs</span>
                </div>
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400 text-center font-medium">
            Next regular pay schedule: <strong className="text-slate-600">30th July, 2026</strong>
          </div>
        </div>

      </div>
    </div>
  );
}
