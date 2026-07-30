import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  CheckSquare, 
  ChevronDown, 
  Clock, 
  AlertCircle, 
  Calendar,
  X
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onNotificationAction: (tab: string) => void;
  pendingEwaCount: number;
  onLogout?: () => void;
  userRole?: 'Admin' | 'HR';
  setUserRole?: (role: 'Admin' | 'HR') => void;
}

export default function Header({ activeTab, onNotificationAction, pendingEwaCount, onLogout, userRole = 'Admin', setUserRole }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  const getBreadcrumbs = () => {
    switch (activeTab) {
      case 'dashboard':
        return ['Portal', 'Dashboard'];
      case 'organization':
        return ['Portal', 'Organization', 'Profile & Branches'];
      case 'employees':
        return ['Portal', 'Employees', 'Directory & Salary Calculator'];
      case 'payruns':
        return ['Portal', 'Pay Runs', 'Run Wizard'];
      case 'attendance':
        return ['Portal', 'Attendance', 'Shift Roster Planner'];
      case 'ewa':
        return ['Portal', 'EWA', 'Earned Wage Access'];
      case 'loans':
        return ['Portal', 'Loans', 'Salary EMI Calculator'];
      case 'documents':
        return ['Portal', 'Documents', 'Agreement & Signer'];
      case 'reports':
        return ['Portal', 'Reports', 'SSB & PIT Compliance'];
      case 'analytics':
        return ['Portal', 'Analytics', 'BI Visualizer'];
      case 'workflows':
        return ['Portal', 'Workflows', 'Escalation Node Chain'];
      case 'integrations':
        return ['Portal', 'Integrations', 'QuickBooks & Webhooks'];
      case 'ess':
        return ['Portal', 'ESS', 'Employee Self-Service'];
      case 'settings':
        return ['Portal', 'Settings', 'Configuration'];
      default:
        return ['Portal'];
    }
  };

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Payroll Dashboard';
      case 'organization':
        return 'Organization Structure & Subsidiaries';
      case 'employees':
        return 'Employee Directory';
      case 'payruns':
        return 'Pay Run Processor';
      case 'attendance':
        return 'Leave & Attendance Roster';
      case 'ewa':
        return 'Earned Wage Access (EWA)';
      case 'loans':
        return 'Corporate Loans & Advances';
      case 'documents':
        return 'Document Management & Digital Signatures';
      case 'reports':
        return 'Statutory Reports, SSB & PIT Filings';
      case 'analytics':
        return 'Payroll Analytics & Cost BI';
      case 'workflows':
        return 'Approval Workflows Designer';
      case 'integrations':
        return 'Connected Systems & Webhook Integrations';
      case 'ess':
        return 'Employee Self-Service (ESS) Portal';
      case 'settings':
        return 'System Settings & Configurations';
      default:
        return 'Zoho Payroll';
    }
  };

  const notifications = [
    ...(pendingEwaCount > 0 ? [{
      id: 'notif-1',
      title: 'Pending EWA Approvals',
      desc: `${pendingEwaCount} employee(s) requested Earned Wage Access.`,
      time: 'Just now',
      type: 'warning',
      tabTarget: 'ewa'
    }] : []),
    {
      id: 'notif-2',
      title: 'Pay Run Draft Ready',
      desc: 'The draft pay run for July 2026 is ready for review and disbursement.',
      time: '1 hour ago',
      type: 'info',
      tabTarget: 'payruns'
    },
    {
      id: 'notif-3',
      title: 'Tax Filing Deadline',
      desc: 'Myanmar SSB and monthly Patakha(Waga)-15 filings are due on August 15, 2026.',
      time: '1 day ago',
      type: 'danger',
      tabTarget: 'taxfilings'
    }
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 relative z-30" id="app-header">
      {/* Left Context: Breadcrumbs & Title */}
      <div className="flex flex-col">
        <div className="flex items-center space-x-1 text-xs text-slate-400 font-medium">
          {getBreadcrumbs().map((bc, idx) => (
            <React.Fragment key={bc}>
              {idx > 0 && <span>/</span>}
              <span className={idx === getBreadcrumbs().length - 1 ? "text-slate-600 font-semibold" : ""}>{bc}</span>
            </React.Fragment>
          ))}
        </div>
        <h1 className="text-lg font-bold text-slate-800 leading-tight">{getTitle()}</h1>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-6">
        {/* Mock Search */}
        <div className="relative w-64 max-w-xs hidden md:block">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </span>
          <input
            type="text"
            placeholder="Search employees, files, slips..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Notifications Button */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-all relative"
            title="Notification Center"
          >
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowNotifications(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 py-2">
                <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
                  <span className="font-semibold text-slate-700 text-xs">Payroll Notifications</span>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      No new alerts. Your payroll is healthy!
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div 
                        key={notif.id}
                        onClick={() => {
                          onNotificationAction(notif.tabTarget);
                          setShowNotifications(false);
                        }}
                        className="p-3.5 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer flex items-start space-x-3"
                      >
                        <div className="mt-0.5">
                          {notif.type === 'warning' && (
                            <Clock className="w-4 h-4 text-amber-500" />
                          )}
                          {notif.type === 'danger' && (
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          )}
                          {notif.type === 'info' && (
                            <Calendar className="w-4 h-4 text-blue-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xs font-bold text-slate-700">{notif.title}</h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">{notif.desc}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block font-medium">{notif.time}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Badge */}
        <div className="flex items-center space-x-3 border-l border-slate-200 pl-6">
          <div className="flex items-center space-x-2 mr-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">View As:</span>
            <button 
              onClick={() => setUserRole?.(userRole === 'Admin' ? 'HR' : 'Admin')}
              className={`px-2 py-1 text-[10px] font-bold rounded ${userRole === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'} transition-colors`}
            >
              {userRole === 'Admin' ? 'System Admin' : 'Company HR'}
            </button>
          </div>
          
          <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center font-bold text-blue-700 text-xs shadow-sm">
            {userRole === 'Admin' ? 'AD' : 'HR'}
          </div>
          <div className="hidden sm:block text-left">
            <span className="block text-xs font-bold text-slate-700">{userRole === 'Admin' ? 'superadmin@system.com' : 'admin@zylker.com'}</span>
            <span className="block text-[10px] text-slate-400 font-semibold tracking-wider uppercase">{userRole === 'Admin' ? 'Platform Admin' : 'Payroll Admin'}</span>
          </div>
          {onLogout && (
            <button 
              onClick={onLogout}
              className="ml-3 text-[11px] font-bold text-rose-500 hover:text-rose-700 border border-rose-200 hover:bg-rose-50 px-2 py-1 rounded transition duration-150 cursor-pointer"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
