import React, { useState, useEffect } from 'react';
import { X, Plus, Calendar, Gauge, RotateCcw, Package, Hash, Clock } from 'lucide-react';

function FormField({ label, icon: Icon, children }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
        {Icon && <Icon size={12} />}
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass = "w-full bg-[#1a2744] border border-[#2d3f5e] rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors";

export default function EditItemModal({ item, currentMileage, onSave, onClose }) {
  const [form, setForm] = useState({
    lastServiced: item.lastServiced ?? '',
    interval: item.interval ?? '',
    nextService: item.nextService ?? '',
    partNumber: item.partNumber ?? '',
    brand: item.brand ?? '',
    quantity: item.quantity ?? '',
    fluidType: item.fluidType ?? '',
    spec: item.spec ?? '',
    notes: item.notes ?? '',
  });

  const [logForm, setLogForm] = useState({
    mileage: currentMileage || '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  // Auto-compute nextService when lastServiced or interval changes
  useEffect(() => {
    const last = parseInt(form.lastServiced, 10);
    const interval = parseInt(form.interval, 10);
    if (!isNaN(last) && !isNaN(interval)) {
      setForm(f => ({ ...f, nextService: last + interval }));
    }
  }, [form.lastServiced, form.interval]);

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const handleSave = () => {
    onSave({
      ...form,
      lastServiced: parseInt(form.lastServiced, 10) || 0,
      interval: parseInt(form.interval, 10) || 0,
      nextService: parseInt(form.nextService, 10) || 0,
    });
  };

  const handleLogService = () => {
    const miles = parseInt(logForm.mileage, 10);
    if (isNaN(miles) || miles < 0) return;
    const newHistory = [
      ...(item.history || []),
      { date: logForm.date, mileage: miles, notes: logForm.notes.trim() },
    ];
    const interval = parseInt(form.interval, 10) || item.interval || 0;
    const newLastServiced = miles;
    const newNextService = interval ? miles + interval : parseInt(form.nextService, 10) || 0;

    setForm(f => ({
      ...f,
      lastServiced: newLastServiced,
      nextService: newNextService,
    }));

    setLogForm({ mileage: currentMileage || '', date: new Date().toISOString().split('T')[0], notes: '' });

    onSave({
      ...form,
      lastServiced: newLastServiced,
      interval: parseInt(form.interval, 10) || 0,
      nextService: newNextService,
      history: newHistory,
    });
  };

  const history = item.history || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-[#1e293b]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-display text-lg font-bold text-white">{item.name}</h2>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${item.type === 'task' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-purple-500/10 text-purple-400 border-purple-500/20'}`}>
                {item.type === 'task' ? 'Task' : 'Item'}
              </span>
            </div>
            <p className="text-gray-500 text-xs">Edit details, specs, and service history</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#1a2744] text-gray-400 hover:text-white rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 p-5 space-y-6">
          {/* Service Interval fields */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <RotateCcw size={12} /> Service Intervals
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <FormField label="Last Serviced" icon={Gauge}>
                <input
                  type="number"
                  value={form.lastServiced}
                  onChange={e => set('lastServiced', e.target.value)}
                  className={inputClass}
                  placeholder="miles"
                />
              </FormField>
              <FormField label="Interval (mi)" icon={RotateCcw}>
                <input
                  type="number"
                  value={form.interval}
                  onChange={e => set('interval', e.target.value)}
                  className={inputClass}
                  placeholder="miles"
                />
              </FormField>
              <FormField label="Next Service" icon={Clock}>
                <input
                  type="number"
                  value={form.nextService}
                  onChange={e => set('nextService', e.target.value)}
                  className={inputClass}
                  placeholder="miles"
                />
              </FormField>
            </div>
          </div>

          {/* Parts & Specs */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Package size={12} /> Parts & Specs
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Part Number" icon={Hash}>
                <input type="text" value={form.partNumber} onChange={e => set('partNumber', e.target.value)} className={inputClass} placeholder="e.g. 04465-0P010" />
              </FormField>
              <FormField label="Brand">
                <input type="text" value={form.brand} onChange={e => set('brand', e.target.value)} className={inputClass} placeholder="e.g. Genuine Toyota" />
              </FormField>
              <FormField label="Quantity">
                <input type="text" value={form.quantity} onChange={e => set('quantity', e.target.value)} className={inputClass} placeholder="e.g. 6.2 quarts" />
              </FormField>
              <FormField label="Fluid Type">
                <input type="text" value={form.fluidType} onChange={e => set('fluidType', e.target.value)} className={inputClass} placeholder="e.g. 0W-20" />
              </FormField>
              <div className="col-span-2">
                <FormField label="Spec / Torque">
                  <input type="text" value={form.spec} onChange={e => set('spec', e.target.value)} className={inputClass} placeholder="e.g. 14mm socket, 30 lb-ft torque" />
                </FormField>
              </div>
              <div className="col-span-2">
                <FormField label="Notes">
                  <textarea
                    value={form.notes}
                    onChange={e => set('notes', e.target.value)}
                    rows={3}
                    className={`${inputClass} resize-none`}
                    placeholder="Any additional notes..."
                  />
                </FormField>
              </div>
            </div>
          </div>

          {/* Log Service */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Plus size={12} /> Log New Service
            </h3>
            <div className="bg-[#0a1628] border border-[#1e293b] rounded-xl p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Mileage" icon={Gauge}>
                  <input
                    type="number"
                    value={logForm.mileage}
                    onChange={e => setLogForm(f => ({ ...f, mileage: e.target.value }))}
                    className={inputClass}
                    placeholder="Current miles"
                  />
                </FormField>
                <FormField label="Date" icon={Calendar}>
                  <input
                    type="date"
                    value={logForm.date}
                    onChange={e => setLogForm(f => ({ ...f, date: e.target.value }))}
                    className={inputClass}
                  />
                </FormField>
              </div>
              <FormField label="Notes (optional)">
                <input
                  type="text"
                  value={logForm.notes}
                  onChange={e => setLogForm(f => ({ ...f, notes: e.target.value }))}
                  className={inputClass}
                  placeholder="e.g. Used Mobil 1 0W-20"
                />
              </FormField>
              <button
                onClick={handleLogService}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Plus size={16} /> Log Service & Update Mileage
              </button>
            </div>
          </div>

          {/* Service History */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Calendar size={12} /> Service History ({history.length})
            </h3>
            {history.length === 0 ? (
              <div className="text-center py-6 text-gray-600 text-sm bg-[#0a1628] border border-[#1e293b] rounded-xl">
                No service history recorded yet.
              </div>
            ) : (
              <div className="space-y-2">
                {[...history].reverse().map((entry, i) => (
                  <div key={i} className="flex items-start gap-3 bg-[#0a1628] border border-[#1e293b] rounded-xl px-4 py-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-white text-sm font-semibold">{Number(entry.mileage).toLocaleString()} mi</span>
                        <span className="text-gray-500 text-xs">{entry.date}</span>
                      </div>
                      {entry.notes && <p className="text-gray-400 text-xs mt-0.5">{entry.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-[#1e293b] bg-[#0a1628] rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#1a2744] hover:bg-[#1e2f55] border border-[#2d3f5e] text-gray-300 hover:text-white font-medium rounded-lg transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors text-sm"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
