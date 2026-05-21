import React, { useState } from 'react';
import { loadState, addVehicle as addVehicleToState, updateVehicle, updateMaintenanceItem, setActiveVehicle, deleteVehicle } from './utils/storage';
import VehicleEntry from './components/VehicleEntry';
import Dashboard from './components/Dashboard';

export default function App() {
  const [state, setState] = useState(() => loadState());
  const [showAddVehicle, setShowAddVehicle] = useState(false);

  const hasVehicles = state.vehicles.length > 0 && !showAddVehicle;

  const handleVehicleAdded = (vehicle) => {
    const newState = addVehicleToState(state, vehicle);
    setState(newState);
    setShowAddVehicle(false);
  };

  const handleVehicleUpdate = (vehicleId, updates) => {
    setState(prev => updateVehicle(prev, vehicleId, updates));
  };

  const handleMaintenanceUpdate = (vehicleId, category, itemId, updates) => {
    setState(prev => updateMaintenanceItem(prev, vehicleId, category, itemId, updates));
  };

  const handleSelectVehicle = (vehicleId) => {
    setState(prev => setActiveVehicle(prev, vehicleId));
  };

  const handleDeleteVehicle = (vehicleId) => {
    const newState = deleteVehicle(state, vehicleId);
    setState(newState);
    if (newState.vehicles.length === 0) setShowAddVehicle(false);
  };

  if (!hasVehicles) {
    return <VehicleEntry onVehicleAdded={handleVehicleAdded} />;
  }

  return (
    <Dashboard
      state={state}
      onVehicleUpdate={handleVehicleUpdate}
      onMaintenanceUpdate={handleMaintenanceUpdate}
      onAddVehicle={() => setShowAddVehicle(true)}
      onSelectVehicle={handleSelectVehicle}
      onDeleteVehicle={handleDeleteVehicle}
    />
  );
}
