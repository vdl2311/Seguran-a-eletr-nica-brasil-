import React from 'react';
import { QuoteStatus } from '../../types';

interface StatusBadgeProps {
  status: QuoteStatus;
  className?: string;
  size?: 'sm' | 'md';
}

export const statusConfig: Record<
  QuoteStatus,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  draft: {
    label: 'Rascunho',
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-300',
    dot: 'bg-slate-500',
  },
  sent: {
    label: 'Enviado',
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    border: 'border-blue-300',
    dot: 'bg-blue-600',
  },
  pending: {
    label: 'Aguardando',
    bg: 'bg-amber-50',
    text: 'text-amber-900',
    border: 'border-amber-300',
    dot: 'bg-amber-500',
  },
  approved: {
    label: 'Aprovado',
    bg: 'bg-emerald-50',
    text: 'text-emerald-900',
    border: 'border-emerald-300',
    dot: 'bg-emerald-600',
  },
  rejected: {
    label: 'Recusado',
    bg: 'bg-rose-50',
    text: 'text-rose-900',
    border: 'border-rose-300',
    dot: 'bg-rose-600',
  },
  expired: {
    label: 'Expirado',
    bg: 'bg-zinc-100',
    text: 'text-zinc-700',
    border: 'border-zinc-300',
    dot: 'bg-zinc-400',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '', size = 'md' }) => {
  const config = statusConfig[status] || statusConfig.draft;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border ${config.bg} ${config.text} ${config.border} ${sizeClasses} whitespace-nowrap shrink-0 ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};
