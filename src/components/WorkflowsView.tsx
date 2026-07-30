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
  Settings
} from 'lucide-react';

interface WorkflowsViewProps {
  addToast: (message: string, type: 'success' | 'info' | 'error') => void;
}

export default function WorkflowsView({ addToast }: WorkflowsViewProps) {
  const [activeTab, setActiveTab] = useState<'approvals' | 'actions' | 'events' | 'custom'>('approvals');

  // Approval Nodes
  const [nodes, setNodes] = useState([
    { id: '1', role: 'Reporting Manager', name: 'Auto-Routed (Direct Manager)', action: 'First Pass Verification' },
    { id: '2', role: 'HR Payroll Specialist', name: 'Kyaw Zin Htet', action: 'Statutory Compliance Check' },
    { id: '3', role: 'VP Operations', name: 'Daw Khin Myat Noe', action: 'Final Budget Sign-Off' }
  ]);
  const [newNodeRole, setNewNodeRole] = useState('Department Head');
  const [newNodeName, setNewNodeName] = useState('');

  // Actions
  const [actions, setActions] = useState([
    { id: '1', type: 'Email', name: 'Send Pay Slip Email', status: 'Active' },
    { id: '2', type: 'Webhook', name: 'Sync with External HRMS', status: 'Active' },
  ]);

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
            <p className="text-xs text-slate-500 font-medium">Design automated approvals, actions, and custom logic for your applications.</p>
          </div>
        </div>

        <div className="flex space-x-2 border-b border-slate-200">
          {[
            { id: 'approvals', label: 'Approvals', icon: CheckCircle2 },
            { id: 'actions', label: 'Actions', icon: Zap },
            { id: 'events', label: 'Events & Triggers', icon: Calendar },
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

      {activeTab === 'approvals' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-6 space-y-5">
            <div>
              <span className="bg-blue-50 text-blue-700 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border border-blue-100">
                Visual Designer
              </span>
              <h3 className="text-sm font-extrabold text-slate-800 mt-1.5">EWA & Salary Advance Approval Chain</h3>
              <p className="text-xs text-slate-400">Specify sequential reviewing tiers. System halts pay cycle disbursement until all nodes resolve.</p>
            </div>

            <div className="relative pl-6 space-y-6 border-l-2 border-dashed border-blue-200 py-2">
              {nodes.map((node, idx) => (
                <div key={node.id} className="relative text-xs">
                  <span className="absolute -left-9 top-0.5 w-6 h-6 rounded-full bg-blue-100 border-2 border-blue-600 text-blue-700 flex items-center justify-center font-bold text-[10px]">
                    {idx + 1}
                  </span>

                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="bg-blue-50 text-blue-700 font-extrabold text-[9px] uppercase px-1.5 py-0.5 rounded border border-blue-100 font-mono">
                        {node.role}
                      </span>
                      <span className="font-bold text-slate-800 block mt-1">{node.name}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{node.action}</span>
                    </div>
                    {idx > 0 && (
                      <button 
                        onClick={() => handleDeleteNode(node.id, node.name)}
                        className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded transition"
                        title="Remove Node"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {nodes.length === 0 && (
              <div className="p-6 text-center text-xs text-slate-400 italic">
                All custom approval tiers deleted. Automatic instant approval policy active.
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-3 border-slate-100">
                Append Approval Reviewer Node
              </h3>
              
              <form onSubmit={handleAppendNode} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Approval Tier Level/Role</label>
                  <select
                    value={newNodeRole}
                    onChange={(e) => setNewNodeRole(e.target.value)}
                    className="w-full border border-slate-200 rounded p-2 text-xs bg-white focus:outline-none"
                  >
                    <option>Department Head</option>
                    <option>Internal Auditor</option>
                    <option>Finance Director</option>
                    <option>Compliance Counsel</option>
                    <option>VP Operations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Assigned Administrator Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Anand Sharma"
                    value={newNodeName}
                    onChange={(e) => setNewNodeName(e.target.value)}
                    className="w-full border border-slate-200 rounded p-2 text-xs focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg cursor-pointer transition flex items-center justify-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Attach Escalate Node</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'actions' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Automated Actions</h3>
            {actions.map(action => (
              <div key={action.id} className="bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-slate-50 text-slate-600 rounded-lg border border-slate-100">
                    {action.type === 'Email' ? <Mail className="w-5 h-5" /> : <Webhook className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{action.name}</h4>
                    <p className="text-xs text-slate-500 font-medium">{action.type} Integration</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 text-[10px] font-bold uppercase rounded bg-green-50 text-green-700 border border-green-100">
                    {action.status}
                  </span>
                  <button className="text-slate-400 hover:text-blue-600 p-1">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-3 text-sm">
              <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-2">Add New Action</h4>
              <button className="w-full flex items-center space-x-2 p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition text-slate-700 font-semibold text-xs">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>Send Email Notification</span>
              </button>
              <button className="w-full flex items-center space-x-2 p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition text-slate-700 font-semibold text-xs">
                <Bell className="w-4 h-4 text-slate-400" />
                <span>Send Push Notification</span>
              </button>
              <button className="w-full flex items-center space-x-2 p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition text-slate-700 font-semibold text-xs">
                <Webhook className="w-4 h-4 text-slate-400" />
                <span>Trigger Webhook</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'events' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Event Triggers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border border-slate-200 rounded-xl hover:border-blue-400 transition cursor-pointer group">
              <MousePointerClick className="w-6 h-6 text-slate-400 group-hover:text-blue-500 mb-2" />
              <h4 className="text-sm font-bold text-slate-800">On Record Create</h4>
              <p className="text-xs text-slate-500 mt-1">Triggered when a new form submission is created.</p>
            </div>
            <div className="p-4 border border-slate-200 rounded-xl hover:border-blue-400 transition cursor-pointer group">
              <GitCommit className="w-6 h-6 text-slate-400 group-hover:text-blue-500 mb-2" />
              <h4 className="text-sm font-bold text-slate-800">On Record Update</h4>
              <p className="text-xs text-slate-500 mt-1">Triggered when an existing record is modified.</p>
            </div>
            <div className="p-4 border border-slate-200 rounded-xl hover:border-blue-400 transition cursor-pointer group">
              <Clock className="w-6 h-6 text-slate-400 group-hover:text-blue-500 mb-2" />
              <h4 className="text-sm font-bold text-slate-800">Scheduled Run</h4>
              <p className="text-xs text-slate-500 mt-1">Execute periodically (daily, weekly, custom intervals).</p>
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
            <pre className="leading-relaxed">
{`// Zoho Creator equivalent custom Deluge/JS function

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

