import React from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import { IoCarOutline, IoBusOutline } from 'react-icons/io5';

export const VEHICLES = [
  { 
    id: 'sedan', 
    name: 'Sedan', 
    rate: 12, 
    capacity: '4+1 Seats', 
    baggage: '2 Bags', 
    desc: 'Dzire, Etios or equivalent',
    type: 'car'
  },
  { 
    id: 'suv', 
    name: 'SUV', 
    rate: 16, 
    capacity: '6+1 Seats', 
    baggage: '3 Bags', 
    desc: 'Ertiga, Triber or equivalent',
    type: 'car'
  },
  { 
    id: 'innova', 
    name: 'Innova Crysta', 
    rate: 20, 
    capacity: '7+1 Seats', 
    baggage: '4 Bags', 
    desc: 'Premium touring MUV',
    type: 'car'
  },
  { 
    id: 'traveller', 
    name: 'Tempo Traveller', 
    rate: 28, 
    capacity: '12-16 Seats', 
    baggage: 'Top Carrier', 
    desc: 'Ideal for group outings',
    type: 'bus'
  },
  { 
    id: 'luxury', 
    name: 'Luxury Car', 
    rate: 55, 
    capacity: '4+1 Seats', 
    baggage: '2 Bags', 
    desc: 'Mercedes C-Class, Audi or equivalent',
    type: 'car'
  },
  { 
    id: 'minibus', 
    name: 'Mini Bus', 
    rate: 42, 
    capacity: '20-25 Seats', 
    baggage: 'Spacious Trunk', 
    desc: 'Corporate event transport',
    type: 'bus'
  }
];

/**
 * VehicleSelector component rendering cards for each vehicle type.
 */
export default function VehicleSelector({ selectedVehicleId, onSelect }) {
  return (
    <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:shadow-lg">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-800">Vehicle Selection</h2>
        <p className="text-xs text-slate-500 font-medium">Select a category below to compute corresponding rates</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {VEHICLES.map((vehicle) => {
          const isSelected = selectedVehicleId === vehicle.id;
          return (
            <div
              key={vehicle.id}
              onClick={() => onSelect(vehicle)}
              className={`relative cursor-pointer rounded-2xl p-5 border transition-all duration-300 select-none group flex flex-col justify-between ${
                isSelected
                  ? 'border-primary bg-blue-50/50 shadow-md ring-1 ring-primary'
                  : 'border-slate-100 bg-white hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              {/* Checkbox indicator */}
              {isSelected && (
                <div className="absolute top-4 right-4 text-primary animate-fade-in">
                  <FiCheckCircle className="w-5 h-5 fill-blue-50" />
                </div>
              )}

              <div>
                {/* Vehicle icon */}
                <div className={`p-2.5 rounded-xl w-fit mb-3 transition-colors ${
                  isSelected ? 'bg-primary text-white' : 'bg-slate-50 text-slate-500 group-hover:bg-slate-100'
                }`}>
                  {vehicle.type === 'bus' ? (
                    <IoBusOutline className="w-5 h-5" />
                  ) : (
                    <IoCarOutline className="w-5 h-5" />
                  )}
                </div>

                <h3 className="font-bold text-slate-800 text-sm group-hover:text-primary transition-colors flex items-center">
                  {vehicle.name}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{vehicle.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-baseline justify-between">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  {vehicle.capacity}
                </span>
                <span className="text-sm font-extrabold text-slate-700">
                  ₹{vehicle.rate}<span className="text-[10px] font-normal text-slate-400 lowercase">/km</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
