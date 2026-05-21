import React, { useState } from 'react';
import { CircleDot, Flame, Settings2 } from 'lucide-react';
import MaintenanceTable from './MaintenanceTable';
import { getStatus } from '../utils/statusHelper';

const TABS = [
  {
    key: 'brakesAndTires',
    label: 'Brakes & Tires',
    Icon: CircleDot,
  },
  {
    key: 'engineAndCooling',
    label: 'Engine & Cooling',
    Icon: Flame,
  },
  {
    key: 'transmissionAndDrivetrain',
    label: 'Transmission & Drivetrain',
    Icon: Settings2,
  },
];

function getBadgeCount(items, currentMileage) {
  const overdue = items.filter(i => getStatus(i, currentMileage) === 'overdue').length;
  const dueSoon = items.filter(i => getStatus(i, currentMileage) === 'due-soon').length;
  const total = overdue + dueSoon;
  return { overdue, dueSoon, total };
}

export default function MaintenanceTabs({ vehicle, onMaintenanceUpdate }) {
  const [activeTab, setActiveTab] = useState('brakesAndTires');
  const currentMileage = vehicle.currentMileage;

  const handleUpdate = (itemId, updates) => {
    onMaintenanceUpdate(activeTab, itemId, updates);
  };

  return (
    <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-[#1e293b] overflow-x-auto">
        {TABS.map(({ key, label, Icon }) => {
          const items = vehicle.maintenance?.[key] || [];
          const { overdue, dueSoon, total } = getBadgeCount(items, currentMileage);
          const isActive = activeTab === key;

          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium whitespace-nowrap transition-colors relative border-b-2 -mb-px ${
                isActive
                  ? 'text-orange-400 border-orange-500 bg-orange-500/5'
                  : 'text-gray-400 border-transparent hover:text-gray-200 hover:border-gray-600'
              }`}
            >
              <Icon size={15} className={isActive ? 'text-orange-400' : 'text-gray-500'} />
              <span className="hidden sm:block">{label}</span>
              <span className="sm:hidden">{label.split(' ')[0]}</span>
              {total > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold min-w-[18px] text-center leading-none ${
                  overdue > 0 ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {total}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="p-4">
        {TABS.map(({ key }) => (
          activeTab === key && (
            <MaintenanceTable
              key={key}
              items={vehicle.maintenance?.[key] || []}
              category={key}
              currentMileage={currentMileage}
              onUpdate={handleUpdate}
            />
          )
        ))}
      </div>
    </div>
  );
}
