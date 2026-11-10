import React from 'react';
import { X, ExternalLink, Download } from 'lucide-react';

interface AdminScreenshotModalProps {
  screenshotUrl: string | null;
  onClose: () => void;
  senderName?: string;
  trxId?: string;
}

export const AdminScreenshotModal: React.FC<AdminScreenshotModalProps> = ({
  screenshotUrl,
  onClose,
  senderName,
  trxId
}) => {
  if (!screenshotUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="bg-[#101319] border border-white/20 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-4 py-3 bg-[#151922] border-b border-white/10 flex items-center justify-between">
          <div>
            <h4 className="font-heading font-black text-white text-sm">
              EASYPAISA PAYMENT RECEIPT
            </h4>
            <p className="text-[11px] text-zinc-400">
              Sender: <strong className="text-white">{senderName || 'N/A'}</strong> • TRX:{' '}
              <span className="font-mono text-amber-400 font-bold">{trxId || 'N/A'}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Image content */}
        <div className="flex-1 overflow-auto p-3 flex items-center justify-center bg-black/60">
          <img
            src={screenshotUrl}
            alt="Payment Proof"
            className="max-h-[70vh] w-auto max-w-full object-contain rounded-lg border border-white/10 shadow-lg"
          />
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#151922] border-t border-white/10 flex items-center justify-between text-xs">
          <span className="text-zinc-400 text-[11px]">Check transaction timestamp and 3737 sender ID</span>
          <a
            href={screenshotUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-200 hover:text-white flex items-center space-x-1"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Original</span>
          </a>
        </div>
      </div>
    </div>
  );
};
