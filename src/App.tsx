import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  X
} from 'lucide-react';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import EmployeesView from './components/EmployeesView';
import PayRunsView from './components/PayRunsView';
import EWAView from './components/EWAView';
import SettingsView from './components/SettingsView';
import ESSView from './components/ESSView';

// New enterprise module views
import AuthView from './components/AuthView';
import OrganizationView from './components/OrganizationView';
import AttendanceView from './components/AttendanceView';
import LoansView from './components/LoansView';
import DocumentsView from './components/DocumentsView';
import ReportsView from './components/ReportsView';
import AnalyticsView from './components/AnalyticsView';
import WorkflowsView from './components/WorkflowsView';
import IntegrationsView from './components/IntegrationsView';

// Core mock databases
import { 
  INITIAL_COMPANY_SETTINGS, 
  INITIAL_STATUTORY_SETTINGS, 
  INITIAL_SALARY_COMPONENTS, 
  INITIAL_DEDUCTION_COMPONENTS, 
  INITIAL_EMPLOYEES, 
  INITIAL_EWA_REQUESTS, 
  INITIAL_PAY_RUNS, 
  INITIAL_TAX_FILINGS 
} from './data/mockData';

import { Employee, PayRun, EWARequest, DeductionComponent, SalaryComponentSetting, StatutorySetting, CompanySetting } from './types';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('zylker_is_logged_in') === 'true';
  });

  const handleLoginSuccess = () => {
    localStorage.setItem('zylker_is_logged_in', 'true');
    setIsLoggedIn(true);
    setActiveTab('dashboard');
    addToast('Successfully authenticated admin user workspace!', 'success');
  };

  const handleLogout = () => {
    localStorage.removeItem('zylker_is_logged_in');
    setIsLoggedIn(false);
    addToast('Admin session logged out successfully.', 'info');
  };

  // Master State databases
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [payRuns, setPayRuns] = useState<PayRun[]>(INITIAL_PAY_RUNS);
  const [ewaRequests, setEwaRequests] = useState<EWARequest[]>(INITIAL_EWA_REQUESTS);
  const [deductions, setDeductions] = useState<DeductionComponent[]>(INITIAL_DEDUCTION_COMPONENTS);
  const [taxFilings, setTaxFilings] = useState<any[]>(INITIAL_TAX_FILINGS);
  
  const [companySettings, setCompanySettings] = useState<CompanySetting>(INITIAL_COMPANY_SETTINGS);
  const [statutorySettings, setStatutorySettings] = useState<StatutorySetting>(INITIAL_STATUTORY_SETTINGS);
  const [salaryComponents, setSalaryComponents] = useState<SalaryComponentSetting[]>(INITIAL_SALARY_COMPONENTS);

  // Notifications/Toast state
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `toast-${Math.floor(Math.random() * 99999) + 10000}`;
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Automatically remove toasts after 4.5 seconds
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts(prev => prev.slice(1));
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [toasts]);

  // Core callback: When an EWA advance is Disbursed, 
  // we record the recovery deduction inside the July 2026 Active Draft Payrun!
  const handleDisburseEwa = (empId: string, amount: number) => {
    // 1. Update ewa list status to Disbursed (done in EWA view, but synced here)
    setEwaRequests(prev => prev.map(req => {
      if (req.employeeId === empId && req.status === 'Approved') {
        return { ...req, status: 'Disbursed' };
      }
      return req;
    }));

    // 2. Modify July draft pay run (PR-2026-07) to record recovery
    setPayRuns(prev => prev.map(p => {
      if (p.id !== 'PR-2026-07') return p;

      let additionalDeductions = 0;
      const updatedSalaries = p.employeeSalaries.map(sal => {
        if (sal.employeeId !== empId) return sal;
        
        additionalDeductions += amount;
        const previousEwa = sal.ewaDeduction || 0;
        const newEwa = amount;

        // Recompute net paycheck taking EWA into account
        const calculatedNetPay = sal.grossEarnings - sal.deductions - newEwa;

        return {
          ...sal,
          ewaDeduction: newEwa,
          netPay: Math.max(0, calculatedNetPay)
        };
      });

      return {
        ...p,
        totalDeductions: p.totalDeductions + additionalDeductions,
        totalNetPay: p.totalNetPay - additionalDeductions,
        employeeSalaries: updatedSalaries,
        breakdown: {
          ...p.breakdown,
          otherDeductions: p.breakdown.otherDeductions + additionalDeductions
        }
      };
    }));
  };

  const pendingEwaCount = ewaRequests.filter(r => r.status === 'Pending').length;

  // Render current selected tab view
  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView 
            employees={employees}
            payRuns={payRuns}
            ewaRequests={ewaRequests}
            taxFilings={taxFilings}
            setActiveTab={setActiveTab}
          />
        );
      case 'organization':
        return (
          <OrganizationView 
            addToast={addToast}
          />
        );
      case 'employees':
        return (
          <EmployeesView 
            employees={employees}
            setEmployees={setEmployees}
            addToast={addToast}
          />
        );
      case 'payruns':
        return (
          <PayRunsView 
            payRuns={payRuns}
            setPayRuns={setPayRuns}
            employees={employees}
            addToast={addToast}
          />
        );
      case 'attendance':
        return (
          <AttendanceView 
            employees={employees}
            addToast={addToast}
          />
        );
      case 'ewa':
        return (
          <EWAView 
            ewaRequests={ewaRequests}
            setEwaRequests={setEwaRequests}
            employees={employees}
            onDisburseEwa={handleDisburseEwa}
            addToast={addToast}
          />
        );
      case 'loans':
        return (
          <LoansView 
            employees={employees}
            addToast={addToast}
          />
        );
      case 'documents':
        return (
          <DocumentsView 
            addToast={addToast}
          />
        );
      case 'reports':
        return (
          <ReportsView 
            employees={employees}
            addToast={addToast}
          />
        );
      case 'analytics':
        return (
          <AnalyticsView 
            employees={employees}
          />
        );
      case 'workflows':
        return (
          <WorkflowsView 
            addToast={addToast}
          />
        );
      case 'integrations':
        return (
          <IntegrationsView 
            addToast={addToast}
          />
        );
      case 'settings':
        return (
          <SettingsView 
            companySettings={companySettings}
            setCompanySettings={setCompanySettings}
            statutorySettings={statutorySettings}
            setStatutorySettings={setStatutorySettings}
            salaryComponents={salaryComponents}
            setSalaryComponents={setSalaryComponents}
            addToast={addToast}
          />
        );
      case 'ess':
        return (
          <ESSView 
            employees={employees}
            setEmployees={setEmployees}
            payRuns={payRuns}
            setPayRuns={setPayRuns}
            ewaRequests={ewaRequests}
            setEwaRequests={setEwaRequests}
            addToast={addToast}
            onDisburseEwa={handleDisburseEwa}
          />
        );
      default:
        return (
          <div className="p-12 text-center text-slate-400">
            Module under construction. Check other pages!
          </div>
        );
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex h-screen w-screen bg-slate-950 overflow-hidden font-sans antialiased" id="app-auth-container">
        <AuthView onLoginSuccess={handleLoginSuccess} addToast={addToast} />
        
        {/* Stacked floating Toast Notifications */}
        <div className="fixed bottom-6 right-6 z-50 space-y-2 pointer-events-none w-80 max-w-full">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`p-4 rounded-xl border shadow-xl flex items-start space-x-3 pointer-events-auto transition-all duration-200 transform translate-y-0 ${
                toast.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : toast.type === 'error'
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : 'bg-blue-50 border-blue-200 text-blue-800'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {toast.type === 'success' && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                )}
                {toast.type === 'error' && (
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                )}
                {toast.type === 'info' && (
                  <Info className="w-5 h-5 text-blue-600" />
                )}
              </div>
              <div className="flex-1 text-xs font-semibold leading-relaxed">
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen bg-slate-50 overflow-hidden font-sans antialiased" id="app-root-container">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        pendingEwaCount={pendingEwaCount}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Header navigation & notification center */}
        <Header 
          activeTab={activeTab} 
          onNotificationAction={setActiveTab} 
          pendingEwaCount={pendingEwaCount}
          onLogout={handleLogout}
        />

        {/* Selected Module Scrollable Canvas */}
        <main className="flex-1 overflow-y-auto p-8 relative z-10 focus:outline-none">
          <div className="max-w-7xl mx-auto space-y-6">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Stacked floating Toast Notifications */}
      <div className="fixed bottom-6 right-6 z-50 space-y-2 pointer-events-none w-80 max-w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-xl border shadow-xl flex items-start space-x-3 pointer-events-auto transition-all duration-200 transform translate-y-0 ${
              toast.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : toast.type === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {toast.type === 'success' && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              )}
              {toast.type === 'error' && (
                <AlertCircle className="w-5 h-5 text-rose-600" />
              )}
              {toast.type === 'info' && (
                <Info className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <div className="flex-1 text-xs font-semibold leading-relaxed">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
