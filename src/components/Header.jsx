import React, { useState, useRef, useEffect } from 'react';
import { Car, Plus, ChevronDown, Trash2 } from 'lucide-react';

export default function Header({ vehicles, activeVehicleId, onSelectVehicle, onAddVehicle, onDeleteVehicle }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const activeVehicle = vehicles.find(v => v.id === activeVehicleId);

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#070d1b]/90 backdrop-blur-md border-b border-[#1e293b] h-16">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <Car size={17} className="text-white" />
          </div>
          <span className="font-display text-lg font-bold text-white tracking-tight hidden sm:block">GarageBot</span>
        </div>

        {/* Vehicle selector */}
        {vehicles.length > 0 && (
          <div className="flex-1 flex justify-center" ref={dropdownRef}>
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(o => !o)}
                className="flex items-center gap-2 bg-[#0f172a] hover:bg-[#1a2744] border border-[#1e293b] hover:border-[#2d3f5e] rounded-lg px-3 py-1.5 text-sm font-medium text-white transition-colors"
              >
                <div className="w-5 h-5 bg-orange-500/20 rounded flex items-center justify-center">
                  <Car size={11} className="text-orange-400" />
                </div>
                <span className="max-w-[180px] truncate">
                  {activeVehicle?.nickname || (activeVehicle ? `${activeVehicle.modelYear} ${activeVehicle.make} ${activeVehicle.model}` : 'Select Vehicle')}
                </span>
                {vehicles.length > 1 && <ChevronDown size={14} className={`text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />}
              </button>

              {dropdownOpen && vehicles.length > 0 && (
                <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 w-64 bg-[#0f172a] border border-[#1e293b] rounded-xl shadow-xl overflow-hidden z-50">
                  <div className="p-1">
                    {vehicles.map(v => (
                      <div
                        key={v.id}
                        className={`flex items-center justify-between group rounded-lg px-3 py-2 cursor-pointer transition-colors ${v.id === activeVehicleId ? 'bg-orange-500/10' : 'hover:bg-[#1a2744]'}`}
                        onClick={() => { onSelectVehicle(v.id); setDropdownOpen(false); }}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Car size={14} className={v.id === activeVehicleId ? 'text-orange-400' : 'text-gray-500'} />
                          <div className="min-w-0">
                            <p className={`text-sm font-medium truncate ${v.id === activeVehicleId ? 'text-orange-400' : 'text-white'}`}>
                              {v.nickname || `${v.modelYear} ${v.make} ${v.model}`}
                            </p>
                            <p className="text-xs text-gray-500 truncate font-mono">{v.vin}</p>
                          </div>
                        </div>
                        {vehicles.length > 1 && (
                          <button
                            onClick={e => { e.stopPropagation(); onDeleteVehicle(v.id); setDropdownOpen(false); }}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-all ml-2 shrink-0"
                            title="Remove vehicle"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add Vehicle button */}
        <button
          onClick={onAddVehicle}
          className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-3 py-1.5 rounded-lg transition-colors shrink-0"
        >
          <Plus size={16} />
          <span className="hidden sm:block">Add Vehicle</span>
        </button>
      </div>
    </header>
  );
}
