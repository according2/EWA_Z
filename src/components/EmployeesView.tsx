import React, { useState } from 'react';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  ChevronRight, 
  UserCheck, 
  Building, 
  MapPin, 
  Calendar, 
  CreditCard, 
  Check, 
  X, 
  UserPlus,
  ArrowRight,
  ArrowLeft,
  FileText,
  DollarSign,
  Briefcase,
  Calculator
} from 'lucide-react';
import { Employee, TaxDeclaration } from '../types';

interface EmployeesViewProps {
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  addToast: (message: string, type: 'success' | 'info' | 'error') => void;
}

export default function EmployeesView({ employees, setEmployees, addToast }: EmployeesViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  
  // Drawer state for viewing employee details
  const [activeEmployeeId, setActiveEmployeeId] = useState<string | null>(null);
  
  // Onboarding wizard state
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  
  // Form values for new employee
  const [newEmp, setNewEmp] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: 'Engineering',
    designation: '',
    joiningDate: new Date().toISOString().split('T')[0],
    workLocation: 'Yangon',
    panNumber: '',
    uanNumber: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    baseSalaryCTC: 900000, // Default Annual CTC 9L
    taxRegime: 'New' as 'Old' | 'New'
  });

  // Calculate salary components based on CTC
  const calculateBreakdownForCTC = (annualCTC: number) => {
    const monthlyCTC = Math.round(annualCTC / 12);
    const basic = Math.round(monthlyCTC * 0.5); // 50% of CTC
    const hra = Math.round(basic * 0.4); // 40% of Basic
    const conveyance = 1600;
    const pfEmployer = Math.round(basic * 0.12); // 12% of Basic
    const pfEmployee = Math.round(basic * 0.12); // 12% of Basic
    const professionalTax = monthlyCTC >= 20000 ? 200 : 150;
    
    // special allowance absorbs the rest
    const remaining = monthlyCTC - basic - hra - conveyance - pfEmployer;
    const specialAllowance = Math.max(0, remaining);
    
    const grossEarnings = basic + hra + conveyance + specialAllowance;
    const netPay = grossEarnings - pfEmployee - professionalTax;

    return {
      basic,
      hra,
      conveyance,
      specialAllowance,
      pfEmployer,
      pfEmployee,
      esi: 0, // Simplified to 0 for these salary brackets
      professionalTax,
      grossEarnings,
      netPay
    };
  };

  const handleOnboardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const empId = `EMP00${employees.length + 1}`;
    const calculatedBreakdown = calculateBreakdownForCTC(newEmp.baseSalaryCTC);

    const onboardedEmployee: Employee = {
      id: empId,
      firstName: newEmp.firstName,
      lastName: newEmp.lastName,
      email: newEmp.email,
      department: newEmp.department,
      designation: newEmp.designation,
      joiningDate: newEmp.joiningDate,
      status: 'Active',
      workLocation: newEmp.workLocation,
      panNumber: newEmp.panNumber.toUpperCase() || 'NOT_PROVIDED',
      uanNumber: newEmp.uanNumber || 'NOT_PROVIDED',
      bankName: newEmp.bankName,
      accountNumber: newEmp.accountNumber,
      ifscCode: newEmp.ifscCode.toUpperCase(),
      baseSalary: newEmp.baseSalaryCTC,
      monthlySalary: calculatedBreakdown,
      taxRegime: newEmp.taxRegime,
      taxDeclarations: []
    };

    setEmployees(prev => [...prev, onboardedEmployee]);
    addToast(`Successfully onboarded ${newEmp.firstName} ${newEmp.lastName} (${empId})!`, 'success');
    
    // Reset wizard
    setShowOnboardModal(false);
    setWizardStep(1);
    setNewEmp({
      firstName: '',
      lastName: '',
      email: '',
      department: 'Engineering',
      designation: '',
      joiningDate: new Date().toISOString().split('T')[0],
      workLocation: 'Yangon',
      panNumber: '',
      uanNumber: '',
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      baseSalaryCTC: 900000,
      taxRegime: 'New'
    });
  };

  // Tax declaration actions
  const handleDeclarationStatusChange = (empId: string, decId: string, newStatus: 'Approved' | 'Rejected') => {
    setEmployees(prev => prev.map(emp => {
      if (emp.id !== empId) return emp;
      return {
        ...emp,
        taxDeclarations: emp.taxDeclarations.map(dec => {
          if (dec.id !== decId) return dec;
          return {
            ...dec,
            status: newStatus,
            approvedAmount: newStatus === 'Approved' ? dec.declaredAmount : 0
          };
        })
      };
    }));
    addToast(`Tax declaration was ${newStatus.toLowerCase()} successfully.`, 'info');
  };

  const activeEmployee = employees.find(e => e.id === activeEmployeeId);

  // Filter logic
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = `${emp.firstName} ${emp.lastName} ${emp.email} ${emp.id}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    const matchesStatus = selectedStatus === 'All' || emp.status === selectedStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  const uniqueDepartments = Array.from(new Set(employees.map(e => e.department)));

  const computedPreview = calculateBreakdownForCTC(newEmp.baseSalaryCTC);

  return (
    <div className="space-y-6" id="employees-module">
      {/* Search & Header actions */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="flex flex-1 flex-wrap gap-3 items-center w-full">
          <div className="relative w-full md:w-64">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </span>
            <input
              type="text"
              placeholder="Search ID, name, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Department Filter */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
          >
            <option value="All">All Departments</option>
            {uniqueDepartments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Onboarding">Onboarding</option>
          </select>
        </div>

        <button
          onClick={() => setShowOnboardModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center space-x-2 transition-colors shrink-0 w-full md:w-auto justify-center"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Onboard Employee</span>
        </button>
      </div>

      {/* Roster Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 tracking-wider">
                <th className="p-4 pl-6">Employee ID / Name</th>
                <th className="p-4">Department & Designation</th>
                <th className="p-4">Annual CTC</th>
                <th className="p-4">Joining Date</th>
                <th className="p-4">Tax Regime</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    No employees matching the active filters were found.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-bold">
                          {emp.firstName[0]}{emp.lastName[0]}
                        </div>
                        <div>
                          <span className="font-bold text-slate-800 block text-sm">{emp.firstName} {emp.lastName}</span>
                          <span className="text-[10px] text-slate-400 block font-medium">{emp.id} &bull; {emp.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold block text-slate-700">{emp.designation}</span>
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">{emp.department}</span>
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-600">
                      Ks {emp.baseSalary.toLocaleString()}
                    </td>
                    <td className="p-4 text-slate-500 font-medium">
                      {emp.joiningDate}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        emp.taxRegime === 'New' 
                          ? 'bg-blue-50 border-blue-100 text-blue-700' 
                          : 'bg-indigo-50 border-indigo-100 text-indigo-700'
                      }`}>
                        {emp.taxRegime} Regime
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        emp.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                          : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setActiveEmployeeId(emp.id)}
                        className="px-3 py-1 bg-slate-100 hover:bg-blue-600 hover:text-white transition-colors rounded text-xs text-slate-600 font-semibold inline-flex items-center space-x-1"
                      >
                        <span>View Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Profile Detail Drawer */}
      {activeEmployee && (
        <>
          <div 
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40 transition-opacity"
            onClick={() => setActiveEmployeeId(null)}
          ></div>
          <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col overflow-hidden border-l border-slate-200">
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                  {activeEmployee.firstName[0]}{activeEmployee.lastName[0]}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">{activeEmployee.firstName} {activeEmployee.lastName}</h2>
                  <p className="text-xs text-slate-500 font-semibold uppercase">{activeEmployee.id} &bull; {activeEmployee.designation}</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveEmployeeId(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Core Information Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-slate-100 rounded-lg bg-slate-50/50">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Department</span>
                  <span className="text-xs font-bold text-slate-700 flex items-center space-x-1 mt-0.5">
                    <Building className="w-3.5 h-3.5 text-slate-400 mr-1" />
                    {activeEmployee.department}
                  </span>
                </div>
                <div className="p-4 border border-slate-100 rounded-lg bg-slate-50/50">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Work Location</span>
                  <span className="text-xs font-bold text-slate-700 flex items-center space-x-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1" />
                    {activeEmployee.workLocation}
                  </span>
                </div>
                <div className="p-4 border border-slate-100 rounded-lg bg-slate-50/50">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Date of Joining</span>
                  <span className="text-xs font-bold text-slate-700 flex items-center space-x-1 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 mr-1" />
                    {activeEmployee.joiningDate}
                  </span>
                </div>
                <div className="p-4 border border-slate-100 rounded-lg bg-slate-50/50">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Permanent Account Number (PAN)</span>
                  <span className="text-xs font-bold font-mono text-slate-700 mt-0.5 block">
                    {activeEmployee.panNumber}
                  </span>
                </div>
              </div>

              {/* Bank Details */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-800 text-xs border-b border-slate-100 pb-1.5 uppercase tracking-wide flex items-center">
                  <CreditCard className="w-4 h-4 text-blue-600 mr-1.5" />
                  Disbursement Bank Account
                </h3>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">Bank Name</span>
                    <span className="font-bold text-slate-700">{activeEmployee.bankName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">Account Number</span>
                    <span className="font-bold font-mono text-slate-700">{activeEmployee.accountNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">IFSC Code</span>
                    <span className="font-bold font-mono text-slate-700">{activeEmployee.ifscCode}</span>
                  </div>
                </div>
              </div>

              {/* Monthly Compensation Details */}
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide flex items-center">
                    <DollarSign className="w-4 h-4 text-blue-600 mr-1.5" />
                    Monthly Salary Structure
                  </h3>
                  <span className="text-[11px] font-bold text-slate-500">
                    Annual CTC: Ks {activeEmployee.baseSalary.toLocaleString()}
                  </span>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <div className="grid grid-cols-2 bg-slate-50 border-b border-slate-200 p-3 font-bold text-slate-600">
                    <span>Component Name</span>
                    <span className="text-right">Monthly Amount</span>
                  </div>
                  <div className="divide-y divide-slate-100 p-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Basic Salary (50%)</span>
                      <span className="font-mono font-semibold">Ks {activeEmployee.monthlySalary.basic.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">House Rent Allowance (HRA)</span>
                      <span className="font-mono font-semibold">Ks {activeEmployee.monthlySalary.hra.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Conveyance Allowance</span>
                      <span className="font-mono font-semibold">Ks {activeEmployee.monthlySalary.conveyance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Special Allowance</span>
                      <span className="font-mono font-semibold">Ks {activeEmployee.monthlySalary.specialAllowance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-slate-700">
                      <span>Gross Earnings</span>
                      <span className="font-mono">Ks {activeEmployee.monthlySalary.grossEarnings.toLocaleString()}</span>
                    </div>
                    
                    <div className="pt-2">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Deductions</span>
                      <div className="flex justify-between text-rose-600">
                        <span>Employee SSB Contribution</span>
                        <span className="font-mono font-semibold">-Ks {activeEmployee.monthlySalary.pfEmployee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-rose-600 mt-1">
                        <span>Municipal Wage Tax (PT)</span>
                        <span className="font-mono font-semibold">-Ks {activeEmployee.monthlySalary.professionalTax.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between border-t border-slate-200 pt-2 font-extrabold text-blue-700 bg-blue-50/40 p-2 rounded">
                      <span>Monthly Take-Home (Net)</span>
                      <span className="font-mono">Ks {activeEmployee.monthlySalary.netPay.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tax Declarations & Approvals */}
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 text-xs border-b border-slate-100 pb-1.5 uppercase tracking-wide flex items-center">
                  <FileText className="w-4 h-4 text-blue-600 mr-1.5" />
                  Tax Declarations (IT Investment Proofs)
                </h3>

                {activeEmployee.taxDeclarations.length === 0 ? (
                  <p className="text-slate-400 text-xs italic">No investment declarations submitted for this financial year.</p>
                ) : (
                  <div className="space-y-3">
                    {activeEmployee.taxDeclarations.map((dec) => (
                      <div key={dec.id} className="p-4 border border-slate-100 rounded-xl bg-slate-50 flex items-center justify-between text-xs">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-slate-700">{dec.category}</span>
                            {dec.proofDocument && (
                              <span className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded text-[9px] font-semibold font-mono">
                                {dec.proofDocument}
                              </span>
                            )}
                          </div>
                          <div className="mt-1 flex space-x-4 text-[11px] text-slate-500">
                            <span>Declared: <strong>Ks {dec.declaredAmount.toLocaleString()}</strong></span>
                            <span>Approved: <strong className="text-emerald-600">Ks {dec.approvedAmount.toLocaleString()}</strong></span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {dec.status === 'Pending' ? (
                            <>
                              <button
                                onClick={() => handleDeclarationStatusChange(activeEmployee.id, dec.id, 'Approved')}
                                className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded hover:bg-emerald-700 transition-colors inline-flex items-center space-x-1"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>
                              <button
                                onClick={() => handleDeclarationStatusChange(activeEmployee.id, dec.id, 'Rejected')}
                                className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded transition-colors inline-flex items-center space-x-1"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            </>
                          ) : (
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                              dec.status === 'Approved' 
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                                : 'bg-red-50 border-red-200 text-red-700'
                            }`}>
                              {dec.status.toUpperCase()}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Onboarding Wizard Modal */}
      {showOnboardModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-xl overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Employee Onboarding Assistant</h3>
                <p className="text-slate-400 text-[11px] font-medium">Step {wizardStep} of 4: Setup Employee File</p>
              </div>
              <button 
                onClick={() => setShowOnboardModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Wizard Indicator Bar */}
            <div className="h-1 bg-slate-100 w-full flex">
              <div className={`h-full bg-blue-600 transition-all duration-300 ${
                wizardStep === 1 ? 'w-1/4' : wizardStep === 2 ? 'w-2/4' : wizardStep === 3 ? 'w-3/4' : 'w-full'
              }`}></div>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleOnboardSubmit} className="p-6 space-y-4 text-xs">
              
              {/* Step 1: Personal Profile */}
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-700 text-xs border-b border-slate-100 pb-1 flex items-center">
                    <UserCheck className="w-4.5 h-4.5 text-blue-600 mr-2" />
                    Personal & Corporate Profile
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-500 font-semibold mb-1">First Name *</label>
                      <input
                        required
                        type="text"
                        placeholder="John"
                        value={newEmp.firstName}
                        onChange={(e) => setNewEmp({...newEmp, firstName: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-semibold mb-1">Last Name *</label>
                      <input
                        required
                        type="text"
                        placeholder="Doe"
                        value={newEmp.lastName}
                        onChange={(e) => setNewEmp({...newEmp, lastName: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Corporate Email *</label>
                    <input
                      required
                      type="email"
                      placeholder="john.doe@zylker.com"
                      value={newEmp.email}
                      onChange={(e) => setNewEmp({...newEmp, email: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-500 font-semibold mb-1">Department</label>
                      <select
                        value={newEmp.department}
                        onChange={(e) => setNewEmp({...newEmp, department: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-slate-700"
                      >
                        <option value="Engineering">Engineering</option>
                        <option value="Product Management">Product Management</option>
                        <option value="Human Resources">Human Resources</option>
                        <option value="Design">Design</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Customer Success">Customer Success</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-500 font-semibold mb-1">Designation *</label>
                      <input
                        required
                        type="text"
                        placeholder="Systems Engineer"
                        value={newEmp.designation}
                        onChange={(e) => setNewEmp({...newEmp, designation: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-500 font-semibold mb-1">Joining Date</label>
                      <input
                        type="date"
                        value={newEmp.joiningDate}
                        onChange={(e) => setNewEmp({...newEmp, joiningDate: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-semibold mb-1">Work Location</label>
                      <input
                        type="text"
                        value={newEmp.workLocation}
                        onChange={(e) => setNewEmp({...newEmp, workLocation: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Statutory & Bank Details */}
              {wizardStep === 2 && (
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-700 text-xs border-b border-slate-100 pb-1 flex items-center">
                    <CreditCard className="w-4.5 h-4.5 text-blue-600 mr-2" />
                    Statutory IDs & Bank Account
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-500 font-semibold mb-1">PAN (Income Tax ID) *</label>
                      <input
                        required
                        type="text"
                        placeholder="ABCDE1234F"
                        maxLength={10}
                        value={newEmp.panNumber}
                        onChange={(e) => setNewEmp({...newEmp, panNumber: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-semibold mb-1">UAN (Social Security Board (SSB) ID)</label>
                      <input
                        type="text"
                        placeholder="100900000000"
                        maxLength={12}
                        value={newEmp.uanNumber}
                        onChange={(e) => setNewEmp({...newEmp, uanNumber: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Bank Name *</label>
                    <input
                      required
                      type="text"
                      placeholder="HDFC Bank"
                      value={newEmp.bankName}
                      onChange={(e) => setNewEmp({...newEmp, bankName: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-500 font-semibold mb-1">Bank Account Number *</label>
                      <input
                        required
                        type="text"
                        placeholder="50100293812938"
                        value={newEmp.accountNumber}
                        onChange={(e) => setNewEmp({...newEmp, accountNumber: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-semibold mb-1">IFSC Code *</label>
                      <input
                        required
                        type="text"
                        placeholder="HDFC0000123"
                        value={newEmp.ifscCode}
                        onChange={(e) => setNewEmp({...newEmp, ifscCode: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Compensation CTC Calculator */}
              {wizardStep === 3 && (
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-700 text-xs border-b border-slate-100 pb-1 flex items-center">
                    <Calculator className="w-4.5 h-4.5 text-blue-600 mr-2" />
                    Salary Configuration
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-500 font-semibold mb-1">Annual Cost to Company (CTC) *</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-bold">Ks </span>
                        <input
                          required
                          type="number"
                          placeholder="900000"
                          value={newEmp.baseSalaryCTC}
                          onChange={(e) => setNewEmp({...newEmp, baseSalaryCTC: parseInt(e.target.value) || 0})}
                          className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono font-bold text-slate-700"
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium block mt-1">Monthly Cost: Ks {Math.round(newEmp.baseSalaryCTC / 12).toLocaleString()}</span>
                    </div>

                    <div>
                      <label className="block text-slate-500 font-semibold mb-1">Income Tax Regime</label>
                      <div className="flex space-x-2 mt-0.5">
                        <button
                          type="button"
                          onClick={() => setNewEmp({...newEmp, taxRegime: 'New'})}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                            newEmp.taxRegime === 'New'
                              ? 'bg-blue-50 border-blue-600 text-blue-700'
                              : 'bg-slate-50 border-slate-200 text-slate-600'
                          }`}
                        >
                          New Regime
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewEmp({...newEmp, taxRegime: 'Old'})}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                            newEmp.taxRegime === 'Old'
                              ? 'bg-blue-50 border-blue-600 text-blue-700'
                              : 'bg-slate-50 border-slate-200 text-slate-600'
                          }`}
                        >
                          Old Regime
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Automatic live breakdown card */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Auto-Generated Monthly Structure Preview</span>
                    <div className="grid grid-cols-2 gap-y-1.5 border-b border-slate-200 pb-2">
                      <div className="flex justify-between pr-4">
                        <span className="text-slate-500">Basic (50%)</span>
                        <span className="font-mono font-semibold text-slate-700">Ks {computedPreview.basic.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between pl-4">
                        <span className="text-slate-500">HRA (40% of Basic)</span>
                        <span className="font-mono font-semibold text-slate-700">Ks {computedPreview.hra.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between pr-4">
                        <span className="text-slate-500">Conveyance Allowance</span>
                        <span className="font-mono font-semibold text-slate-700">Ks {computedPreview.conveyance.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between pl-4">
                        <span className="text-slate-500">Special Allowance</span>
                        <span className="font-mono font-semibold text-slate-700">Ks {computedPreview.specialAllowance.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-[11px] pt-1">
                      <span className="text-slate-500 font-semibold">Gross Monthly Earnings:</span>
                      <span className="font-mono font-bold text-slate-700">Ks {computedPreview.grossEarnings.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-red-600">
                      <span className="font-semibold">SSB Contribution (Employee):</span>
                      <span className="font-mono font-semibold">-Ks {computedPreview.pfEmployee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-2 text-xs font-extrabold text-blue-700">
                      <span>Take-Home Takeaway (Net Pay):</span>
                      <span className="font-mono">Ks {computedPreview.netPay.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Final Confirmation */}
              {wizardStep === 4 && (
                <div className="space-y-4 text-center py-6">
                  <div className="w-16 h-16 bg-blue-50 border border-blue-200 rounded-full flex items-center justify-center mx-auto text-blue-600 shadow-md">
                    <UserPlus className="w-8 h-8" />
                  </div>
                  <div className="max-w-md mx-auto space-y-2">
                    <h4 className="font-extrabold text-slate-800 text-sm">Ready to Register Employee?</h4>
                    <p className="text-slate-500 leading-relaxed text-xs">
                      All calculations are complete. This file will be added to the directory. {newEmp.firstName} {newEmp.lastName} will have a starting monthly net pay of <strong className="text-slate-700">Ks {computedPreview.netPay.toLocaleString()}</strong>.
                    </p>
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-left space-y-1.5 mt-4 text-xs font-medium">
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-semibold">Contractor/Employee:</span>
                        <span className="text-slate-700">{newEmp.firstName} {newEmp.lastName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-semibold">Assigned Office:</span>
                        <span className="text-slate-700">{newEmp.workLocation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-semibold">Designation:</span>
                        <span className="text-slate-700">{newEmp.designation} ({newEmp.department})</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Navigation Buttons */}
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center bg-slate-50 p-4 -mx-6 -mb-6 mt-6">
                {wizardStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setWizardStep(prev => prev - 1)}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center space-x-1 font-semibold text-slate-600"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                ) : (
                  <div></div>
                )}

                {wizardStep < 4 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (wizardStep === 1 && (!newEmp.firstName || !newEmp.lastName || !newEmp.email || !newEmp.designation)) {
                        addToast("Please fill all required profile fields.", "error");
                        return;
                      }
                      if (wizardStep === 2 && (!newEmp.panNumber || !newEmp.bankName || !newEmp.accountNumber || !newEmp.ifscCode)) {
                        addToast("Please fill all required statutory and bank account fields.", "error");
                        return;
                      }
                      if (wizardStep === 3 && newEmp.baseSalaryCTC <= 0) {
                        addToast("Please input a valid annual CTC salary.", "error");
                        return;
                      }
                      setWizardStep(prev => prev + 1);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-1 font-semibold"
                  >
                    <span>Next Step</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
                  >
                    Confirm & Complete Onboarding
                  </button>
                )}
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
