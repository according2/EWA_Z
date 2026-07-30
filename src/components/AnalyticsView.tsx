import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  CreditCard, 
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Employee } from '../types';

interface AnalyticsViewProps {
  employees: Employee[];
}

export default function AnalyticsView({ employees }: AnalyticsViewProps) {
  const [activeChart, setActiveChart] = useState<'budget' | 'ewa' | 'headcount'>('budget');

  // Calculating headcount by departments
  const engHeadcount = employees.filter(e => e.department === 'Engineering').length;
  const pmHeadcount = employees.filter(e => e.department === 'Product Management').length;
  const hrHeadcount = employees.filter(e => e.department === 'Human Resources').length;
  const designHeadcount = employees.filter(e => e.department === 'Design').length;
  const csHeadcount = employees.filter(e => e.department === 'Customer Success').length;

  return (
    <div className="space-y-6" id="analytics-module-view">
      
      {/* Top Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Employees</span>
            <span className="text-xl font-black text-slate-800 block mt-0.5">{employees.length} EMPs</span>
            <span className="text-[10px] text-emerald-600 font-bold">↑ +1 New Joiner (July)</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Monthly Gross Pay</span>
            <span className="text-xl font-black text-slate-800 block mt-0.5">7,800,000 Ks</span>
            <span className="text-[10px] text-slate-400 font-semibold">Average: 1,300,000 Ks / employee</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">EWA Liquidity Rate</span>
            <span className="text-xl font-black text-slate-800 block mt-0.5">15.2%</span>
            <span className="text-[10px] text-indigo-600 font-bold">3 active advances requested</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left hand: BI Interactive Chart (High Fidelity) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Payroll BI Visualizer</h3>
              <p className="text-[11px] text-slate-400">High fidelity allocation parameters and corporate cost distributions.</p>
            </div>
            <div className="flex space-x-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button 
                onClick={() => setActiveChart('budget')} 
                className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition ${
                  activeChart === 'budget' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Dept Budgets
              </button>
              <button 
                onClick={() => setActiveChart('ewa')} 
                className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition ${
                  activeChart === 'ewa' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                EWA Trends
              </button>
              <button 
                onClick={() => setActiveChart('headcount')} 
                className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition ${
                  activeChart === 'headcount' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Headcount
              </button>
            </div>
          </div>

          {/* Render High Fidelity SVG/CSS Charts */}
          <div className="h-64 flex items-end justify-between bg-slate-50/50 p-6 rounded-xl border border-slate-100/50 relative">
            {activeChart === 'budget' && (
              <>
                <div className="flex flex-col items-center space-y-2 w-1/5">
                  <span className="text-[10px] font-mono text-slate-500 font-bold">55%</span>
                  <div className="w-8 bg-blue-600 rounded-t-lg transition-all duration-500" style={{ height: '140px' }}></div>
                  <span className="text-[10px] font-bold text-slate-700">Engineering</span>
                </div>
                <div className="flex flex-col items-center space-y-2 w-1/5">
                  <span className="text-[10px] font-mono text-slate-500 font-bold">18%</span>
                  <div className="w-8 bg-indigo-500 rounded-t-lg transition-all duration-500" style={{ height: '56px' }}></div>
                  <span className="text-[10px] font-bold text-slate-700">PM</span>
                </div>
                <div className="flex flex-col items-center space-y-2 w-1/5">
                  <span className="text-[10px] font-mono text-slate-500 font-bold">12%</span>
                  <div className="w-8 bg-violet-500 rounded-t-lg transition-all duration-500" style={{ height: '36px' }}></div>
                  <span className="text-[10px] font-bold text-slate-700">Design</span>
                </div>
                <div className="flex flex-col items-center space-y-2 w-1/5">
                  <span className="text-[10px] font-mono text-slate-500 font-bold">8%</span>
                  <div className="w-8 bg-emerald-500 rounded-t-lg transition-all duration-500" style={{ height: '24px' }}></div>
                  <span className="text-[10px] font-bold text-slate-700">CS</span>
                </div>
                <div className="flex flex-col items-center space-y-2 w-1/5">
                  <span className="text-[10px] font-mono text-slate-500 font-bold">7%</span>
                  <div className="w-8 bg-amber-500 rounded-t-lg transition-all duration-500" style={{ height: '20px' }}></div>
                  <span className="text-[10px] font-bold text-slate-700">HR</span>
                </div>
              </>
            )}

            {activeChart === 'ewa' && (
              <>
                <div className="flex flex-col items-center space-y-2 w-1/4">
                  <span className="text-[10px] font-mono text-slate-500 font-bold">200k Ks</span>
                  <div className="w-10 bg-indigo-600 rounded-t-lg transition-all duration-500" style={{ height: '60px' }}></div>
                  <span className="text-[10px] font-bold text-slate-700">April 2026</span>
                </div>
                <div className="flex flex-col items-center space-y-2 w-1/4">
                  <span className="text-[10px] font-mono text-slate-500 font-bold">350k Ks</span>
                  <div className="w-10 bg-indigo-600 rounded-t-lg transition-all duration-500" style={{ height: '95px' }}></div>
                  <span className="text-[10px] font-bold text-slate-700">May 2026</span>
                </div>
                <div className="flex flex-col items-center space-y-2 w-1/4">
                  <span className="text-[10px] font-mono text-slate-500 font-bold">300k Ks</span>
                  <div className="w-10 bg-indigo-600 rounded-t-lg transition-all duration-500" style={{ height: '80px' }}></div>
                  <span className="text-[10px] font-bold text-slate-700">June 2026</span>
                </div>
                <div className="flex flex-col items-center space-y-2 w-1/4">
                  <span className="text-[10px] font-mono text-slate-500 font-bold">500k Ks</span>
                  <div className="w-10 bg-emerald-600 rounded-t-lg transition-all duration-500" style={{ height: '145px' }}></div>
                  <span className="text-[10px] font-bold text-emerald-800">July 2026</span>
                </div>
              </>
            )}

            {activeChart === 'headcount' && (
              <>
                <div className="flex flex-col items-center space-y-2 w-1/5">
                  <span className="text-[10px] font-mono text-slate-500 font-bold">{engHeadcount} EMPs</span>
                  <div className="w-8 bg-blue-600 rounded-t-lg transition-all duration-500" style={{ height: `${engHeadcount * 30}px` }}></div>
                  <span className="text-[10px] font-bold text-slate-700">Engineering</span>
                </div>
                <div className="flex flex-col items-center space-y-2 w-1/5">
                  <span className="text-[10px] font-mono text-slate-500 font-bold">{pmHeadcount} EMP</span>
                  <div className="w-8 bg-indigo-500 rounded-t-lg transition-all duration-500" style={{ height: `${pmHeadcount * 30}px` }}></div>
                  <span className="text-[10px] font-bold text-slate-700">Product</span>
                </div>
                <div className="flex flex-col items-center space-y-2 w-1/5">
                  <span className="text-[10px] font-mono text-slate-500 font-bold">{designHeadcount} EMP</span>
                  <div className="w-8 bg-violet-500 rounded-t-lg transition-all duration-500" style={{ height: `${designHeadcount * 30}px` }}></div>
                  <span className="text-[10px] font-bold text-slate-700">Design</span>
                </div>
                <div className="flex flex-col items-center space-y-2 w-1/5">
                  <span className="text-[10px] font-mono text-slate-500 font-bold">{csHeadcount} EMP</span>
                  <div className="w-8 bg-emerald-500 rounded-t-lg transition-all duration-500" style={{ height: `${csHeadcount * 30}px` }}></div>
                  <span className="text-[10px] font-bold text-slate-700">Customer Success</span>
                </div>
                <div className="flex flex-col items-center space-y-2 w-1/5">
                  <span className="text-[10px] font-mono text-slate-500 font-bold">{hrHeadcount} EMP</span>
                  <div className="w-8 bg-amber-500 rounded-t-lg transition-all duration-500" style={{ height: `${hrHeadcount * 30}px` }}></div>
                  <span className="text-[10px] font-bold text-slate-700">HR</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right hand: demographics parameters and geographic spreads */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider border-b pb-3 border-slate-100">
            Corporate Geographic Parameters
          </h3>
          <div className="space-y-4 text-xs font-semibold text-slate-600">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Yangon (HQ & Bahan Hub)</span>
                <span className="text-slate-800 font-bold">100% of Employees</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-2 w-full"></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Mandalay Tech Hub</span>
                <span className="text-slate-800 font-bold">0% (In-Onboarding)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-slate-300 h-2 w-0"></div>
              </div>
            </div>

            <div className="pt-2">
              <span className="block text-[10px] font-extrabold uppercase tracking-wide text-slate-400 mb-2">
                Active Statutory Slabs Covered
              </span>
              <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-bold">
                <div className="p-2 border border-slate-100 bg-slate-50 rounded">
                  SSB Employer (3%)
                </div>
                <div className="p-2 border border-slate-100 bg-slate-50 rounded">
                  SSB Employee (2%)
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
