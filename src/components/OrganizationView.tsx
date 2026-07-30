import React, { useState } from 'react';
import { 
  Building, 
  MapPin, 
  FolderGit, 
  Layers, 
  Calendar, 
  Sliders, 
  User, 
  Plus, 
  Check, 
  DollarSign
} from 'lucide-react';

interface OrganizationViewProps {
  addToast: (message: string, type: 'success' | 'info' | 'error') => void;
}

export default function OrganizationView({ addToast }: OrganizationViewProps) {
  // Tabs: profile, branches, departments, cost-centers, holiday-planner
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'branches' | 'departments' | 'cost-centers' | 'holiday-planner'>('profile');

  // Branch data
  const [branches, setBranches] = useState([
    { id: 'BR-1', name: 'Zylker Yangon Headquarters', state: 'Yangon Region', city: 'Bahan, Yangon', employeesCount: 156, taxTan: 'TIN-YGN-01234F', ptRate: 'SSB Employer 3% / Employee 2%' },
    { id: 'BR-2', name: 'Zylker Mandalay Tech Hub', state: 'Mandalay Region', city: 'Mandalay', employeesCount: 48, taxTan: 'TIN-MDY-09876C', ptRate: 'SSB Employer 3% / Employee 2%' },
    { id: 'BR-3', name: 'Zylker Naypyidaw Liaison', state: 'Naypyidaw Union Territory', city: 'Naypyidaw', employeesCount: 12, taxTan: 'TIN-NPT-05678X', ptRate: 'SSB Exempt Branch' }
  ]);
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchState, setNewBranchState] = useState('Yangon Region');
  const [newBranchCity, setNewBranchCity] = useState('');

  // Department data
  const departments = [
    { name: 'Engineering', code: 'ENG', lead: 'Pradeep Kumar', headcount: 42, payrollCost: '32,400,000 Ks' },
    { name: 'Product Management', code: 'PRD', lead: 'Khin Sandar', headcount: 8, payrollCost: '18,500,000 Ks' },
    { name: 'Design & UX', code: 'DSN', lead: 'Zayar Lin', headcount: 12, payrollCost: '12,000,000 Ks' },
    { name: 'Human Resources', code: 'HR', lead: 'Thae Su Naing', headcount: 6, payrollCost: '8,400,000 Ks' },
    { name: 'Customer Success', code: 'CS', lead: 'Htet Aung', headcount: 18, payrollCost: '11,200,000 Ks' }
  ];

  // Cost centers
  const [costCenters, setCostCenters] = useState([
    { id: 'CC-01', name: 'Zylker Core Platform Dev', code: 'CORE-DEV', weight: 60, status: 'Active' },
    { id: 'CC-02', name: 'Enterprise SaaS Scaling', code: 'ENT-SAAS', weight: 25, status: 'Active' },
    { id: 'CC-03', name: 'Statutory Research & R&D', code: 'COMP-RD', weight: 15, status: 'Active' }
  ]);
  const [newCcName, setNewCcName] = useState('');
  const [newCcWeight, setNewCcWeight] = useState(10);

  // Holiday Planner
  const holidays = [
    { date: '2026-04-13', name: 'Maha Thingyan Eve', type: 'Water Festival Holiday' },
    { date: '2026-04-17', name: 'Myanmar New Year Day', type: 'National Holiday' },
    { date: '2026-07-28', name: 'Full Moon of Waso (Dhammacakka Day)', type: 'Religious Holiday' },
    { date: '2026-11-24', name: 'Full Moon of Tazaungmon', type: 'National Festival' },
    { date: '2026-12-25', name: 'Christmas Day', type: 'Gazetted Holiday' }
  ];

  const handleAddBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchName.trim() || !newBranchCity.trim()) {
      addToast('Please enter both Branch Name and City.', 'error');
      return;
    }
    const id = `BR-${branches.length + 1}`;
    setBranches([
      ...branches,
      {
        id,
        name: newBranchName,
        state: newBranchState,
        city: newBranchCity,
        employeesCount: 0,
        taxTan: 'TIN-NEW-99381A',
        ptRate: 'SSB Employer 3% / Employee 2%'
      }
    ]);
    addToast(`New corporate branch "${newBranchName}" added in ${newBranchState}!`, 'success');
    setNewBranchName('');
    setNewBranchCity('');
  };

  const handleAddCc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCcName.trim()) {
      addToast('Please enter a Cost Center Name.', 'error');
      return;
    }
    const code = newCcName.toUpperCase().replace(/\s+/g, '-').slice(0, 10);
    setCostCenters([
      ...costCenters,
      { id: `CC-0${costCenters.length + 1}`, name: newCcName, code, weight: Number(newCcWeight), status: 'Active' }
    ]);
    addToast(`Cost center "${newCcName}" created successfully.`, 'success');
    setNewCcName('');
  };

  return (
    <div className="space-y-6" id="organization-module-view">
      {/* Module Hub Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">Corporate & Subsidiary Settings</h2>
            <p className="text-xs text-slate-400">Establish legal entities, subsidiaries, branches, and calendars.</p>
          </div>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
          {(['profile', 'branches', 'departments', 'cost-centers', 'holiday-planner'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer capitalize ${
                activeSubTab === tab 
                  ? 'bg-white text-slate-800 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* RENDER ACTIVE SUBTAB */}
      {activeSubTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="org-profile-tab">
          <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-3 border-slate-100">
              Primary Corporate Profile
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
              <div>
                <span className="block text-slate-400 font-medium">Legal Organization Name</span>
                <span className="font-bold text-slate-800 block mt-0.5">Zylker Technologies (Myanmar) Co., Ltd.</span>
              </div>
              <div>
                <span className="block text-slate-400 font-medium">Domain Verification</span>
                <span className="text-emerald-600 font-bold flex items-center space-x-1 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>zylker.com.mm (Verified)</span>
                </span>
              </div>
              <div>
                <span className="block text-slate-400 font-medium">MyCO Registration ID (DICA)</span>
                <span className="font-bold text-slate-800 block mt-0.5">102938475-MYCO</span>
              </div>
              <div>
                <span className="block text-slate-400 font-medium">Date of Incorporation</span>
                <span className="font-bold text-slate-800 block mt-0.5">May 15, 2020</span>
              </div>
              <div>
                <span className="block text-slate-400 font-medium">Taxpayer Identification Number (TIN)</span>
                <span className="font-bold text-slate-800 block mt-0.5">TIN-839482910</span>
              </div>
              <div>
                <span className="block text-slate-400 font-medium">SSB Employer Registry Code</span>
                <span className="font-bold text-slate-800 block mt-0.5">SSB-YGN-0029384</span>
              </div>
            </div>

            <div className="pt-2 text-xs">
              <span className="block text-slate-400 font-medium">Registered Office Address</span>
              <p className="text-slate-600 font-semibold leading-relaxed mt-1">
                No. 42, Kabar Aye Pagoda Road, Bahan Township, Yangon, Myanmar
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-3 border-slate-100">
              Enterprise Structure Slabs
            </h3>
            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Total Legal Subsidiaries</span>
                <span className="font-extrabold text-blue-600">3 Entities</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Registered Slabs</span>
                <span className="font-extrabold text-blue-600">Yangon, Mandalay, Naypyidaw</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Average Compliance Rating</span>
                <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-100">
                  98.4% (Excellent)
                </span>
              </div>
            </div>
            <button
              onClick={() => addToast('Triggered legal audit sync with MyCO online portal.', 'info')}
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              MyCO Registry Refresh
            </button>
          </div>
        </div>
      )}

      {activeSubTab === 'branches' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="org-branches-tab">
          <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Active State Jurisdictions</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-slate-500">
                    <th className="p-3 font-bold">Branch Name</th>
                    <th className="p-3 font-bold">State Jurisdiction</th>
                    <th className="p-3 font-bold">TIN Code</th>
                    <th className="p-3 font-bold">Headcount</th>
                    <th className="p-3 font-bold">SSB Contribution Policy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                  {branches.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/40">
                      <td className="p-3 font-bold text-slate-800">{b.name}</td>
                      <td className="p-3 flex items-center space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{b.city}, {b.state}</span>
                      </td>
                      <td className="p-3 font-mono text-[11px]">{b.taxTan}</td>
                      <td className="p-3 font-bold text-slate-700">{b.employeesCount} Employees</td>
                      <td className="p-3 text-slate-500 font-mono text-[11px]">{b.ptRate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-3 border-slate-100">
              Add Subsidiary Branch
            </h3>
            <form onSubmit={handleAddBranch} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-500 font-semibold mb-1">Branch/Subsidiary Name</label>
                <input
                  type="text"
                  placeholder="e.g. Shan State R&D"
                  value={newBranchName}
                  onChange={(e) => setNewBranchName(e.target.value)}
                  className="w-full border border-slate-200 rounded p-2 text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-500 font-semibold mb-1">State Jurisdiction</label>
                <select
                  value={newBranchState}
                  onChange={(e) => setNewBranchState(e.target.value)}
                  className="w-full border border-slate-200 rounded p-2 text-xs focus:outline-none"
                >
                  <option>Yangon Region</option>
                  <option>Mandalay Region</option>
                  <option>Naypyidaw Union Territory</option>
                  <option>Shan State</option>
                  <option>Bago Region</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-500 font-semibold mb-1">City Location</label>
                <input
                  type="text"
                  placeholder="e.g. Taunggyi"
                  value={newBranchCity}
                  onChange={(e) => setNewBranchCity(e.target.value)}
                  className="w-full border border-slate-200 rounded p-2 text-xs focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg cursor-pointer transition"
              >
                Incorporate Branch
              </button>
            </form>
          </div>
        </div>
      )}

      {activeSubTab === 'departments' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4" id="org-departments-tab">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Departments & Headcount Matrix</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((dept) => (
              <div key={dept.code} className="border border-slate-100 p-4 rounded-xl bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-xs">{dept.name}</span>
                  <span className="font-mono text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-100 font-bold">
                    {dept.code}
                  </span>
                </div>
                <div className="text-xs space-y-1 text-slate-500 font-semibold">
                  <div className="flex justify-between">
                    <span>Department Lead:</span>
                    <span className="text-slate-700 font-bold">{dept.lead}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Headcount:</span>
                    <span className="text-slate-700 font-bold">{dept.headcount} EMPs</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Est. Monthly Cost:</span>
                    <span className="text-emerald-700 font-bold">{dept.payrollCost}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'cost-centers' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="org-cost-centers-tab">
          <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Corporate Cost Center Mappings</h3>
            <p className="text-xs text-slate-400">Map salaries and employee costs to operational cost centers for auditing.</p>
            <div className="space-y-3">
              {costCenters.map((cc) => (
                <div key={cc.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      CC
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 block">{cc.name}</span>
                      <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase">{cc.code}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <span className="block text-[10px] text-slate-400 uppercase font-bold">Budget Weight</span>
                      <span className="font-bold text-slate-700">{cc.weight}%</span>
                    </div>
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] px-2 py-0.5 rounded font-bold">
                      {cc.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-3 border-slate-100">
              Create Cost Center
            </h3>
            <form onSubmit={handleAddCc} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-500 font-semibold mb-1">Cost Center Name</label>
                <input
                  type="text"
                  placeholder="e.g. Marketing Launch Campaigns"
                  value={newCcName}
                  onChange={(e) => setNewCcName(e.target.value)}
                  className="w-full border border-slate-200 rounded p-2 text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-500 font-semibold mb-1">Budget Allocation Weight (%)</label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={newCcWeight}
                  onChange={(e) => setNewCcWeight(Number(e.target.value))}
                  className="w-full border border-slate-200 rounded p-2 text-xs focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg cursor-pointer transition"
              >
                Register Cost Center
              </button>
            </form>
          </div>
        </div>
      )}

      {activeSubTab === 'holiday-planner' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4" id="org-holiday-planner-tab">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">National & Regional Holiday Planner</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide">Upcoming Calendared Dates</span>
              <div className="divide-y divide-slate-100">
                {holidays.map((h) => (
                  <div key={h.date} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-700 block">{h.name}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{h.type}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 font-mono text-[11px] text-slate-500 font-semibold bg-slate-50 px-2 py-1 rounded">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{h.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col justify-between">
              <div className="space-y-1.5 text-xs text-slate-600">
                <span className="block font-bold text-slate-800">Attendance Cutoff Calendar Rules</span>
                <p className="leading-relaxed font-semibold">
                  Monthly payroll cutoff is configured for the <strong>25th day of every month</strong>. Working days are computed from 26th of the previous month to 25th of the current month.
                </p>
                <p className="leading-relaxed">
                  Holidays falling within the date range are treated as fully paid days for both salaried and pro-rated employees under Myanmar Ministry of Labour rules.
                </p>
              </div>
              <button
                onClick={() => addToast('National gazette calendar synced successfully!', 'success')}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer mt-4"
              >
                Sync with National Gazette
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
