import React, { useState } from 'react';
import { 
  Clock, 
  Calendar, 
  UserCheck, 
  CheckCircle2, 
  AlertCircle, 
  Check, 
  X, 
  UserX
} from 'lucide-react';
import { Employee } from '../types';

interface AttendanceViewProps {
  employees: Employee[];
  addToast: (message: string, type: 'success' | 'info' | 'error') => void;
}

export default function AttendanceView({ employees, addToast }: AttendanceViewProps) {
  const [selectedShiftDate, setSelectedShiftDate] = useState('2026-07-30');
  
  // State for employee shifts map
  const [employeeShifts, setEmployeeShifts] = useState<Record<string, 'Day' | 'Night' | 'Weekend'>>({
    'EMP001': 'Day',
    'EMP002': 'Day',
    'EMP003': 'Day',
    'EMP004': 'Night',
    'EMP005': 'Weekend'
  });

  // Clock in log simulation
  const clockInLogs = [
    { id: '1', empName: 'Aung Min', dept: 'Engineering', time: '09:12 AM', status: 'On-Time', device: 'Biometric Gate A' },
    { id: '2', empName: 'Thae Su Naing', dept: 'Product Management', time: '09:28 AM', status: 'On-Time', device: 'Mobile Geofence' },
    { id: '3', empName: 'Kyaw Zin Htet', dept: 'Human Resources', time: '10:04 AM', status: 'Late In', device: 'Biometric Gate B' },
    { id: '4', empName: 'Khin Sandar', dept: 'Design', time: '09:05 AM', status: 'On-Time', device: 'Biometric Gate A' },
    { id: '5', empName: 'Min Thet Naing', dept: 'Marketing', time: '09:55 AM', status: 'Late In', device: 'Web Portal Check-in' }
  ];

  // Overtime Approvals
  const [otClaims, setOtClaims] = useState([
    { id: 'OT-101', empName: 'Aung Min', dept: 'Engineering', hours: 4.5, date: '2026-07-28', reason: 'Critical Cloud Migration Support', status: 'Pending' },
    { id: 'OT-102', empName: 'Khin Sandar', dept: 'Design', hours: 2.0, date: '2026-07-29', reason: 'Mobile Assets Delivery Deadline', status: 'Pending' }
  ]);

  const handleApproveOt = (id: string, empName: string) => {
    setOtClaims(prev => prev.map(c => c.id === id ? { ...c, status: 'Approved' } : c));
    addToast(`Overtime claim approved for ${empName}! Core hours logged to monthly cycle.`, 'success');
  };

  const handleRejectOt = (id: string, empName: string) => {
    setOtClaims(prev => prev.map(c => c.id === id ? { ...c, status: 'Rejected' } : c));
    addToast(`Overtime claim rejected for ${empName}.`, 'info');
  };

  return (
    <div className="space-y-6" id="leave-attendance-module">
      
      {/* Header and statistics banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center space-x-3.5">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase">Average Clock-In</span>
            <span className="text-sm font-extrabold text-slate-800">09:18 AM</span>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center space-x-3.5">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase">Present Today</span>
            <span className="text-sm font-extrabold text-slate-800">94.8%</span>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center space-x-3.5">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase">Active Leaves</span>
            <span className="text-sm font-extrabold text-slate-800">2 Employees</span>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center space-x-3.5">
          <div className="p-2.5 bg-violet-50 text-violet-600 rounded-lg">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase">Pending Overtime</span>
            <span className="text-sm font-extrabold text-slate-800">{otClaims.filter(c => c.status === 'Pending').length} Claims</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Hand: Shift Planner & Roster (Screen 6.02) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Shift Roster Planner</h3>
              <p className="text-[11px] text-slate-400">Map rosters and assignments directly for pro-rated salary subtractions.</p>
            </div>
            <input 
              type="date" 
              value={selectedShiftDate}
              onChange={(e) => setSelectedShiftDate(e.target.value)}
              className="p-1.5 border border-slate-200 text-xs rounded font-medium focus:outline-none bg-slate-50 text-slate-700" 
            />
          </div>

          <div className="space-y-3">
            {employees.map((emp) => {
              const currentShift = employeeShifts[emp.id] || 'Day';
              return (
                <div key={emp.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50 text-xs gap-3">
                  <div className="min-w-0">
                    <span className="font-bold text-slate-800 block truncate">{emp.firstName} {emp.lastName}</span>
                    <span className="text-[10px] text-slate-400 font-semibold">{emp.department} • {emp.designation}</span>
                  </div>
                  <div className="flex space-x-1.5 shrink-0 self-end sm:self-center">
                    {(['Day', 'Night', 'Weekend'] as const).map((shift) => (
                      <button
                        key={shift}
                        onClick={() => {
                          setEmployeeShifts({...employeeShifts, [emp.id]: shift});
                          addToast(`Assigned ${emp.firstName} to ${shift} Shift on ${selectedShiftDate}!`, 'success');
                        }}
                        className={`px-3 py-1 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                          currentShift === shift
                            ? 'bg-blue-600 border-blue-600 text-white font-extrabold shadow-sm'
                            : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        {shift}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Hand: Clock in log feeds */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider border-b pb-3 border-slate-100">
            Real-time Clock-In Log (Biometric Feed)
          </h3>
          <div className="space-y-3">
            {clockInLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-100/50">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-700 block">{log.empName}</span>
                  <span className="text-[10px] text-slate-400 font-semibold">{log.dept} • {log.device}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono font-bold text-slate-800 block">{log.time}</span>
                  <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                    log.status === 'On-Time' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {log.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Overtime Approvals (Screen 6.18) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-3 border-slate-100">
          Overtime Hours & Compensation Approvals
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-slate-500">
                <th className="p-3 font-bold">Employee</th>
                <th className="p-3 font-bold">Department</th>
                <th className="p-3 font-bold">Overtime Date</th>
                <th className="p-3 font-bold">Logged Hours</th>
                <th className="p-3 font-bold">Stated Reason</th>
                <th className="p-3 font-bold">Status</th>
                <th className="p-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
              {otClaims.map((claim) => (
                <tr key={claim.id} className="hover:bg-slate-50/50">
                  <td className="p-3 font-bold text-slate-800">{claim.empName}</td>
                  <td className="p-3">{claim.dept}</td>
                  <td className="p-3 font-mono">{claim.date}</td>
                  <td className="p-3 font-bold text-slate-700">{claim.hours} Hours</td>
                  <td className="p-3 text-slate-500">{claim.reason}</td>
                  <td className="p-3">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                      claim.status === 'Pending' 
                        ? 'bg-amber-50 text-amber-700 border-amber-100 animate-pulse'
                        : claim.status === 'Approved'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        : 'bg-rose-50 text-rose-700 border-rose-100'
                    }`}>
                      {claim.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    {claim.status === 'Pending' ? (
                      <div className="inline-flex space-x-1">
                        <button 
                          onClick={() => handleApproveOt(claim.id, claim.empName)}
                          className="p-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded border border-emerald-200 cursor-pointer"
                          title="Approve claim"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleRejectOt(claim.id, claim.empName)}
                          className="p-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded border border-rose-200 cursor-pointer"
                          title="Reject claim"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">No actions pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
