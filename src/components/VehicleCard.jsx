import React, { useState } from 'react';
import { Car, Gauge, Pencil, Check, X, Hash, Package } from 'lucide-react';

function EditableField({ label, value, onSave, icon: Icon, placeholder, type = 'text', prefix = '', suffix = '' }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');

  const startEdit = () => {
    setDraft(value || '');
    setEditing(true);
  };

  const save = () => {
    onSave(draft);
    setEditing(false);
  };

  const cancel = () => setEditing(false);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') save();
    if (e.key === 'Escape') cancel();
  };

  return (
    <div className="bg-[#0a1628] border border-[#1e293b] rounded-xl p-4 hover:border-[#2d3f5e] transition-colors group">
      <div className="flex items-center gap-1.5 mb-2">
        {Icon && <Icon size={13} className="text-orange-400" />}
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</span>
      </div>
      {editing ? (
        <div className="flex items-center gap-2">
          <input
            type={type}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={save}
            onKeyDown={handleKeyDown}
            autoFocus
            className="flex-1 bg-[#1a2744] border border-orange-500 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 min-w-0"
            placeholder={placeholder}
          />
          <button onClick={save} className="p-1.5 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded-lg transition-colors shrink-0">
            <Check size={14} />
          </button>
          <button onClick={cancel} className="p-1.5 bg-gray-500/10 hover:bg-gray-500/20 text-gray-400 rounded-lg transition-colors shrink-0">
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-2">
          <span className={`text-base font-semibold ${value ? 'text-white' : 'text-gray-600'}`}>
            {value ? `${prefix}${type === 'number' ? Number(value).toLocaleString() : value}${suffix}` : placeholder}
          </span>
          <button
            onClick={startEdit}
            className="opacity-0 group-hover:opacity-100 p-1.5 bg-[#1a2744] hover:bg-[#1e2f55] text-gray-400 hover:text-orange-400 rounded-lg transition-all shrink-0"
          >
            <Pencil size={13} />
          </button>
        </div>
      )}
    </div>
  );
}

export default function VehicleCard({ vehicle, onUpdate }) {
  const specs = [
    { label: 'GVWR', value: vehicle.gvwr },
    { label: 'Body', value: vehicle.bodyClass },
    { label: vehicle.cylinders ? `${vehicle.cylinders}-Cyl` : null, value: vehicle.displacement ? `${vehicle.displacement}L` : null },
    { label: 'Fuel', value: vehicle.fuelType },
    { label: 'Drive', value: vehicle.driveType },
  ].filter(s => s.label && s.value);

  return (
    <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-5 mb-4">
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Left: Vehicle identity */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center justify-center shrink-0">
              <Car size={20} className="text-orange-400" />
            </div>
            <div className="min-w-0">
              <h2 className="font-display text-2xl font-bold text-white leading-tight">
                {vehicle.modelYear} {vehicle.make} {vehicle.model}
              </h2>
              {vehicle.trim && (
                <p className="text-orange-400 font-medium text-sm">{vehicle.trim}{vehicle.series ? ` · ${vehicle.series}` : ''}</p>
              )}
            </div>
          </div>

          {/* VIN & specs */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <div className="flex items-center gap-1.5 bg-[#1a2744] border border-[#2d3f5e] rounded-lg px-2.5 py-1">
              <Hash size={12} className="text-gray-500" />
              <span className="text-gray-400 text-xs font-mono">{vehicle.vin}</span>
            </div>
          </div>

          {/* Spec chips */}
          {specs.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {specs.map((s, i) => (
                <span key={i} className="inline-flex items-center gap-1 bg-[#1a2744] border border-[#2d3f5e] rounded-full px-2.5 py-0.5 text-xs text-gray-300">
                  <span className="text-gray-500">{s.label}:</span>
                  <span>{s.value}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right: Editable fields */}
        <div className="lg:w-80 xl:w-96 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
          <EditableField
            label="Current Mileage"
            value={vehicle.currentMileage}
            onSave={val => onUpdate({ currentMileage: parseInt(val, 10) || 0 })}
            icon={Gauge}
            placeholder="Enter mileage"
            type="number"
            suffix=" mi"
          />
          <EditableField
            label="Gross Weight"
            value={vehicle.grossWeight}
            onSave={val => onUpdate({ grossWeight: val })}
            icon={Package}
            placeholder="Enter weight"
            suffix={vehicle.grossWeight ? ' lbs' : ''}
          />
          <EditableField
            label="License Plate"
            value={vehicle.licensePlate}
            onSave={val => onUpdate({ licensePlate: val })}
            icon={Hash}
            placeholder="Enter plate"
          />
        </div>
      </div>
    </div>
  );
}
