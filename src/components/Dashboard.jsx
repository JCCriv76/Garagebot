import React from 'react';
import Header from './Header';
import VehicleCard from './VehicleCard';
import MaintenanceTabs from './MaintenanceTabs';

export default function Dashboard({ state, onVehicleUpdate, onMaintenanceUpdate, onAddVehicle, onSelectVehicle, onDeleteVehicle }) {
  const activeVehicle = state.vehicles.find(v => v.id === state.activeVehicleId) || state.vehicles[0];

  if (!activeVehicle) return null;

  const handleVehicleUpdate = (updates) => {
    onVehicleUpdate(activeVehicle.id, updates);
  };

  const handleMaintenanceUpdate = (category, itemId, updates) => {
    onMaintenanceUpdate(activeVehicle.id, category, itemId, updates);
  };

  return (
    <div className="min-h-screen bg-[#070d1b]">
      <Header
        vehicles={state.vehicles}
        activeVehicleId={state.activeVehicleId}
        onSelectVehicle={onSelectVehicle}
        onAddVehicle={onAddVehicle}
        onDeleteVehicle={onDeleteVehicle}
      />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <VehicleCard
          vehicle={activeVehicle}
          onUpdate={handleVehicleUpdate}
        />
        <MaintenanceTabs
          vehicle={activeVehicle}
          onMaintenanceUpdate={handleMaintenanceUpdate}
        />
      </main>
    </div>
  );
}
