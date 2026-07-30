import React, { useState, useRef } from 'react';
import { 
  FileText, 
  FileCheck, 
  CheckCircle2, 
  Trash2, 
  Download, 
  PenTool, 
  Award,
  Globe
} from 'lucide-react';

interface DocumentsViewProps {
  addToast: (message: string, type: 'success' | 'info' | 'error') => void;
}

export default function DocumentsView({ addToast }: DocumentsViewProps) {
  // Drawing canvas state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);
  const [signedDocApproved, setSignedDocApproved] = useState(false);

  // Document templates state
  const docTemplates = [
    { name: 'Employment Offer Letter Standard', code: 'OFFER-STD-2026', size: '242 KB', category: 'Contract' },
    { name: 'Non-Disclosure Agreement (NDA)', code: 'NDA-CORP-V4', size: '156 KB', category: 'Compliance' },
    { name: 'SSB Form-1 Employer Registration Card', code: 'SSB-F1-MM', size: '112 KB', category: 'Statutory' },
    { name: 'SSB Form-15 Employee Contribution Slip', code: 'SSB-F15-MM', size: '98 KB', category: 'Statutory' },
    { name: 'DICA Annual Return Declaration', code: 'DICA-AR-MM', size: '130 KB', category: 'Corporate' }
  ];

  // Signature Canvas Controls
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    setHasSigned(true);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
    setSignedDocApproved(false);
  };

  return (
    <div className="space-y-6" id="documents-module">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Hand: Offer Letter Document Signer */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div>
            <span className="bg-blue-50 text-blue-700 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border border-blue-100">
              Active Agreement
            </span>
            <h3 className="text-sm font-extrabold text-slate-800 mt-1.5">Employment Offer Letter Agreement</h3>
            <p className="text-xs text-slate-400">Review corporate terms below and apply digital seal signature.</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 h-48 overflow-y-auto text-[11px] leading-relaxed text-slate-600 font-semibold">
            <h4 className="font-bold text-slate-800 uppercase mb-2 text-center border-b pb-1 border-slate-200">
              MEMORANDUM OF EMPLOYMENT
            </h4>
            <p className="mb-3">
              This Employment Agreement is entered on July 30, 2026, by and between <strong>Zylker Technologies (Myanmar) Co., Ltd.</strong> (the "Company") and the systems candidate.
            </p>
            <p className="mb-3">
              <strong>1. Grade Hierarchy & Designation:</strong> Systems Analyst (Grade Level G4). Reporting directly to Product Engineering Lead in Bahan, Yangon Office.
            </p>
            <p className="mb-3">
              <strong>2. Compensation Framework:</strong> Monthly basic gross wage is fixed at 1,000,000 Ks, with 300,000 Ks House Rent Allowance (HRA) and 150,000 Ks Travel/Meal Allowances. Statutory employee contributions to the Social Security Board (SSB) (2% capped at 6,000 Ks) and Personal Income Tax (PIT) are subtracted at source.
            </p>
            <p className="mb-3">
              <strong>3. Code of Regulations:</strong> Candidate agrees to preserve confidentiality, absolute intellectual patent releases, and strict compliance with national statutory codes.
            </p>
            <p className="text-slate-400 italic text-[10px] mt-4 text-center">
              Sign inside the canvas below to authenticate this digital agreement bind.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase">
              <span>Draw Digital Signature</span>
              {hasSigned && (
                <button 
                  onClick={clearSignature} 
                  className="text-[10px] text-rose-500 hover:underline cursor-pointer"
                >
                  Clear Signature Pad
                </button>
              )}
            </div>
            
            <div className="border border-dashed border-slate-300 rounded-lg bg-slate-50/50 p-1.5">
              <canvas
                ref={canvasRef}
                width={500}
                height={100}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={() => setIsDrawing(false)}
                onMouseLeave={() => setIsDrawing(false)}
                className="cursor-crosshair w-full block h-24 bg-white rounded border border-slate-100"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 gap-3">
            <button 
              disabled={!hasSigned}
              onClick={() => {
                setSignedDocApproved(true);
                addToast('Digital signature verified and bound to memorandum contract!', 'success');
              }}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center space-x-2 cursor-pointer"
            >
              <FileCheck className="w-4 h-4" />
              <span>Attach Sealed Signature</span>
            </button>
          </div>

          {signedDocApproved && (
            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-800 font-bold flex items-center space-x-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Contract verified & stored! Document Hash ID: #ZYLK-Offer-MM-908A2</span>
            </div>
          )}
        </div>

        {/* Right Hand: Corporate Template Locker */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider border-b pb-3 border-slate-100">
            Corporate Compliance Template Locker
          </h3>
          <p className="text-xs text-slate-400">Download and deploy standard statutory blank document forms.</p>
          
          <div className="space-y-3">
            {docTemplates.map((doc) => (
              <div key={doc.code} className="p-3 border border-slate-100 bg-slate-50/50 rounded-xl flex items-center justify-between text-xs font-semibold text-slate-600">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block">{doc.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">{doc.code} • {doc.size}</span>
                  </div>
                </div>
                <button 
                  onClick={() => addToast(`Initiated download for compliance template: ${doc.code}`, 'info')}
                  className="p-1.5 border border-slate-200 hover:bg-slate-100 rounded text-slate-500 cursor-pointer"
                  title="Download Form"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
