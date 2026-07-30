import React, { useState } from 'react';
import { 
  Settings, 
  Building, 
  Sliders, 
  SlidersHorizontal,
  ShieldCheck, 
  Calendar, 
  Check, 
  X, 
  Calculator,
  PlusCircle,
  HelpCircle,
  Clock
} from 'lucide-react';
import { CompanySetting, StatutorySetting, SalaryComponentSetting } from '../types';

interface SettingsViewProps {
  companySettings: CompanySetting;
  setCompanySettings: React.Dispatch<React.SetStateAction<CompanySetting>>;
  statutorySettings: StatutorySetting;
  setStatutorySettings: React.Dispatch<React.SetStateAction<StatutorySetting>>;
  salaryComponents: SalaryComponentSetting[];
  setSalaryComponents: React.Dispatch<React.SetStateAction<SalaryComponentSetting[]>>;
  addToast: (message: string, type: 'success' | 'info' | 'error') => void;
}

export default function SettingsView({
  companySettings,
  setCompanySettings,
  statutorySettings,
  setStatutorySettings,
  salaryComponents,
  setSalaryComponents,
  addToast
}: SettingsViewProps) {
  const [activeSettingsSubTab, setActiveSettingsSubTab] = useState<'Profile' | 'Components' | 'Statutory' | 'EWA'>('Profile');

  // Form states initialized with props
  const [profileForm, setProfileForm] = useState<CompanySetting>({ ...companySettings });
  const [statutoryForm, setStatutoryForm] = useState<StatutorySetting>({ ...statutorySettings });
  
  // EWA config state
  const [ewaConfig, setEwaConfig] = useState({
    maxWithdrawalPercent: 50,
    withdrawalFeeType: 'Flat', // 'Flat' | 'Percentage'
    withdrawalFeeAmount: 1500, // Ks
    withdrawalFeePercentage: 2, // %
    maxWithdrawalsPerCycle: 3,
    minWithdrawalAmount: 5000,
    feeBearer: 'Employee' // 'Employee' | 'Employer' | 'Split'
  });

  // Salary components modal states
  const [showAddComponentModal, setShowAddComponentModal] = useState(false);
  const [newComponent, setNewComponent] = useState({
    name: '',
    category: 'Earnings' as 'Earnings' | 'Deductions' | 'Reimbursements',
    type: 'Custom' as any,
    calculationType: 'Flat' as any,
    value: 0
  });

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setCompanySettings(profileForm);
    addToast("Company profile and payroll schedule settings saved successfully.", "success");
  };

  const handleStatutorySave = (e: React.FormEvent) => {
    e.preventDefault();
    setStatutorySettings(statutoryForm);
    addToast("Statutory contribution thresholds and tax slabs updated successfully.", "success");
  };

  const handleAddComponentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComponent.name) {
      addToast("Please specify a component name.", "error");
      return;
    }

    const component: SalaryComponentSetting = {
      id: `sc-${salaryComponents.length + 1}`,
      name: newComponent.name,
      category: newComponent.category,
      type: newComponent.type,
      calculationType: newComponent.calculationType,
      value: newComponent.value,
      isStatutory: false,
      status: 'Active'
    };

    setSalaryComponents(prev => [...prev, component]);
    addToast(`New salary component "${newComponent.name}" added to master payroll template.`, "success");
    setShowAddComponentModal(false);
    setNewComponent({ name: '', category: 'Earnings', type: 'Custom', calculationType: 'Flat', value: 0 });
  };

  const toggleComponentStatus = (id: string) => {
    setSalaryComponents(prev => prev.map(comp => {
      if (comp.id !== id) return comp;
      const nextStatus = comp.status === 'Active' ? 'Inactive' : 'Active';
      addToast(`Salary component "${comp.name}" toggled to ${nextStatus.toLowerCase()}`, 'info');
      return { ...comp, status: nextStatus };
    }));
  };

  return (
    <div className="space-y-6" id="settings-module">
      
      {/* Sub tabs navigation */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold uppercase tracking-wide">
        <button
          onClick={() => setActiveSettingsSubTab('Profile')}
          className={`pb-3 flex items-center space-x-2 border-b-2 transition-all ${
            activeSettingsSubTab === 'Profile'
              ? 'border-blue-600 text-blue-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Company Profile & Schedule</span>
        </button>

        <button
          onClick={() => setActiveSettingsSubTab('Components')}
          className={`pb-3 flex items-center space-x-2 border-b-2 transition-all ${
            activeSettingsSubTab === 'Components'
              ? 'border-blue-600 text-blue-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Salary Earnings Master</span>
        </button>

        <button
          onClick={() => setActiveSettingsSubTab('Statutory')}
          className={`pb-3 flex items-center space-x-2 border-b-2 transition-all ${
            activeSettingsSubTab === 'Statutory'
              ? 'border-blue-600 text-blue-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Statutory (PF, SSB Medical, PT) Slabs</span>
        </button>
        <button
          onClick={() => setActiveSettingsSubTab('EWA')}
          className={`pb-3 flex items-center space-x-2 border-b-2 transition-all ${
            activeSettingsSubTab === 'EWA'
              ? 'border-blue-600 text-blue-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>EWA Policy & Fees</span>
        </button>
      </div>

      {/* Sub Tab: Company Profile */}
      {activeSettingsSubTab === 'Profile' && (
        <form onSubmit={handleProfileSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Left: General Identity */}
            <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4 text-xs">
              <h4 className="font-bold text-slate-800 text-xs uppercase border-b border-slate-100 pb-2">Company Registry Details</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Company Legal Name</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold text-slate-800 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Company Email Domain</label>
                  <input
                    type="text"
                    value={profileForm.domain}
                    onChange={(e) => setProfileForm({...profileForm, domain: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium text-slate-600 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Corporate Registration No</label>
                  <input
                    type="text"
                    value={profileForm.registrationNumber}
                    onChange={(e) => setProfileForm({...profileForm, registrationNumber: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Company PAN</label>
                  <input
                    type="text"
                    maxLength={10}
                    value={profileForm.pan}
                    onChange={(e) => setProfileForm({...profileForm, pan: e.target.value.toUpperCase()})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Company TAN No (Tax deduction)</label>
                  <input
                    type="text"
                    maxLength={10}
                    value={profileForm.tan}
                    onChange={(e) => setProfileForm({...profileForm, tan: e.target.value.toUpperCase()})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Registered Address</label>
                <textarea
                  rows={2}
                  value={profileForm.address}
                  onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                />
              </div>
            </div>

            {/* Right: Pay Cycle Setup */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4 text-xs">
              <h4 className="font-bold text-slate-800 text-xs uppercase border-b border-slate-100 pb-2 flex items-center">
                <Calendar className="w-4 h-4 text-blue-600 mr-2" />
                Disbursement Schedules
              </h4>

              <div className="space-y-4">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Salary Payout Frequency</label>
                  <select
                    value={profileForm.paySchedule.frequency}
                    onChange={(e) => setProfileForm({
                      ...profileForm, 
                      paySchedule: { ...profileForm.paySchedule, frequency: e.target.value as any }
                    })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-slate-700"
                  >
                    <option value="Monthly">Monthly Cycle</option>
                    <option value="Semi-Monthly">Semi-Monthly (Bi-weekly)</option>
                    <option value="Weekly">Weekly Cycle</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Payout Day</label>
                    <input
                      type="number"
                      min={1}
                      max={31}
                      value={profileForm.paySchedule.payoutDay}
                      onChange={(e) => setProfileForm({
                        ...profileForm,
                        paySchedule: { ...profileForm.paySchedule, payoutDay: parseInt(e.target.value) || 30 }
                      })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold text-slate-700 font-mono"
                    />
                    <span className="text-[9px] text-slate-400 mt-0.5 block">e.g. 30th of month</span>
                  </div>

                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Attendance Cutoff</label>
                    <input
                      type="number"
                      min={1}
                      max={31}
                      value={profileForm.paySchedule.attendanceCutoffDay}
                      onChange={(e) => setProfileForm({
                        ...profileForm,
                        paySchedule: { ...profileForm.paySchedule, attendanceCutoffDay: parseInt(e.target.value) || 25 }
                      })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold text-slate-700 font-mono"
                    />
                    <span className="text-[9px] text-slate-400 mt-0.5 block">e.g. 25th of month</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 border border-slate-100 rounded-lg text-[10px] text-slate-500 leading-relaxed font-normal">
                  * System locks payroll preparation on the <strong>25th</strong>. Disbursement file exports and digital payslips generate automatically on the <strong>30th</strong>.
                </div>
              </div>
            </div>

          </div>

          <div className="flex justify-end pt-2 border-t border-slate-200">
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-colors text-xs"
            >
              Save Profile Settings
            </button>
          </div>
        </form>
      )}

      {/* Sub Tab: Salary Components registry */}
      {activeSettingsSubTab === 'Components' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex justify-between items-center">
            <div>
              <h4 className="font-bold text-slate-800 text-xs uppercase">Salary Template Registry</h4>
              <p className="text-slate-400 text-[10px] font-medium">Add, configure, or disable default salary component formulas used in recruitment CTC structures</p>
            </div>
            
            <button
              onClick={() => setShowAddComponentModal(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center space-x-1 shadow-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Earning Component</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 tracking-wider">
                    <th className="p-4 pl-6">Component Name / Category</th>
                    <th className="p-4">Calculation Formula Type</th>
                    <th className="p-4 text-right">Default Value / Ratio</th>
                    <th className="p-4 text-center">Statutory Anchor</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-center">Admin Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {salaryComponents.map((comp) => (
                    <tr key={comp.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="p-4 pl-6">
                        <div>
                          <span className="font-bold text-slate-800 block">{comp.name}</span>
                          <span className={`px-2 py-0.2 text-[9px] font-bold rounded inline-block mt-1 ${
                            comp.category === 'Earnings'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              : comp.category === 'Deductions'
                              ? 'bg-rose-50 text-rose-700 border border-rose-100'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {comp.category}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-slate-600">
                        {comp.calculationType}
                      </td>
                      <td className="p-4 text-right font-mono font-bold text-slate-600">
                        {comp.calculationType === 'Flat' ? `Ks ${comp.value.toLocaleString()}` : `${comp.value}%`}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          comp.isStatutory ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {comp.isStatutory ? 'Mandatory' : 'Custom'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          comp.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'
                        }`}>
                          {comp.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {comp.isStatutory ? (
                          <span className="text-[10px] text-slate-400 italic">Core Mandate</span>
                        ) : (
                          <button
                            onClick={() => toggleComponentStatus(comp.id)}
                            className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                              comp.status === 'Active'
                                ? 'bg-red-50 hover:bg-red-100 text-red-600'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'
                            }`}
                          >
                            {comp.status === 'Active' ? 'Disable' : 'Enable'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sub Tab: Statutory Components (PF, SSB Medical, PT) */}
      {activeSettingsSubTab === 'Statutory' && (
        <form onSubmit={handleStatutorySave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
            
            {/* Provident Fund Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                <div className="flex items-center space-x-2">
                  <span className="p-1.5 bg-blue-50 text-blue-600 rounded">
                    <ShieldCheck className="w-4 h-4" />
                  </span>
                  <h4 className="font-bold text-slate-800 text-xs uppercase">Social Security Board (SSB)</h4>
                </div>
                
                {/* Enable toggle */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={statutoryForm.pfEnabled}
                    onChange={(e) => setStatutoryForm({...statutoryForm, pfEnabled: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <p className="text-slate-500 leading-normal font-normal">
                Mandatory retirement fund contribution matching standard SSBO rules (applicable for basic salaries up to Ks 15,000 uncapped option).
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Employer Contribution Rate (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    disabled={!statutoryForm.pfEnabled}
                    value={statutoryForm.pfRateEmployer}
                    onChange={(e) => setStatutoryForm({
                      ...statutoryForm, 
                      pfRateEmployer: parseFloat(e.target.value) || 12
                    })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-slate-700 font-bold disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Employee Contribution Rate (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    disabled={!statutoryForm.pfEnabled}
                    value={statutoryForm.pfRateEmployee}
                    onChange={(e) => setStatutoryForm({
                      ...statutoryForm,
                      pfRateEmployee: parseFloat(e.target.value) || 12
                    })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-slate-700 font-bold disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            {/* Employee Social Security Medical Care Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                <div className="flex items-center space-x-2">
                  <span className="p-1.5 bg-blue-50 text-blue-600 rounded">
                    <ShieldCheck className="w-4 h-4" />
                  </span>
                  <h4 className="font-bold text-slate-800 text-xs uppercase">Social Security Medical Care Scheme</h4>
                </div>

                {/* Enable toggle */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={statutoryForm.esiEnabled}
                    onChange={(e) => setStatutoryForm({...statutoryForm, esiEnabled: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <p className="text-slate-500 leading-normal font-normal">
                Statutory health insurance coverage mandated for employees whose gross monthly wage is less than or equal to Ks 21,000.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Employer Contribution Rate (%)</label>
                  <input
                    type="number"
                    step="0.05"
                    disabled={!statutoryForm.esiEnabled}
                    value={statutoryForm.esiRateEmployer}
                    onChange={(e) => setStatutoryForm({
                      ...statutoryForm,
                      esiRateEmployer: parseFloat(e.target.value) || 3.25
                    })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-slate-700 font-bold disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Employee Contribution Rate (%)</label>
                  <input
                    type="number"
                    step="0.05"
                    disabled={!statutoryForm.esiEnabled}
                    value={statutoryForm.esiRateEmployee}
                    onChange={(e) => setStatutoryForm({
                      ...statutoryForm,
                      esiRateEmployee: parseFloat(e.target.value) || 0.75
                    })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-slate-700 font-bold disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            {/* Municipal Wage Tax (PT) Slab Configurations */}
            <div className="md:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <h4 className="font-bold text-slate-800 text-xs uppercase border-b border-slate-100 pb-2">Municipal Wage Tax (PT) Slabs Schedule</h4>
              <p className="text-slate-500 font-normal leading-normal">
                Regional tax levied on employment by state authorities. Default slabs configured for the Yangon DICA & Ministry of Labour registry (payable semi-annually but calculated monthly).
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {statutoryForm.ptSlabs.map((slab, index) => (
                  <div key={index} className="p-4 border border-slate-100 bg-slate-50 rounded-xl flex flex-col justify-between space-y-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Slab {index + 1} Threshold</span>
                    <div>
                      <span className="block font-semibold text-slate-600">Salary &gt; Ks {slab.minSalary.toLocaleString()}</span>
                      <div className="relative mt-1">
                        <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-slate-400 font-bold">Ks </span>
                        <input
                          type="number"
                          value={slab.amount}
                          onChange={(e) => {
                            const updatedSlabs = [...statutoryForm.ptSlabs];
                            updatedSlabs[index].amount = parseInt(e.target.value) || 0;
                            setStatutoryForm({ ...statutoryForm, ptSlabs: updatedSlabs });
                          }}
                          className="w-full pl-6 pr-2 py-1 bg-white border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-xs font-bold text-slate-700"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="flex justify-end pt-2 border-t border-slate-200">
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-colors text-xs"
            >
              Save Statutory Slabs
            </button>
          </div>
        </form>
      )}

      {/* Sub Tab: EWA Config */}
      {activeSettingsSubTab === 'EWA' && (
        <div className="space-y-6 text-xs">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div>
              <h4 className="font-bold text-slate-800 text-sm uppercase">Earned Wage Access (EWA) Policy Limits</h4>
              <p className="text-slate-500 font-medium mt-1">Configure company-wide rules, withdrawal ceilings, and fee handling for the EWA program.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="space-y-4">
                <h5 className="font-bold text-slate-700 border-b border-slate-100 pb-2">Access & Limits</h5>
                
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Max Withdrawal Limit (% of Earned)</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={ewaConfig.maxWithdrawalPercent}
                      onChange={(e) => setEwaConfig({...ewaConfig, maxWithdrawalPercent: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-slate-700 font-bold"
                    />
                    <span className="text-slate-400 font-bold">%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Max Withdrawals per Cycle</label>
                  <input
                    type="number"
                    min={1}
                    value={ewaConfig.maxWithdrawalsPerCycle}
                    onChange={(e) => setEwaConfig({...ewaConfig, maxWithdrawalsPerCycle: parseInt(e.target.value) || 1})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-slate-700 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Minimum Withdrawal Amount (Ks)</label>
                  <input
                    type="number"
                    min={0}
                    value={ewaConfig.minWithdrawalAmount}
                    onChange={(e) => setEwaConfig({...ewaConfig, minWithdrawalAmount: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-slate-700 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="font-bold text-slate-700 border-b border-slate-100 pb-2">Fee Configuration</h5>
                
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Fee Bearer (Who pays the fee?)</label>
                  <select
                    value={ewaConfig.feeBearer}
                    onChange={(e) => setEwaConfig({...ewaConfig, feeBearer: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-slate-700"
                  >
                    <option value="Employee">Employee (Deducted from withdrawal)</option>
                    <option value="Employer">Employer (Company pays Provider)</option>
                    <option value="Split">Split 50/50</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Provider Fee Structure</label>
                  <select
                    value={ewaConfig.withdrawalFeeType}
                    onChange={(e) => setEwaConfig({...ewaConfig, withdrawalFeeType: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-slate-700"
                  >
                    <option value="Flat">Flat Fee per Transaction</option>
                    <option value="Percentage">Percentage of Amount</option>
                  </select>
                </div>

                {ewaConfig.withdrawalFeeType === 'Flat' ? (
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Flat Fee Amount (Ks)</label>
                    <input
                      type="number"
                      min={0}
                      value={ewaConfig.withdrawalFeeAmount}
                      onChange={(e) => setEwaConfig({...ewaConfig, withdrawalFeeAmount: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-slate-700 font-bold"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Percentage Fee (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      min={0}
                      value={ewaConfig.withdrawalFeePercentage}
                      onChange={(e) => setEwaConfig({...ewaConfig, withdrawalFeePercentage: parseFloat(e.target.value) || 0})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-slate-700 font-bold"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-200">
              <button
                onClick={() => addToast("EWA limits and fee configurations saved successfully.", "success")}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-colors text-xs flex items-center space-x-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Save EWA Policy</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add salary component modal */}
      {showAddComponentModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-sm">Add Earning Component</h3>
              <button onClick={() => setShowAddComponentModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleAddComponentSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-500 font-semibold mb-1">Component Label *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Travel Allowance, Internet Reimbursement"
                  value={newComponent.name}
                  onChange={(e) => setNewComponent({...newComponent, name: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Payroll Category</label>
                  <select
                    value={newComponent.category}
                    onChange={(e) => setNewComponent({...newComponent, category: e.target.value as any})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-slate-700"
                  >
                    <option value="Earnings">Earnings (Part of CTC)</option>
                    <option value="Reimbursements">Reimbursements (Non-Taxable)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Calculation Metric</label>
                  <select
                    value={newComponent.calculationType}
                    onChange={(e) => setNewComponent({...newComponent, calculationType: e.target.value as any})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-slate-700"
                  >
                    <option value="Flat">Flat Cash Value (Ks )</option>
                    <option value="Percentage of CTC">Percentage of Annual CTC</option>
                    <option value="Percentage of Basic">Percentage of Monthly Basic</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Default Value *</label>
                <input
                  required
                  type="number"
                  placeholder="5000"
                  value={newComponent.value || ''}
                  onChange={(e) => setNewComponent({...newComponent, value: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono font-bold text-slate-700"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddComponentModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                >
                  Save Component
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
