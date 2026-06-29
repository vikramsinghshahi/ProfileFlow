import React from 'react';

interface Props {
  paymentLink: string;
  label?: string;
  description?: string;
  previewMode?: boolean;
}

const RazorpayBlockContent: React.FC<Props> = ({
  paymentLink,
  label = 'Pay Now',
  description,
  previewMode,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (!previewMode || !paymentLink) return;
    e.stopPropagation();
    window.open(paymentLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      onClick={previewMode ? handleClick : undefined}
      className={`flex flex-col items-center justify-center h-full p-4 gap-3 ${previewMode && paymentLink ? 'pointer-events-auto cursor-pointer' : ''}`}
    >
      {/* Razorpay-style payment icon */}
      <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[#2D81F7] flex items-center justify-center shadow-md">
        <span className="text-white text-xl font-black">₹</span>
      </div>

      <div className="text-center">
        <p className="text-xs font-bold text-blue-900 leading-snug">{label}</p>
        {description && (
          <p className="text-[10px] text-blue-700 mt-1 leading-snug line-clamp-2">{description}</p>
        )}
      </div>

      {previewMode && paymentLink && (
        <div className="text-[10px] font-semibold text-white bg-[#2D81F7] px-3 py-1 rounded-full shadow-sm">
          Pay via Razorpay →
        </div>
      )}
    </div>
  );
};

export default RazorpayBlockContent;
