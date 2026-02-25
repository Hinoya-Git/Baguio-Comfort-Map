import { Users } from 'lucide-react';
import { cn } from '../lib/utils';
import { CrowdLevel, Location } from '../types';

interface CrowdMeterProps {
  location: Location;
  level: CrowdLevel;
  className?: string;
}

export function CrowdMeter({ location, level, className }: CrowdMeterProps) {
  const colors = {
    Low: 'bg-emerald-500 text-white',
    Medium: 'bg-yellow-500 text-black',
    High: 'bg-rose-500 text-white',
  };

  const labels = {
    Low: 'Quiet',
    Medium: 'Busy',
    High: 'Packed',
  };

  return (
    <div className={cn("flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors", className)}>
      <div className="flex items-center gap-3">
        <div className={cn("p-2 rounded-lg transition-colors duration-300", colors[level])}>
          <Users className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-medium text-slate-200">{location.name}</h3>
          <p className="text-xs text-slate-500">{location.category}</p>
        </div>
      </div>
      <div className="text-right">
        <span className={cn(
          "px-2 py-1 text-xs font-bold rounded-full uppercase tracking-wider transition-colors duration-300",
          level === 'Low' && "bg-emerald-500/20 text-emerald-400",
          level === 'Medium' && "bg-yellow-500/20 text-yellow-400",
          level === 'High' && "bg-rose-500/20 text-rose-400",
        )}>
          {labels[level]}
        </span>
      </div>
    </div>
  );
}
