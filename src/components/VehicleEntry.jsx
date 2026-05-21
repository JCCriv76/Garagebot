import React, { useState } from 'react';
import { Car, Wrench, Search, Loader2, ArrowRight, AlertCircle, Gauge } from 'lucide-react';
import { decodeVin } from '../utils/vinApi';
import { defaultMaintenanceData } from '../data/maintenanceData';

export default function VehicleEntry({ onVehicleAdded }) {
  const [step, setStep] = useState(1);
  const [vin, setVin] = useState('');
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [decoded, setDecoded] = useState(null);
  const [mileage, setMileage] = useState('');
  const [nickname, setNickname] = useState('');

  const handleDecode = async (e) => {
    e.preventDefault();
    if (!vin.trim()) { setError('Please enter a VIN number.'); return; }
    if (!year.trim()) { setError('Please enter a model year.'); return; }
    if (vin.trim().length !== 17) { setError('VIN must be exactly 17 characters.'); return; }
    const yearNum = parseInt(year, 10);
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear() + 2) {
      setError('Please enter a valid model year.'); return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await decodeVin(vin.trim().toUpperCase(), year.trim());
      setDecoded(data);
      setStep(2);
    } catch (err) {
      setError(err.message || 'Failed to decode VIN. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicle = (e) => {
    e.preventDefault();
    const miles = parseInt(mileage, 10);
    if (isNaN(miles) || miles < 0) { setError('Please enter a valid mileage.'); return; }
    const vehicle = {
      id: crypto.randomUUID(),
      vin: vin.trim().toUpperCase(),
      nickname: nickname.trim() || `${decoded.modelYear} ${decoded.make} ${decoded.model}`,
      currentMileage: miles,
      grossWeight: '',
      licensePlate: '',
      ...decoded,
      maintenance: {
        brakesAndTires: defaultMaintenanceData.brakesAndTires.map(item => ({ ...item, history: [] })),
        engineAndCooling: defaultMaintenanceData.engineAndCooling.map(item => ({ ...item, history: [] })),
        transmissionAndDrivetrain: defaultMaintenanceData.transmissionAndDrivetrain.map(item => ({ ...item, history: [] })),
      },
    };
    onVehicleAdded(vehicle);
  };

  const DetailRow = ({ label, value }) => {
    if (!value) return null;
    return (
      <div className="flex justify-between items-center py-2 border-b border-[#1e293b] last:border-0">
        <span className="text-sm text-gray-400">{label}</span>
        <span className="text-sm text-white font-medium text-right max-w-[55%]">{value}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#070d1b] flex flex-col items-center justify-center p-4">
      {/* Brand */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
            <Car size={22} className="text-white" />
          </div>
          <span className="font-display text-3xl font-bold text-white tracking-tight">GarageBot</span>
        </div>
        <p className="text-gray-400 text-sm">Your smart vehicle maintenance tracker</p>
      </div>

      <div className="w-full max-w-lg fade-in">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className={`flex items-center gap-2 text-sm font-medium transition-colors ${step >= 1 ? 'text-orange-400' : 'text-gray-500'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${step >= 1 ? 'bg-orange-500 border-orange-500 text-white' : 'border-gray-600 text-gray-500'}`}>1</div>
            Decode VIN
          </div>
          <div className={`h-px w-8 transition-colors ${step >= 2 ? 'bg-orange-500' : 'bg-gray-700'}`} />
          <div className={`flex items-center gap-2 text-sm font-medium transition-colors ${step >= 2 ? 'text-orange-400' : 'text-gray-500'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${step >= 2 ? 'bg-orange-500 border-orange-500 text-white' : 'border-gray-600 text-gray-500'}`}>2</div>
            Add to Garage
          </div>
        </div>

        <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-6">
          {step === 1 && (
            <>
              <div className="mb-6">
                <h2 className="font-display text-xl font-semibold text-white mb-1">Decode Your VIN</h2>
                <p className="text-gray-400 text-sm">Enter your 17-character VIN to automatically populate vehicle details.</p>
              </div>
              <form onSubmit={handleDecode} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">VIN Number</label>
                  <input
                    type="text"
                    value={vin}
                    onChange={e => setVin(e.target.value.toUpperCase())}
                    placeholder="e.g. 1NXBR32E07Z123456"
                    maxLength={17}
                    className="w-full bg-[#1a2744] border border-[#2d3f5e] rounded-lg px-4 py-3 text-white placeholder-gray-500 font-mono text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors uppercase"
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500 mt-1">{vin.length}/17 characters</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Model Year</label>
                  <input
                    type="number"
                    value={year}
                    onChange={e => setYear(e.target.value)}
                    placeholder="e.g. 2007"
                    min="1900"
                    max={new Date().getFullYear() + 2}
                    className="w-full bg-[#1a2744] border border-[#2d3f5e] rounded-lg px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                    disabled={loading}
                  />
                </div>
                {error && (
                  <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><Loader2 size={18} className="animate-spin" /> Decoding VIN...</>
                  ) : (
                    <><Search size={18} /> Decode VIN</>
                  )}
                </button>
              </form>
            </>
          )}

          {step === 2 && decoded && (
            <>
              <div className="mb-5">
                <h2 className="font-display text-xl font-semibold text-white mb-1">Vehicle Confirmed</h2>
                <p className="text-gray-400 text-sm">Review the details below and enter your current mileage.</p>
              </div>

              {/* Vehicle header */}
              <div className="bg-[#1a2744] border border-[#2d3f5e] rounded-xl p-4 mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-orange-500/10 border border-orange-500/20 rounded-lg flex items-center justify-center shrink-0">
                    <Car size={18} className="text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-white">{decoded.modelYear} {decoded.make} {decoded.model}</h3>
                    {decoded.trim && <p className="text-orange-400 text-sm font-medium">{decoded.trim}</p>}
                    <p className="text-gray-500 text-xs font-mono mt-0.5">{vin}</p>
                  </div>
                </div>
              </div>

              {/* Decoded details */}
              <div className="bg-[#0a1628] border border-[#1e293b] rounded-xl p-4 mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Decoded Details</p>
                <DetailRow label="Series" value={decoded.series} />
                <DetailRow label="Drive Type" value={decoded.driveType} />
                <DetailRow label="Engine" value={decoded.engineModel} />
                <DetailRow label="Displacement" value={decoded.displacement ? `${decoded.displacement}L` : ''} />
                <DetailRow label="Horsepower" value={decoded.engineHp ? `${decoded.engineHp} hp` : ''} />
                <DetailRow label="Body Class" value={decoded.bodyClass} />
                <DetailRow label="Cylinders" value={decoded.cylinders} />
                <DetailRow label="Fuel Type" value={decoded.fuelType} />
                <DetailRow label="GVWR" value={decoded.gvwr} />
              </div>

              {/* Add form */}
              <form onSubmit={handleAddVehicle} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    <span className="flex items-center gap-1.5"><Gauge size={14} /> Current Mileage <span className="text-red-400">*</span></span>
                  </label>
                  <input
                    type="number"
                    value={mileage}
                    onChange={e => setMileage(e.target.value)}
                    placeholder="e.g. 63500"
                    min="0"
                    className="w-full bg-[#1a2744] border border-[#2d3f5e] rounded-lg px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Nickname (optional)</label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={e => setNickname(e.target.value)}
                    placeholder={`e.g. My ${decoded.make} ${decoded.model}`}
                    className="w-full bg-[#1a2744] border border-[#2d3f5e] rounded-lg px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                  />
                </div>
                {error && (
                  <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => { setStep(1); setError(''); setDecoded(null); }}
                    className="flex-1 bg-[#1a2744] hover:bg-[#1e2f55] border border-[#2d3f5e] text-gray-300 font-medium py-3 px-4 rounded-lg transition-colors text-sm"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Wrench size={16} /> Add to Garage <ArrowRight size={16} />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          Vehicle data decoded via NHTSA vPIC API
        </p>
      </div>
    </div>
  );
}
