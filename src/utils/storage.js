const KEY = 'garagebot_v1';
const defaults = { vehicles: [], activeVehicleId: null };

export function loadState() {
  try { return JSON.parse(localStorage.getItem(KEY)) || defaults; }
  catch { return defaults; }
}

function save(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch(e) {}
  return state;
}

export function addVehicle(state, vehicle) {
  return save({ ...state, vehicles: [...state.vehicles, vehicle], activeVehicleId: vehicle.id });
}

export function updateVehicle(state, id, updates) {
  return save({ ...state, vehicles: state.vehicles.map(v => v.id === id ? { ...v, ...updates } : v) });
}

export function updateMaintenanceItem(state, vehicleId, category, itemId, updates) {
  return save({
    ...state,
    vehicles: state.vehicles.map(v => {
      if (v.id !== vehicleId) return v;
      return {
        ...v,
        maintenance: {
          ...v.maintenance,
          [category]: v.maintenance[category].map(item =>
            item.id === itemId ? { ...item, ...updates } : item
          ),
        },
      };
    }),
  });
}

export function setActiveVehicle(state, id) {
  return save({ ...state, activeVehicleId: id });
}

export function deleteVehicle(state, id) {
  const vehicles = state.vehicles.filter(v => v.id !== id);
  const activeVehicleId = state.activeVehicleId === id ? (vehicles[0]?.id || null) : state.activeVehicleId;
  return save({ vehicles, activeVehicleId });
}
