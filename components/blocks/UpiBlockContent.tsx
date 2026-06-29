import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface Props {
  upiId: string;
  name: string;
  amount?: string;
  previewMode?: boolean;
}

const UpiBlockContent: React.FC<Props> = ({ upiId, name, amount, previewMode }) => {
  const [qrDataUrl, setQrDataUrl] = useState('');

  const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId || '')}&pn=${encodeURIComponent(name || '')}&cu=INR${amount ? `&am=${amount}` : ''}`;

  useEffect(() => {
    if (!upiId) return;
    QRCode.toDataURL(upiUrl, { width: 140, margin: 1, color: { dark: '#1a1a1a', light: '#f0fdf4' } })
      .then(setQrDataUrl)
      .catch(() => {});
  }, [upiUrl, upiId]);

  const handlePay = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(upiUrl, '_blank');
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-3 gap-2">
      <p className="text-[10px] font-bold text-green-700 uppercase tracking-widest">Pay via UPI</p>

      {qrDataUrl ? (
        <img src={qrDataUrl} alt="UPI QR Code" className="rounded-lg w-[100px] h-[100px] md:w-[120px] md:h-[120px]" />
      ) : (
        <div className="w-[100px] h-[100px] rounded-lg bg-green-100 flex items-center justify-center">
          <span className="text-3xl text-green-600">₹</span>
        </div>
      )}

      <p className="text-[10px] text-gray-500 font-mono truncate max-w-full px-1">
        {upiId || 'yourname@upi'}
      </p>

      {amount && (
        <p className="text-base font-bold text-green-700">₹{amount}</p>
      )}

      {previewMode && upiId && (
        <button
          onClick={handlePay}
          className="pointer-events-auto w-full bg-green-600 text-white text-[10px] font-semibold py-1.5 px-3 rounded-lg hover:bg-green-700 active:scale-95 transition-all"
        >
          Pay Now →
        </button>
      )}
    </div>
  );
};

export default UpiBlockContent;
