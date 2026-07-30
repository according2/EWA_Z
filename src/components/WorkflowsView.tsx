import React, { useState } from 'react';
import { 
  GitCommit, 
  Plus, 
  Trash2, 
  ChevronDown, 
  Workflow, 
  Settings, 
  CheckCircle2,
  Users
} from 'lucide-react';

interface WorkflowsViewProps {
  addToast: (message: string, type: 'success' | 'info' | 'error') => void;
}

export default function WorkflowsView({ addToast }: WorkflowsViewProps) {
  // Visual approval tiers
  const [nodes, setNodes] = useState([
    { id: '1', role: 'Reporting Manager', name: 'Auto-Routed (Direct Manager)', action: 'First Pass Verification' },
    { id: '2', role: 'HR Payroll Specialist', name: 'Kyaw Zin Htet', action: 'Statutory Compliance Check' },
    { id: '3', role: 'VP Operations', name: 'Daw Khin Myat Noe', action: 'Final Budget Sign-Off' }
  ]);

  const [newNodeRole, setNewNodeRole] = useState('Department Head');
  const [newNodeName, setNewNodeName] = useState('');

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
    <div className="space-y-6" id="workflows-approval-module">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Escalation Nodes Visual Map (Screen 12.01) */}
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
                {/* Node marker icon */}
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

        {/* Right: Append reviewer node forms */}
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

          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
            <span className="font-bold text-slate-800 block">Workflow Trigger Conditions</span>
            <p className="leading-relaxed">
              Escalation paths are evaluated based on transaction magnitude: EWA requests exceeding <strong>50% of earned wages</strong> automatically require supplemental Finance Director approval.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
