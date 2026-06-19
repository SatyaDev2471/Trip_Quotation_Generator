const ORS_BASE_URL = 'https://api.openrouteservice.org';

const getApiKey = () => {
  const rawKey = import.meta.env.VITE_ORS_API_KEY;
  if (!rawKey) return '';
  const normalizedKey = rawKey.toString().trim().replace(/^['"]|['"]$/g, '');
  return normalizedKey;
};

const requireApiKey = () => {
  const apiKey = getApiKey();
  if (!apiKey || apiKey === 'YOUR_OPENROUTESERVICE_API_KEY') {
    throw new Error('OpenRouteService API key is not configured. Set VITE_ORS_API_KEY in your .env file.');
  }
  return apiKey;
};

const parseLocation = async (location, signal) => {
  if (!location) {
    throw new Error('Location cannot be empty.');
  }

  if (typeof location === 'object' && location.lat != null && location.lng != null) {
    return location;
  }

  return geocodeAddress(location, signal);
};

const geocodeAddress = async (address, signal) => {
  const apiKey = requireApiKey();

  const url = new URL(`${ORS_BASE_URL}/geocode/search`);
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('text', address);
  url.searchParams.set('size', '1');

  const response = await fetch(url.toString(), {
    method: 'GET',
    signal
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenRouteService geocoding failed: ${response.status} ${response.statusText} - ${errorBody}`);
  }

  const data = await response.json();
  const feature = data.features?.[0];
  if (!feature || !feature.geometry?.coordinates?.length) {
    throw new Error(`Unable to geocode address: ${address}`);
  }

  const [lng, lat] = feature.geometry.coordinates;
  return { lat, lng, label: feature.properties?.label || address };
};

export const searchLocations = async (query, signal) => {
  const apiKey = requireApiKey();

  if (!query || !query.trim()) {
    return [];
  }

  const url = new URL(`${ORS_BASE_URL}/geocode/autocomplete`);
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('text', query);
  url.searchParams.set('size', '5');

  const response = await fetch(url.toString(), {
    method: 'GET',
    signal
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenRouteService autocomplete failed: ${response.status} ${response.statusText} - ${errorBody}`);
  }

  const data = await response.json();
  return data.features?.map((feature) => {
    const [lng, lat] = feature.geometry.coordinates;
    return {
      label: feature.properties?.label || feature.properties?.name || '',
      lat,
      lng
    };
  }) || [];
};

export const getRouteDistance = async (pickupLocation, dropLocation, signal) => {
  requireApiKey();

  const pickup = await parseLocation(pickupLocation, signal);
  const drop = await parseLocation(dropLocation, signal);

  const apiKey = requireApiKey();
  const response = await fetch(`${ORS_BASE_URL}/v2/directions/driving-car`, {
    method: 'POST',
    headers: {
      'Authorization': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      coordinates: [
        [pickup.lng, pickup.lat],
        [drop.lng, drop.lat]
      ]
    }),
    signal
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenRouteService route request failed: ${response.status} ${response.statusText} - ${errorBody}`);
  }

  const routeData = await response.json();
  const route = routeData.routes?.[0];
  const segment = route?.segments?.[0];
  const distance = typeof segment?.distance === 'number'
    ? segment.distance
    : route?.summary?.distance;
  const duration = typeof segment?.duration === 'number'
    ? segment.duration
    : route?.summary?.duration;

  if (typeof distance !== 'number' || typeof duration !== 'number') {
    throw new Error('OpenRouteService returned an invalid route response.');
  }

  return {
    distanceKm: Math.max(1, Math.round(distance / 1000)),
    durationMinutes: Math.max(1, Math.round(duration / 60)),
    pickup,
    drop
  };
};
