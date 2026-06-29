import React from 'react';

interface Props {
  phone: string;
  label?: string;
  message?: string;
  previewMode?: boolean;
}

const WhatsappBlockContent: React.FC<Props> = ({
  phone,
  label = 'Chat on WhatsApp',
  message = 'Hi! I found you on ProfileFlow.',
  previewMode,
}) => {
  const cleanPhone = (phone || '').replace(/\D/g, '');
  const fullPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
  const waUrl = `https://wa.me/${fullPhone}?text=${encodeURIComponent(message)}`;

  const handleClick = (e: React.MouseEvent) => {
    if (!previewMode) return;
    e.stopPropagation();
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      onClick={previewMode ? handleClick : undefined}
      className={`flex flex-col items-center justify-center h-full p-4 gap-3 ${previewMode ? 'pointer-events-auto cursor-pointer' : ''}`}
    >
      {/* WhatsApp icon */}
      <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[#25D366] flex items-center justify-center shadow-md">
        <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
          <path
            d="M20 10C14.477 10 10 14.477 10 20c0 1.99.58 3.84 1.58 5.4L10 30l4.73-1.55A9.96 9.96 0 0020 30c5.523 0 10-4.477 10-10S25.523 10 20 10zm4.9 13.6c-.2.56-1.18 1.08-1.62 1.14-.44.06-.86.28-2.9-.6-2.44-1.04-4-3.56-4.12-3.72-.12-.16-.96-1.28-.96-2.44 0-1.16.6-1.72.82-1.96.2-.24.44-.3.58-.3h.42c.14 0 .32-.04.5.38.2.46.66 1.6.72 1.72.06.12.1.28.02.44-.08.16-.12.26-.24.4-.12.14-.26.32-.36.42-.12.12-.26.26-.12.5.14.24.62 1.02 1.34 1.66.92.82 1.7 1.08 1.94 1.2.24.12.38.1.52-.04.14-.16.6-.7.76-.94.16-.24.32-.2.54-.12.22.08 1.4.66 1.64.78.24.12.4.18.46.28.06.1.06.58-.14 1.14z"
            fill="white"
          />
        </svg>
      </div>

      <div className="text-center">
        <p className="text-xs font-bold text-green-800 leading-snug">{label}</p>
        {phone && (
          <p className="text-[10px] text-green-600 mt-0.5 font-mono">{phone}</p>
        )}
      </div>

      {previewMode && phone && (
        <div className="text-[10px] font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
          Open WhatsApp →
        </div>
      )}
    </div>
  );
};

export default WhatsappBlockContent;
