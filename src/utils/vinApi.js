const BASE = 'https://vpic.nhtsa.dot.gov/api/vehicles/decodevinextended';

export async function decodeVin(vin, year) {
  const res = await fetch(`${BASE}/${vin}?format=json&modelyear=${year}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  if (!data.Results?.length) throw new Error('No results for this VIN');

  const get = (variable) => data.Results.find(r => r.Variable === variable)?.Value || '';

  const make = get('Make');
  const model = get('Model');
  if (!make || !model) throw new Error('Could not decode VIN — please verify it is correct');

  return {
    make, model,
    series: get('Series'),
    series2: get('Series 2'),
    trim: get('Trim'),
    driveType: get('Drive Type'),
    engineModel: get('Engine Model'),
    displacement: get('Displacement (L)'),
    engineHp: get('Engine Brake (hp) From'),
    gvwr: get('GVWR From'),
    bodyClass: get('Body Class'),
    modelYear: get('Model Year') || year,
    cylinders: get('Number of Cylinders'),
    fuelType: get('Fuel Type - Primary'),
  };
}
