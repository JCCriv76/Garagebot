import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, AlertCircle } from 'lucide-react';

const configs = {
  ok: {
    bg: 'bg-green-500/10',
    text: 'text-green-400',
    border: 'border-green-500/20',
    label: 'OK',
    Icon: CheckCircle2,
  },
  'due-soon': {
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-400',
    border: 'border-yellow-500/20',
    label: 'Due Soon',
    Icon: AlertTriangle,
  },
  overdue: {
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    border: 'border-red-500/20',
    label: 'Overdue',
    Icon: XCircle,
  },
  unknown: {
    bg: 'bg-gray-500/10',
    text: 'text-gray-400',
    border: 'border-gray-500/20',
    label: 'No Data',
    Icon: AlertCircle,
  },
};

export default function StatusBadge({ status }) {
  const cfg = configs[status] || configs.unknown;
  const { bg, text, border, label, Icon } = cfg;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${bg} ${text} ${border}`}>
      <Icon size={11} />
      {label}
    </span>
  );
}
