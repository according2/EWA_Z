import React, { useState } from 'react';
import { 
  GitCommit, 
  Plus, 
  Trash2, 
  Workflow, 
  CheckCircle2,
  Users,
  Zap,
  Bell,
  Mail,
  Webhook,
  Code,
  Calendar,
  MousePointerClick,
  Clock,
  Settings,
  Repeat,
  FileText,
  UserPlus,
  Landmark
} from 'lucide-react';

interface WorkflowsViewProps {
  addToast: (message: string, type: 'success' | 'info' | 'error') => void;
}

export default function WorkflowsView({ addToast }: WorkflowsViewProps) {
  const [activeTab, setActiveTab] = useState<'definitions' | 'config' | 'loops' | 'custom'>('definitions');
  const [selectedDefinition, setSelectedDefinition] = useState('ewa');

  // Approval Nodes
  const [nodes, setNodes] = useState([
    { id: '1', role: 'Reporting Manager', name: 'Auto-Routed (Direct Manager)', action: 'First Pass Verification' },
    { id: '2', role: 'HR Payroll Specialist', name: 'Kyaw Zin Htet', action: 'Statutory Compliance Check' },
    { id: '3', role: 'VP Operations', name: 'Daw Khin Myat Noe', action: 'Final Budget Sign-Off' }
  ]);

  const [newNodeRole, setNewNodeRole] = useState('Department Head');
  const [newNodeName, setNewNodeName] = useState('');

  const definitions = [
    { id: 'ewa', name: 'EWA Budget Request', icon: Landmark, desc: 'Routing and approval rules for high-value EWA requests.' },
    { id: 'onboarding', name: 'Employee Onboarding', icon: UserPlus, desc: 'Provisioning checklist, statutory forms, and IT setup.' },
    { id: 'mgmt', name: 'Employee Mgmt (Promotion/Exit)', icon: Users, desc: 'Lifecycle transitions, compensation changes, offboarding.' },
    { id: 'payroll', name: 'Payroll Run Approval', icon: FileText, desc: 'Final checker authorization for monthly pay disbursements.' }
  ];

  const handleAppendNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNodeName.trim()) {
      addToast('Please input the reviewer/assignee Name.', 'error');
      return;
    }
    const id = `${nodes.length + 1}`;
    setNodes([
      ...nodes,
      {
        id,
        role: newNodeRole,
        name: newNodeName,
        action: 'Supplemental Approval Override'
      }
    ]);
    addToast(`Added review tier "${newNodeRole}: ${newNodeName}" into the escalation chain!`, 'success');
    setNewNodeName('');
  };

  const handleDeleteNode = (id: string, name: string) => {
    setNodes(prev => prev.filter(n => n.id !== id));
    addToast(`Removed review tier "${name}" from escalation routing.`, 'info');
  };

  return (
    <div className="space-y-6" id="workflows-module">
      
      {/* Header and Tabs */}
      <div className="bg-white p-4 border border-slate-200 rounded-xl space-y-4">
        <div className="flex items-center space-x-3 text-slate-800">
          <Workflow className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-lg font-bold">Workflow Creator</h2>
            <p className="text-xs text-slate-500 font-medium">Design automated definitions, configs, for-each batch loops, and custom scripts.</p>
          </div>
        </div>
        
        <div className="flex space-x-2 border-b border-slate-200">
          {[
            { id: 'definitions', label: 'Workflow Definitions', icon: GitCommit },
            { id: 'config', label: 'Node Config & Rules', icon: Settings },
            { id: 'loops', label: 'For Each (Batch Runs)', icon: Repeat },
            { id: 'custom', label: 'Custom Scripts', icon: Code }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 border-b-2 font-semibold text-xs transition-colors ${
                  isActive ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === 'definitions' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Available Workflows</h3>
            {definitions.map(def => {
              const Icon = def.icon;
              const isSelected = selectedDefinition === def.id;
              return (
                <div 
                  key={def.id}
                  onClick={() => setSelectedDefinition(def.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                >
                  <div className="flex items-center space-x-3 mb-1">
                    <div className={`p-1.5 rounded ${isSelected ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className={`text-sm font-bold ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>{def.name}</h4>
                  </div>
                  <p className="text-xs text-slate-500 ml-9">{def.desc}</p>
                </div>
              );
            })}
            <button className="w-full py-2 border border-dashed border-slate-300 text-slate-500 rounded-xl hover:bg-slate-50 hover:text-slate-700 text-xs font-bold flex items-center justify-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Create New Workflow</span>
            </button>
          </div>

          <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-6 space-y-5">
            <div>
              <span className="bg-blue-50 text-blue-700 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border border-blue-100">
                Visual Designer
              </span>
              <h3 className="text-sm font-extrabold text-slate-800 mt-1.5">{definitions.find(d => d.id === selectedDefinition)?.name} - Execution Chain</h3>
              <p className="text-xs text-slate-400">Specify sequential reviewing tiers and automated actions. System halts process until all nodes resolve.</p>
            </div>

            <div className="relative pl-6 space-y-6 border-l-2 border-dashed border-blue-200 py-2">
              {nodes.map((node, idx) => (
                <div key={node.id} className="relative text-xs">
                  <span className="absolute -left-9 top-0.5 w-6 h-6 rounded-full bg-blue-100 border-2 border-blue-600 text-blue-700 flex items-center justify-center font-bold text-[10px]">
                    {idx + 1}
                  </span>
                  <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-sm flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
                        <span>{node.role}</span>
                      </h4>
                      <p className="text-slate-500 mt-0.5">Assignee: <span className="font-semibold text-slate-700">{node.name}</span></p>
                      <p className="text-slate-400 mt-1 flex items-center">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                        {node.action}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleDeleteNode(node.id, node.name)}
                      className="text-slate-400 hover:text-rose-500 p-1 rounded hover:bg-rose-50 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-slate-100 pt-6">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
                Append Node
              </h3>
              
              <form onSubmit={handleAppendNode} className="flex items-end space-x-3 text-xs">
                <div className="flex-1">
                  <label className="block text-slate-500 font-semibold mb-1">Tier/Role</label>
                  <select
                    value={newNodeRole}
                    onChange={(e) => setNewNodeRole(e.target.value)}
                    className="w-full border border-slate-200 rounded p-2 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option>Department Head</option>
                    <option>Internal Auditor</option>
                    <option>Finance Director</option>
                    <option>Compliance Counsel</option>
                    <option>VP Operations</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-slate-500 font-semibold mb-1">Assignee</label>
                  <input
                    type="text"
                    placeholder="e.g. Anand Sharma"
                    value={newNodeName}
                    onChange={(e) => setNewNodeName(e.target.value)}
                    className="w-full border border-slate-200 rounded p-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg cursor-pointer transition flex items-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </form>
            </div>
          </div>

        </div>
      )}

      {activeTab === 'config' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
          <h3 className="text-sm font-bold text-slate-800">Node Configuration & Rules Engine</h3>
          <p className="text-xs text-slate-500">Configure SLA timers, dynamic routing conditions, and fallback delegates for nodes.</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="border border-slate-200 p-4 rounded-xl space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <h4 className="font-bold text-slate-700 text-sm">SLA & Escalation</h4>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 font-semibold">Max Wait Time (Hours)</span>
                  <input type="number" defaultValue="48" className="border border-slate-200 rounded p-1 w-20 text-right font-mono" />
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 font-semibold">Auto-Action on Timeout</span>
                  <select className="border border-slate-200 rounded p-1">
                    <option>Escalate to Manager</option>
                    <option>Auto-Reject</option>
                    <option>Auto-Approve</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border border-slate-200 p-4 rounded-xl space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
                <Workflow className="w-4 h-4 text-purple-500" />
                <h4 className="font-bold text-slate-700 text-sm">Dynamic Routing Conditions</h4>
              </div>
              <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs font-mono text-slate-600">
                IF <span className="text-purple-600 font-bold">Request.Amount</span> {'>'} 500,000<br/>
                THEN RouteTo <span className="text-blue-600 font-bold">Finance Director</span><br/>
                ELSE RouteTo <span className="text-blue-600 font-bold">Direct Manager</span>
              </div>
              <button className="text-blue-600 font-bold text-xs hover:underline">+ Add Condition Branch</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'loops' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center"><Repeat className="w-5 h-5 mr-2 text-blue-500" /> For Each (Batch Process Loops)</h3>
          <p className="text-xs text-slate-500 mb-6">Iterate over collections of records to trigger sub-workflows, send batch emails, or perform bulk API actions.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-slate-200 rounded-xl hover:border-blue-400 transition cursor-pointer group bg-slate-50">
              <Users className="w-6 h-6 text-slate-400 group-hover:text-blue-500 mb-2" />
              <h4 className="text-sm font-bold text-slate-800">For Each: Employee in Department</h4>
              <p className="text-xs text-slate-500 mt-1">Iterate over all active staff in a selected department to issue policy acknowledgments.</p>
            </div>
            <div className="p-4 border border-slate-200 rounded-xl hover:border-blue-400 transition cursor-pointer group bg-slate-50">
              <FileText className="w-6 h-6 text-slate-400 group-hover:text-blue-500 mb-2" />
              <h4 className="text-sm font-bold text-slate-800">For Each: Pending EWA Request</h4>
              <p className="text-xs text-slate-500 mt-1">Batch process all approved requests daily at 5 PM for bulk CB Bank disbursement.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'custom' && (
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden flex flex-col h-[500px]">
          <div className="bg-slate-950 p-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Code className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-bold text-slate-300">execute_payroll_logic.js</span>
            </div>
            <button className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded transition">
              Save & Publish
            </button>
          </div>
          <div className="flex-1 p-4 font-mono text-xs text-slate-300 overflow-auto">
            <pre className="leading-relaxed">{`// Zoho Creator equivalent custom Deluge/JS function
export async function processEwaRequest(record, context) {
  // 1. Fetch employee details
  const employee = await db.employees.findById(record.employeeId);
  
  if (employee.status !== 'ACTIVE') {
    return { status: 'REJECTED', reason: 'Employee is inactive' };
  }

  // 2. Validate requested amount
  const maxAllowed = employee.earnedWage * 0.50; // 50% max limit
  
  if (record.amount > maxAllowed) {
    // 3. Trigger approval flow if exceeds limit
    await workflow.triggerApproval('High Value EWA', record);
    return { status: 'PENDING_APPROVAL' };
  }

  // 4. Standard auto-disbursement
  const transfer = await banking.transfer({
    accountId: employee.bankDetails.accountId,
    amount: record.amount,
    currency: 'USD'
  });

  // 5. Audit log
  await logs.insert({
    action: 'EWA_DISBURSED',
    employeeId: employee.id,
    amount: record.amount,
    timestamp: new Date()
  });

  return { status: 'SUCCESS', transactionId: transfer.id };
}`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
