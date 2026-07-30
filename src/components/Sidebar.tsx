import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  FileText, 
  TrendingUp, 
  Settings,
  Building,
  User,
  Clock,
  Landmark,
  FileSpreadsheet,
  BarChart3,
  Workflow,
  GitBranch,
  Briefcase,
  Activity,
  ShieldAlert
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingEwaCount: number;
  userRole?: 'Admin' | 'HR';
}

export default function Sidebar({ activeTab, setActiveTab, pendingEwaCount, userRole = 'Admin' }: SidebarProps) {
  const hrMenuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'organization', name: 'Organization', icon: Building },
    { id: 'employees', name: 'Employees', icon: Users },
    { id: 'payruns', name: 'Pay Runs', icon: CreditCard },
    { id: 'attendance', name: 'Attendance', icon: Clock },
    { id: 'ewa', name: 'EWA (Advance)', icon: TrendingUp, badge: pendingEwaCount > 0 ? pendingEwaCount : undefined },
    { id: 'loans', name: 'Loans & Advances', icon: Landmark },
    { id: 'documents', name: 'Documents', icon: FileText },
    { id: 'reports', name: 'Reports', icon: FileSpreadsheet },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'workflows', name: 'Workflows', icon: Workflow },
    { id: 'integrations', name: 'Integrations', icon: GitBranch },
    { id: 'ess', name: 'ESS Portal', icon: User },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  const adminMenuItems = [
    { id: 'dashboard', name: 'Platform Overview', icon: LayoutDashboard },
    { id: 'sales', name: 'Sales & Clients', icon: Briefcase },
    { id: 'operations', name: 'Operations', icon: Activity },
    { id: 'finances', name: 'Finances & Treasury', icon: Landmark },
    { id: 'risk', name: 'Risk & Underwriting', icon: ShieldAlert },
    { id: 'reports', name: 'System Reports', icon: FileSpreadsheet },
    { id: 'integrations', name: 'Core Banking API', icon: GitBranch },
    { id: 'settings', name: 'Global Settings', icon: Settings },
  ];

  const menuItems = userRole === 'Admin' ? adminMenuItems : hrMenuItems;

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800" id="app-sidebar">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-900/30">
            {userRole === 'Admin' ? 'E' : 'Z'}
          </div>
          <div>
            <span className="font-semibold text-white tracking-wide text-sm block">
              {userRole === 'Admin' ? 'EWA Platform' : 'Zoho Payroll'}
            </span>
            <span className="text-[10px] text-slate-400 font-medium block uppercase tracking-wider">
              {userRole === 'Admin' ? 'Provider Back-Office' : 'Client Portal'}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/10'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </div>
              {item.badge !== undefined && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500 text-white">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer info */}
      <div className="p-4 border-t border-slate-800 bg-slate-950 text-xs">
        <div className="flex items-center space-x-2 text-slate-400">
          <Building className="w-4.5 h-4.5 text-slate-500" />
          <div className="truncate">
            <span className="block font-medium text-slate-300">
              {userRole === 'Admin' ? 'Provider Inc.' : 'Zylker Tech'}
            </span>
            <span className="block text-[10px] text-slate-500">
              {userRole === 'Admin' ? 'Admin Node' : 'U72200TN2020PTC'}
            </span>
          </div>
        </div>
        <div className="mt-2 text-[10px] text-slate-600 text-center uppercase tracking-widest font-mono">
          V2.5.0 (Vite)
        </div>
      </div>
    </aside>
  );
}
