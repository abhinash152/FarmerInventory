import React, { useState } from 'react';
import { Order } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  X,
  AlertTriangle,
  Camera,
  Upload,
  ShieldAlert,
  CheckCircle2,
  Trash2,
  FileText,
} from 'lucide-react';

interface ComplaintModalProps {
  order: Order;
  onClose: () => void;
  onSuccess: () => void;
}

export const ComplaintModal: React.FC<ComplaintModalProps> = ({
  order,
  onClose,
  onSuccess,
}) => {
  const { token } = useAuth();
  const { success, error } = useToast();

  const [issueType, setIssueType] = useState('DAMAGED');
  const [description, setDescription] = useState('');
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Convert uploaded image file to base64 data URI
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      error('File Too Large', 'Please select an image smaller than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProofImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!description.trim()) {
      error('Description Required', 'Please provide details about the quality issue');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          order_id: order.order_id,
          issue_type: issueType,
          description: description.trim(),
          proof_image: proofImage,
        }),
      });

      const data = await res.json();
      if (data.success) {
        success(
          'Quality Complaint Filed',
          'Your report and photographic proof have been submitted for grower review.'
        );
        onSuccess();
        onClose();
      } else {
        error('Submission Failed', data.message || 'Could not submit complaint');
      }
    } catch {
      error('Network Error', 'Failed to connect to server');
    } finally {
      setIsSubmitting(false);
    }
  };

  const issueCategories = [
    { id: 'DAMAGED', label: 'Damaged / Bruised Produce', sub: 'क्षतिग्रस्त या कुचली हुई उपज' },
    { id: 'POOR_QUALITY', label: 'Substandard / Low Quality', sub: 'कम गुणवत्ता' },
    { id: 'SPOILED', label: 'Spoiled / Rotten / Moldy', sub: 'सड़ा या बासी उत्पाद' },
    { id: 'INCORRECT', label: 'Wrong Item or Missing Quantity', sub: 'गलत सामान या वजन में कमी' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[85vh] animate-scale-up">
        {/* Header */}
        <div className="p-5 border-b border-rose-100 dark:border-rose-950/60 bg-rose-50/70 dark:bg-rose-950/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-500/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-stone-900 dark:text-stone-100">
                Report Quality Issue / File Complaint
              </h3>
              <p className="text-xs text-stone-500">
                Order #{order.order_id} • {order.product?.product_name || 'Produce'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* Order Summary Pill */}
          <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/60 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-stone-900 dark:text-stone-100 block">
                {order.product?.product_name} ({order.quantity} {order.product?.unit})
              </span>
              <span className="text-[11px] text-stone-500">
                Grower: <strong>{order.farmer?.full_name}</strong> ({order.farmer?.farm_location || 'Local Farm'})
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
              Verified Order
            </span>
          </div>

          {/* Issue Type Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
              Select Problem Category *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {issueCategories.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setIssueType(cat.id)}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    issueType === cat.id
                      ? 'border-rose-500 bg-rose-50/80 dark:bg-rose-950/40 text-rose-950 dark:text-rose-200 ring-2 ring-rose-500/20'
                      : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:border-rose-300'
                  }`}
                >
                  <div className="font-bold text-xs">{cat.label}</div>
                  <div className="text-[10px] text-stone-500">{cat.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
              Describe What Happened *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Received bruised tomatoes that were split open during packaging; smells spoiled..."
              className="w-full p-3 rounded-xl text-xs border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Photographic Proof Upload */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-rose-500" />
                <span>Upload Proof Photo (Recommended)</span>
              </label>
              <span className="text-[10px] text-stone-400">Max 5MB (JPG/PNG)</span>
            </div>

            {proofImage ? (
              <div className="relative rounded-2xl overflow-hidden border-2 border-rose-300 dark:border-rose-800 bg-stone-950">
                <img
                  src={proofImage}
                  alt="Proof Preview"
                  className="w-full h-44 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setProofImage(null)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-rose-600 text-white shadow-md hover:bg-rose-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/75 text-white text-[10px] font-bold">
                  ✓ Photo Attached
                </div>
              </div>
            ) : (
              <label className="border-2 border-dashed border-stone-300 dark:border-stone-700 hover:border-rose-400 dark:hover:border-rose-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-stone-50/50 dark:bg-stone-800/40 transition-colors group">
                <Upload className="w-8 h-8 text-stone-400 group-hover:text-rose-500 mb-2 transition-colors" />
                <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
                  Click to select damaged produce photo
                </span>
                <span className="text-[10px] text-stone-500 mt-0.5">
                  Helps grower inspect defects and issue speedy resolution
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 font-bold text-xs text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {isSubmitting ? 'Submitting Dispute...' : 'Submit Quality Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
