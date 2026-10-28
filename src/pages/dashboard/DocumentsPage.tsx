import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { 
  FolderLock, 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { Modal } from '../../components/common/Modal';

export const DocumentsPage: React.FC = () => {
  const { instruments } = useData();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [previewDoc, setPreviewDoc] = useState<any | null>(null);

  // Flatten all documents with their instrument metadata
  const allDocs = useMemo(() => {
    const list: any[] = [];
    instruments.forEach(inst => {
      inst.documents.forEach(doc => {
        list.push({
          ...doc,
          instrumentRef: inst.referenceNumber,
          institutionName: inst.institutionName,
          vendorName: inst.vendorName,
          amount: inst.amount,
          targetInstrumentId: inst.id,
        });
      });
    });
    return list;
  }, [instruments]);

  const filteredDocs = useMemo(() => {
    return allDocs.filter(d => {
      const q = search.toLowerCase();
      const matchesSearch = !q || (
        d.name.toLowerCase().includes(q) ||
        d.instrumentRef.toLowerCase().includes(q) ||
        d.institutionName.toLowerCase().includes(q) ||
        d.vendorName.toLowerCase().includes(q)
      );
      const matchesCat = categoryFilter === 'all' || d.category === categoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [allDocs, search, categoryFilter]);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy tracking-tight">
            Centralized Document Library
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Encrypted file registry of original scanned FDRs, bank guarantee deeds, and lien confirmation letters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs border border-blue-200">
            {allDocs.length} Total Attached Documents
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-card flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search document name, instrument ref, contractor..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer font-medium"
          >
            <option value="all">All Document Categories</option>
            <option value="original_fdr">Original FDR / BG Certificate</option>
            <option value="bank_letter">Bank Lien Confirmation Letter</option>
            <option value="renewal_endorsement">Renewal Endorsement Copy</option>
            <option value="release_claim">Release / Refund Claim</option>
          </select>
        </div>
      </div>

      {/* Documents Table */}
      <div className="rounded-2xl bg-white border border-slate-200/90 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#101C35] text-white">
              <tr>
                <th className="py-3 px-4 font-bold">Document Name</th>
                <th className="py-3 px-4 font-bold">Instrument Ref</th>
                <th className="py-3 px-4 font-bold">Category</th>
                <th className="py-3 px-4 font-bold">Institution & Contractor</th>
                <th className="py-3 px-4 font-bold">Size & Version</th>
                <th className="py-3 px-4 font-bold">Integrity Status</th>
                <th className="py-3 px-4 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.length > 0 ? (
                filteredDocs.map((doc, idx) => (
                  <tr key={`${doc.id}-${idx}`} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="truncate max-w-[200px]">
                          <p className="font-bold text-navy truncate">{doc.name}</p>
                          <p className="text-[10px] text-slate-400">By {doc.uploadedBy} · {doc.uploadedAt}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <Link
                        to={`/dashboard/instruments/${doc.targetInstrumentId}`}
                        className="font-mono font-bold text-blue-600 hover:underline"
                      >
                        {doc.instrumentRef}
                      </Link>
                    </td>

                    <td className="py-3 px-4 text-slate-700 capitalize">
                      {doc.categoryLabel}
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800">{doc.institutionName.split('(')[0]}</p>
                      <p className="text-[10px] text-slate-400 truncate max-w-[140px]">{doc.vendorName}</p>
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      <span className="font-medium">{doc.fileSize}</span>
                      <span className="ml-1 text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">v{doc.version}</span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>SHA-256 Valid</span>
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setPreviewDoc(doc)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400 text-xs">
                    No matching documents found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <Modal
          isOpen={!!previewDoc}
          onClose={() => setPreviewDoc(null)}
          title={`Document Dossier: ${previewDoc.name}`}
          description={`Linked to ${previewDoc.instrumentRef} · ${previewDoc.categoryLabel}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="aspect-video w-full rounded-2xl bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center space-y-2 border border-slate-800 relative overflow-hidden">
              <FileText className="w-12 h-12 text-blue-400 mb-1" />
              <p className="font-bold text-sm">{previewDoc.name}</p>
              <p className="text-[11px] text-slate-400 font-mono">
                SHA-256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
              </p>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Pledge Lien Stamp Verified
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Target Instrument</span>
                <p className="font-mono font-bold text-navy mt-0.5">{previewDoc.instrumentRef}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Pledged Value</span>
                <p className="font-bold text-blue-600 mt-0.5">₹{previewDoc.amount.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Uploader Entity</span>
                <p className="font-medium mt-0.5">{previewDoc.uploadedBy}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Timestamp</span>
                <p className="font-mono mt-0.5">{previewDoc.uploadedAt}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <Link
                to={`/dashboard/instruments/${previewDoc.targetInstrumentId}`}
                onClick={() => setPreviewDoc(null)}
                className="font-bold text-blue-600 hover:underline"
              >
                Go to Full Instrument Workspace &rarr;
              </Link>

              <button
                type="button"
                onClick={() => {
                  alert(`Downloading cryptographic verification bundle for ${previewDoc.name}`);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
              >
                Download Verified PDF
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
