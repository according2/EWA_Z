import React, { useState } from 'react';
import { 
  GitBranch, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Code, 
  Slack, 
  Layers,
  Webhook,
  Activity,
  Landmark,
  Wallet,
  Building,
  Key,
  ShieldCheck,
  Server
} from 'lucide-react';

interface IntegrationsViewProps {
  addToast: (message: string, type: 'success' | 'info' | 'error') => void;
}

export default function IntegrationsView({ addToast }: IntegrationsViewProps) {
  const [activeTab, setActiveTab] = useState<'core' | 'banking' | 'ewa' | 'webhooks'>('banking');

  // Integrations states
  const [integrations, setIntegrations] = useState([
    { name: 'QuickBooks Ledger', provider: 'Intuit', desc: 'Syncs statutory PF and salary ledger items directly with accounting.', status: 'Connected' },
    { name: 'Slack Notifications', provider: 'Slack App', desc: 'Dispatches automated slips and EWA notices directly to employee DMs.', status: 'Connected' },
    { name: 'SAP ERP Integration', provider: 'SAP', desc: 'Syncs organizational department headcount changes with SAP HR portals.', status: 'Pending' }
  ]);

  // Banking channels
  const [bankChannels, setBankChannels] = useState([
    { name: 'KBZ Bank API', type: 'Corporate Bank Account', account: 'XXXX-XXXX-1234', balance: 450000.00, status: 'Active', lastSync: '10 mins ago' },
    { name: 'AYA Bank API', type: 'Corporate Bank Account', account: 'XXXX-XXXX-9876', balance: 120000.00, status: 'Active', lastSync: '1 hr ago' },
    { name: 'Wave Pay', type: 'Mobile Wallet / Disbursement', account: 'Corporate Merchant', balance: 25000.00, status: 'Active', lastSync: '5 mins ago' },
    { name: 'KPay (KBZPay)', type: 'Mobile Wallet / Disbursement', account: 'Corporate Merchant', balance: 50000.00, status: 'Pending', lastSync: 'N/A' },
  ]);

  // Webhooks states
  const [webhooks, setWebhooks] = useState([
    { id: 'WH-1', url: 'https://api.zylker.com/webhooks/payroll-status', event: 'payrun.disbursed', secret: 'whsec_a8b293c' }
  ]);
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [newWebhookEvent, setNewWebhookEvent] = useState('payrun.disbursed');

  // Webhook live logs stream
  const [webhookLogs, setWebhookLogs] = useState([
    { timestamp: '2026-07-30 14:02:11', event: 'ewa.requested', payload: '{"employeeId": "EMP002", "amount": 15000, "status": "Pending"}', code: 200 },
    { timestamp: '2026-07-30 11:42:04', event: 'onboarding.completed', payload: '{"employeeId": "EMP006", "name": "Vikram Sen", "department": "Marketing"}', code: 201 }
  ]);

  const handleAddWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWebhookUrl.trim()) {
      addToast('Please provide a target Webhook URL destination.', 'error');
      return;
    }
    const id = `WH-${webhooks.length + 1}`;
    const secret = `whsec_` + Math.random().toString(36).substring(3, 10);
    setWebhooks([
      ...webhooks,
      { id, url: newWebhookUrl, event: newWebhookEvent, secret }
    ]);
    addToast(`Successfully registered custom Webhook trigger for event: ${newWebhookEvent}!`, 'success');
    
    // Append to live logs stream
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setWebhookLogs([
      { timestamp, event: 'webhook.registered', payload: `{"id": "${id}", "url": "${newWebhookUrl}", "secret": "${secret}"}`, code: 200 },
      ...webhookLogs
    ]);
    setNewWebhookUrl('');
  };

  const handleDeleteWebhook = (id: string, url: string) => {
    setWebhooks(prev => prev.filter(w => w.id !== id));
    addToast(`Deregistered webhook destination: ${url}`, 'info');
  };

  const handleSyncNow = (name: string) => {
    addToast(`Triggering real-time ledger synchronization for ${name}...`, 'info');
    setTimeout(() => {
      addToast(`Reconciled successfully with ${name}!`, 'success');
    }, 1200);
  };

  return (
    <div className="space-y-6" id="integrations-module-root">
      
      <div className="bg-white p-4 border border-slate-200 rounded-xl space-y-4">
        <div className="flex items-center space-x-3 text-slate-800">
          <Server className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-lg font-bold">API Integrations & Channels</h2>
            <p className="text-xs text-slate-500 font-medium">Manage banking APIs, EWA providers, external apps, and webhook subscriptions.</p>
          </div>
        </div>

        <div className="flex space-x-2 border-b border-slate-200">
          {[
            { id: 'banking', label: 'Banking & Disbursements', icon: Landmark },
            { id: 'ewa', label: 'EWA Provider API', icon: Wallet },
            { id: 'core', label: 'Core Apps', icon: Layers },
            { id: 'webhooks', label: 'Webhooks & Events', icon: Webhook }
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

      {activeTab === 'banking' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">Linked Disbursement Channels</h3>
            <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg flex items-center space-x-1 transition">
              <Plus className="w-4 h-4" />
              <span>Add Channel</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bankChannels.map((bank, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-extrabold text-slate-800 text-sm">{bank.name}</h4>
                    <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                      bank.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {bank.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{bank.type}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3 bg-slate-50 border border-slate-100 p-3 rounded-lg text-xs">
                  <div>
                    <span className="block text-slate-400 font-bold mb-0.5 text-[10px] uppercase">Balance / Liquidity</span>
                    <span className="font-mono font-bold text-slate-700">${bank.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 font-bold mb-0.5 text-[10px] uppercase">Last Sync</span>
                    <span className="font-medium text-slate-700">{bank.lastSync}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
                  <button onClick={() => handleSyncNow(bank.name)} className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded transition flex justify-center items-center space-x-1">
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Sync Balance</span>
                  </button>
                  <button className="flex-1 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-[11px] rounded transition">
                    Configure
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'ewa' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-800 mb-1">EWA Provider Configuration</h3>
              <p className="text-xs text-slate-500 font-medium">Manage API settings between Employer and EWA Liquidity Provider.</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Provider API Endpoint</label>
                <div className="flex items-center space-x-2">
                  <input type="text" readOnly value="https://api.ewaprovider.com/v1" className="flex-1 text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 font-mono" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Employer Tenant ID</label>
                <div className="flex items-center space-x-2">
                  <input type="text" readOnly value="EMP_TENANT_9X8B7C" className="flex-1 text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 font-mono" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">API Key</label>
                <div className="flex items-center space-x-2">
                  <input type="password" readOnly value="sk_test_1234567890abcdef" className="flex-1 text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 font-mono" />
                  <button className="p-2.5 border border-slate-200 rounded-lg text-slate-500 hover:text-blue-600 transition">
                    <Key className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <button className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition">
              Rotate API Keys
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3">EWA Provider POV: Liquidity Pool</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <span className="block text-emerald-800 font-extrabold text-[10px] uppercase mb-1">Available Pool</span>
                  <span className="text-xl font-black text-emerald-700 font-mono">$1,250,000</span>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <span className="block text-blue-800 font-extrabold text-[10px] uppercase mb-1">Disbursed (MTD)</span>
                  <span className="text-xl font-black text-blue-700 font-mono">$320,400</span>
                </div>
              </div>
              
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                The provider automatically sweeps repayment amounts during the payroll cycle run via API. If liquidity pool drops below $100k, a capital call alert is triggered.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3">System Health Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="font-semibold text-slate-700">API Gateway Status</span>
                  </div>
                  <span className="text-emerald-600 font-bold">Operational</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4 text-emerald-500" />
                    <span className="font-semibold text-slate-700">Roster Sync (Hourly)</span>
                  </div>
                  <span className="text-emerald-600 font-bold">Success (10m ago)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'core' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {integrations.map((int, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-800 text-xs">{int.name}</span>
                  <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                    int.status === 'Connected' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}>
                    {int.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal font-semibold">{int.desc}</p>
              </div>
              <button
                onClick={() => handleSyncNow(int.name)}
                className="w-full py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-[11px] rounded-lg cursor-pointer flex items-center justify-center space-x-1"
              >
                <RefreshCw className="w-3.5 h-3.5 text-blue-500" />
                <span>Trigger Reconciliation Sync</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'webhooks' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <div>
              <span className="bg-blue-50 text-blue-700 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border border-blue-100">
                Webhooks Registry
              </span>
              <h3 className="text-sm font-extrabold text-slate-800 mt-1.5">Registered Custom Event Webhooks</h3>
              <p className="text-xs text-slate-400">Trigger custom API callback URLs on statutory and payroll events.</p>
            </div>

            <div className="space-y-3.5">
              {webhooks.map((wh) => (
                <div key={wh.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-slate-800 truncate max-w-xs">{wh.url}</span>
                    <button 
                      onClick={() => handleDeleteWebhook(wh.id, wh.url)}
                      className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded"
                      title="Delete webhook"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold font-mono">
                    <span>Event: {wh.event}</span>
                    <span>Secret: {wh.secret}</span>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddWebhook} className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs border-t pt-4 border-slate-100">
              <div className="sm:col-span-6">
                <label className="block text-slate-500 font-semibold mb-1">Webhook Target URL</label>
                <input
                  type="url"
                  placeholder="https://api.yourdomain.com/webhooks"
                  value={newWebhookUrl}
                  onChange={(e) => setNewWebhookUrl(e.target.value)}
                  className="w-full border border-slate-200 rounded p-2 text-xs focus:outline-none"
                />
              </div>
              <div className="sm:col-span-3">
                <label className="block text-slate-500 font-semibold mb-1">Trigger Event</label>
                <select
                  value={newWebhookEvent}
                  onChange={(e) => setNewWebhookEvent(e.target.value)}
                  className="w-full border border-slate-200 rounded p-2 text-xs bg-white focus:outline-none"
                >
                  <option value="payrun.disbursed">payrun.disbursed</option>
                  <option value="ewa.requested">ewa.requested</option>
                  <option value="onboarding.completed">onboarding.completed</option>
                </select>
              </div>
              <div className="sm:col-span-3 flex items-end">
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg cursor-pointer transition flex items-center justify-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register</span>
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 space-y-4 flex flex-col h-[500px]">
            <div className="flex items-center space-x-2 border-b pb-3 border-slate-100 justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-blue-500" />
                <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Live API Webhooks Logs
                </h3>
              </div>
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {webhookLogs.map((log, idx) => (
                <div key={idx} className="p-3 bg-slate-950 text-slate-300 rounded-lg space-y-1.5 text-[10px] font-mono leading-relaxed border border-slate-900">
                  <div className="flex justify-between font-bold">
                    <span className="text-blue-400">EVENT: {log.event}</span>
                    <span className={log.code >= 200 && log.code < 300 ? 'text-emerald-400' : 'text-rose-400'}>
                      HTTP {log.code}
                    </span>
                  </div>
                  <div className="text-slate-500 font-semibold">{log.timestamp}</div>
                  <div className="bg-slate-900 p-2 rounded text-[9px] text-slate-400 overflow-x-auto truncate">
                    {log.payload}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
