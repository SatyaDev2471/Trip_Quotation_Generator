import React, { useEffect, useRef, useState } from 'react';
import { FiMapPin, FiCalendar, FiNavigation, FiClock } from 'react-icons/fi';
import { getRouteDistance, searchLocations } from '../utils/openRouteService';

/**
 * TripInfo component for acquiring route, date parameters, distance, and duration.
 */
export default function TripInfo({ trip, setTrip, errors }) {
  const [locationError, setLocationError] = useState('');
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropSuggestions, setDropSuggestions] = useState([]);
  const [activeInput, setActiveInput] = useState('');
  const routeControllerRef = useRef(null);
  const routeDelayRef = useRef(null);
  const searchControllerRef = useRef({ pickup: null, drop: null });
  const blurTimerRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrip(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'pickupLocation' ? { pickupLocationCoords: null } : {}),
      ...(name === 'dropLocation' ? { dropLocationCoords: null } : {})
    }));

    if (name === 'pickupLocation') {
      setPickupSuggestions([]);
    }
    if (name === 'dropLocation') {
      setDropSuggestions([]);
    }
  };

  const handleSelectSuggestion = (location, fieldName) => {
    const coordsKey = fieldName === 'pickupLocation' ? 'pickupLocationCoords' : 'dropLocationCoords';
    setTrip(prev => ({
      ...prev,
      [fieldName]: location.label,
      [coordsKey]: { lat: location.lat, lng: location.lng }
    }));
    setPickupSuggestions([]);
    setDropSuggestions([]);
    setActiveInput('');
    setLocationError('');
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const fetchSuggestions = async (fieldName, value) => {
    const trimmed = value.trim();
    const key = fieldName === 'pickupLocation' ? 'pickup' : 'drop';
    searchControllerRef.current[key]?.abort();
    if (trimmed.length < 3) {
      if (fieldName === 'pickupLocation') setPickupSuggestions([]);
      else setDropSuggestions([]);
      return;
    }

    const controller = new AbortController();
    searchControllerRef.current[key] = controller;

    try {
      const results = await searchLocations(trimmed, controller.signal);
      if (fieldName === 'pickupLocation') setPickupSuggestions(results);
      else setDropSuggestions(results);
    } catch (err) {
      if (err.name === 'AbortError') return;
      setLocationError(err.message || 'Failed to load location suggestions.');
    }
  };

  useEffect(() => {
    fetchSuggestions('pickupLocation', trip.pickupLocation);
  }, [trip.pickupLocation]);

  useEffect(() => {
    fetchSuggestions('dropLocation', trip.dropLocation);
  }, [trip.dropLocation]);

  useEffect(() => {
    if (!trip.pickupLocation || !trip.dropLocation) {
      return;
    }

    if (trip.pickupLocation.trim().length < 3 || trip.dropLocation.trim().length < 3) {
      return;
    }

    window.clearTimeout(routeDelayRef.current);
    routeDelayRef.current = window.setTimeout(() => {
      routeControllerRef.current?.abort();
      routeControllerRef.current = new AbortController();

      const fetchRoute = async () => {
        try {
          const routeData = await getRouteDistance(
            trip.pickupLocationCoords || trip.pickupLocation,
            trip.dropLocationCoords || trip.dropLocation,
            routeControllerRef.current.signal
          );

          setTrip(prev => ({
            ...prev,
            distance: routeData.distanceKm.toString(),
            pickupLocationCoords: routeData.pickup,
            dropLocationCoords: routeData.drop
          }));
          setLocationError('');
        } catch (err) {
          if (err.name === 'AbortError') return;
          setLocationError(err.message || 'Unable to calculate route distance.');
        }
      };

      fetchRoute();
    }, 700);

    return () => {
      window.clearTimeout(routeDelayRef.current);
      routeControllerRef.current?.abort();
    };
  }, [trip.pickupLocation, trip.dropLocation]);

  useEffect(() => {
    if (!trip.tripDate || !trip.returnDate) {
      return;
    }

    const startDate = new Date(trip.tripDate);
    const endDate = new Date(trip.returnDate);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      return;
    }

    const diffMs = endDate.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      setLocationError('Return date must be the same or after the start date.');
      return;
    }

    setTrip(prev => ({
      ...prev,
      duration: diffDays.toString()
    }));
    setLocationError('');
  }, [trip.tripDate, trip.returnDate]);

  useEffect(() => {
    return () => {
      window.clearTimeout(blurTimerRef.current);
    };
  }, []);

  const handleInputFocus = (fieldName) => {
    window.clearTimeout(blurTimerRef.current);
    setActiveInput(fieldName);
  };

  const handleInputBlur = () => {
    blurTimerRef.current = window.setTimeout(() => {
      setActiveInput('');
    }, 150);
  };

  return (
    <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-indigo-50 text-secondary rounded-xl">
          <FiNavigation className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800">Trip Information</h2>
          <p className="text-xs text-slate-500">Specify locations, dates, distance, and duration</p>
        </div>
      </div>

      {locationError && (
        <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {locationError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pickup Location */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider flex items-center">
            Pickup Location <span className="text-rose-500 ml-1">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-500">
              <FiMapPin className="w-4 h-4" />
            </div>
            <input
              type="text"
              name="pickupLocation"
              value={trip.pickupLocation}
              onChange={handleChange}
              onFocus={() => handleInputFocus('pickupLocation')}
              onBlur={handleInputBlur}
              placeholder="e.g. Indira Gandhi Int'l Airport (DEL)"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-slate-50/50 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.pickupLocation
                  ? 'border-rose-400 focus:ring-rose-100 focus:border-rose-500'
                  : 'border-slate-200 focus:ring-indigo-100 focus:border-secondary'
              }`}
            />
            {activeInput === 'pickupLocation' && pickupSuggestions.length > 0 && (
              <div className="absolute z-20 mt-1 max-h-52 w-full overflow-auto rounded-2xl border border-slate-200 bg-white shadow-lg">
                {pickupSuggestions.map((suggestion, index) => (
                  <button
                    key={`${suggestion.label}-${index}`}
                    type="button"
                    onMouseDown={(event) => {
                      event.preventDefault();
                      handleSelectSuggestion(suggestion, 'pickupLocation');
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-slate-800 hover:bg-slate-100"
                  >
                    {suggestion.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          {errors.pickupLocation && (
            <p className="mt-1 text-xs font-medium text-rose-500">{errors.pickupLocation}</p>
          )}
        </div>

        {/* Drop Location */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider flex items-center">
            Drop Location <span className="text-rose-500 ml-1">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-rose-500">
              <FiMapPin className="w-4 h-4" />
            </div>
            <input
              type="text"
              name="dropLocation"
              value={trip.dropLocation}
              onChange={handleChange}
              onFocus={() => handleInputFocus('dropLocation')}
              onBlur={handleInputBlur}
              placeholder="e.g. Taj Mahal, Agra"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-slate-50/50 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.dropLocation
                  ? 'border-rose-400 focus:ring-rose-100 focus:border-rose-500'
                  : 'border-slate-200 focus:ring-indigo-100 focus:border-secondary'
              }`}
            />
            {activeInput === 'dropLocation' && dropSuggestions.length > 0 && (
              <div className="absolute z-20 mt-1 max-h-52 w-full overflow-auto rounded-2xl border border-slate-200 bg-white shadow-lg">
                {dropSuggestions.map((suggestion, index) => (
                  <button
                    key={`${suggestion.label}-${index}`}
                    type="button"
                    onMouseDown={(event) => {
                      event.preventDefault();
                      handleSelectSuggestion(suggestion, 'dropLocation');
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-slate-800 hover:bg-slate-100"
                  >
                    {suggestion.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          {errors.dropLocation && (
            <p className="mt-1 text-xs font-medium text-rose-500">{errors.dropLocation}</p>
          )}
        </div>

        {/* Trip Date */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider flex items-center">
            Start Date <span className="text-rose-500 ml-1">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <FiCalendar className="w-4 h-4" />
            </div>
            <input
              type="date"
              name="tripDate"
              value={trip.tripDate}
              onChange={handleChange}
              min={getTodayDate()}
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-slate-50/50 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.tripDate
                  ? 'border-rose-400 focus:ring-rose-100 focus:border-rose-500'
                  : 'border-slate-200 focus:ring-indigo-100 focus:border-secondary'
              }`}
            />
          </div>
          {errors.tripDate && (
            <p className="mt-1 text-xs font-medium text-rose-500">{errors.tripDate}</p>
          )}
        </div>

        {/* Return Date */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
            Return Date <span className="text-slate-400 text-[10px] font-normal lowercase">(optional for one-way)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <FiCalendar className="w-4 h-4" />
            </div>
            <input
              type="date"
              name="returnDate"
              value={trip.returnDate}
              onChange={handleChange}
              min={trip.tripDate || getTodayDate()}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-secondary transition-all"
            />
          </div>
        </div>

        {/* Distance in KM */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider flex items-center">
            Distance (KM) <span className="text-rose-500 ml-1">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <FiNavigation className="w-4 h-4" />
            </div>
            <input
              type="number"
              min="1"
              name="distance"
              value={trip.distance}
              onChange={handleChange}
              placeholder="e.g. 250"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-slate-50/50 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.distance
                  ? 'border-rose-400 focus:ring-rose-100 focus:border-rose-500'
                  : 'border-slate-200 focus:ring-indigo-100 focus:border-secondary'
              }`}
            />
          </div>
          {errors.distance && (
            <p className="mt-1 text-xs font-medium text-rose-500">{errors.distance}</p>
          )}
        </div>

        {/* Rental Duration in Days */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider flex items-center">
            Rental Duration (Days) <span className="text-rose-500 ml-1">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <FiClock className="w-4 h-4" />
            </div>
            <input
              type="number"
              min="1"
              name="duration"
              value={trip.duration}
              onChange={handleChange}
              placeholder="e.g. 3"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-slate-50/50 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.duration
                  ? 'border-rose-400 focus:ring-rose-100 focus:border-rose-500'
                  : 'border-slate-200 focus:ring-indigo-100 focus:border-secondary'
              }`}
            />
          </div>
          {errors.duration && (
            <p className="mt-1 text-xs font-medium text-rose-500">{errors.duration}</p>
          )}
        </div>
      </div>
    </div>
  );
}
