import React, { useState } from 'react';
import { Pencil, CheckCircle2, AlertTriangle, Package, Hash } from 'lucide-react';
import StatusBadge from './StatusBadge';
import EditItemModal from './EditItemModal';
import { getStatus, getProgress, getMilesUntil, fmtMiles } from '../utils/statusHelper';

function ProgressBar({ pct, status }) {
  const color = status === 'ok' ? 'bg-green-500' : status === 'due-soon' ? 'bg-yellow-500' : status === 'overdue' ? 'bg-red-500' : 'bg-gray-600';
  const trackPct = Math.min(pct, 100);
  return (
    <div className="h-1.5 bg-[#1a2744] rounded-full overflow-hidden w-full">
      <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${trackPct}%` }} />
    </div>
  );
}

function QuickLogModal({ item, currentMileage, onLog, onClose }) {
  const [mileage, setMileage] = useState(currentMileage || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const miles = parseInt(mileage, 10);
    if (isNaN(miles) || miles < 0) return;
    const newHistory = [...(item.history || []), { date, mileage: miles, notes: notes.trim() }];
    const newNextService = item.interval ? miles + item.interval : item.nextService;
    onLog({ lastServiced: miles, nextService: newNextService, history: newHistory });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-[#1e293b]">
          <div>
            <h3 className="font-display font-semibold text-white text-base">Log Service</h3>
            <p className="text-gray-500 text-xs mt-0.5">{item.name}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-[#1a2744] text-gray-400 hover:text-white rounded-lg transition-colors">
            <span className="text-lg leading-none">×</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Mileage at Service</label>
            <input
              type="number"
              value={mileage}
              onChange={e => setMileage(e.target.value)}
              className="w-full bg-[#1a2744] border border-[#2d3f5e] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              placeholder="e.g. 65000"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full bg-[#1a2744] border border-[#2d3f5e] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Notes (optional)</label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full bg-[#1a2744] border border-[#2d3f5e] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              placeholder="e.g. Used Mobil 1 0W-20"
            />
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-[#1a2744] border border-[#2d3f5e] text-gray-300 text-sm font-medium rounded-lg hover:bg-[#1e2f55] transition-colors">
              Cancel
            </button>
            <button type="submit" className="flex-[2] py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors">
              Log Service
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function MaintenanceRow({ item, currentMileage, onUpdate }) {
  const [editOpen, setEditOpen] = useState(false);
  const [quickLogOpen, setQuickLogOpen] = useState(false);

  const status = getStatus(item, currentMileage);
  const pct = getProgress(item, currentMileage);
  const milesUntil = getMilesUntil(item, currentMileage);

  const milesLabel = (() => {
    if (milesUntil === null) return null;
    if (milesUntil <= 0) return <span className="text-xs font-semibold text-red-400">{fmtMiles(Math.abs(milesUntil))} mi OVERDUE</span>;
    return <span className="text-xs text-gray-400">+{fmtMiles(milesUntil)} mi</span>;
  })();

  const handleSave = (updates) => {
    onUpdate(item.id, updates);
    setEditOpen(false);
  };

  const handleQuickLog = (updates) => {
    onUpdate(item.id, updates);
  };

  return (
    <>
      <div className="bg-[#0a1628] border border-[#1e293b] hover:border-[#2d3f5e] rounded-xl p-4 transition-colors group">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            {/* Name row */}
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="font-semibold text-white text-sm">{item.name}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${item.type === 'task' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
                {item.type === 'task' ? 'task' : 'item'}
              </span>
              <StatusBadge status={status} />
              {milesLabel}
            </div>

            {/* Progress bar */}
            <div className="mb-3">
              <ProgressBar pct={pct} status={status} />
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-2">
              <span>Last: <span className="text-gray-300">{fmtMiles(item.lastServiced)} mi</span></span>
              <span>Interval: <span className="text-gray-300">every {fmtMiles(item.interval)} mi</span></span>
              <span>Next: <span className={status === 'overdue' ? 'text-red-400 font-semibold' : status === 'due-soon' ? 'text-yellow-400 font-semibold' : 'text-gray-300'}>{fmtMiles(item.nextService)} mi</span></span>
              {item.history && item.history.length > 0 && (
                <span>History: <span className="text-gray-300">{item.history.length} {item.history.length === 1 ? 'entry' : 'entries'}</span></span>
              )}
            </div>

            {/* Part info */}
            {(item.partNumber || item.brand || item.fluidType || item.quantity) && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {item.partNumber && (
                  <span className="inline-flex items-center gap-1 bg-[#1a2744] border border-[#2d3f5e] rounded-full px-2 py-0.5 text-xs text-gray-400">
                    <Hash size={9} className="text-gray-500" /> {item.partNumber}
                  </span>
                )}
                {item.brand && (
                  <span className="inline-flex items-center gap-1 bg-[#1a2744] border border-[#2d3f5e] rounded-full px-2 py-0.5 text-xs text-gray-400">
                    <Package size={9} className="text-gray-500" /> {item.brand}
                  </span>
                )}
                {item.fluidType && (
                  <span className="inline-flex items-center gap-1 bg-[#1a2744] border border-[#2d3f5e] rounded-full px-2 py-0.5 text-xs text-gray-400">
                    {item.fluidType}
                  </span>
                )}
                {item.quantity && (
                  <span className="inline-flex items-center gap-1 bg-[#1a2744] border border-[#2d3f5e] rounded-full px-2 py-0.5 text-xs text-gray-400">
                    {item.quantity}
                  </span>
                )}
              </div>
            )}

            {/* Spec */}
            {item.spec && (
              <p className="text-xs text-gray-500 mt-1.5 italic">{item.spec}</p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-start gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setQuickLogOpen(true)}
              className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition-colors"
              title="Quick log service"
            >
              <CheckCircle2 size={15} />
            </button>
            <button
              onClick={() => setEditOpen(true)}
              className="p-2 bg-[#1a2744] hover:bg-[#1e2f55] text-gray-400 hover:text-orange-400 rounded-lg transition-colors"
              title="Edit item"
            >
              <Pencil size={15} />
            </button>
          </div>
        </div>
      </div>

      {editOpen && (
        <EditItemModal
          item={item}
          currentMileage={currentMileage}
          onSave={handleSave}
          onClose={() => setEditOpen(false)}
        />
      )}
      {quickLogOpen && (
        <QuickLogModal
          item={item}
          currentMileage={currentMileage}
          onLog={handleQuickLog}
          onClose={() => setQuickLogOpen(false)}
        />
      )}
    </>
  );
}

export default function MaintenanceTable({ items, category, currentMileage, onUpdate }) {
  const overdue = items.filter(i => getStatus(i, currentMileage) === 'overdue').length;
  const dueSoon = items.filter(i => getStatus(i, currentMileage) === 'due-soon').length;

  const summary = (() => {
    if (overdue > 0 && dueSoon > 0) return `${overdue} overdue · ${dueSoon} due soon`;
    if (overdue > 0) return `${overdue} ${overdue === 1 ? 'item' : 'items'} overdue`;
    if (dueSoon > 0) return `${dueSoon} ${dueSoon === 1 ? 'item' : 'items'} due soon`;
    return 'All items OK';
  })();

  const summaryColor = overdue > 0 ? 'text-red-400' : dueSoon > 0 ? 'text-yellow-400' : 'text-green-400';

  return (
    <div className="fade-in">
      {/* Summary bar */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          <span className={`font-semibold ${summaryColor}`}>{summary}</span>
          <span className="ml-2 text-gray-600">· {items.length} total items</span>
        </p>
      </div>

      {/* Items */}
      <div className="space-y-2">
        {items.map(item => (
          <MaintenanceRow
            key={item.id}
            item={item}
            currentMileage={currentMileage}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </div>
  );
}
