import React from 'react';

const COLORS = [
  'bg-slate-700',
  'bg-zinc-700',
  'bg-stone-700',
  'bg-neutral-700',
  'bg-gray-700'
];

const getInitials = (name) => {
  if (!name) return '??';
  const parts = name.split(/[\s_]+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const getDeterministicColor = (name) => {
  if (!name) return COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLORS.length;
  return COLORS[index];
};

export const Avatar = ({ name, className = "w-8 h-8 text-xs" }) => {
  const initials = getInitials(name);
  const colorClass = getDeterministicColor(name);

  return (
    <div
      className={`rounded-full flex items-center justify-center font-mono font-medium text-white shadow-inner ${colorClass} ${className}`}
      title={name}
    >
      {initials}
    </div>
  );
};
