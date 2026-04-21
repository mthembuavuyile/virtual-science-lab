import React, { useState } from 'react';
import { Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import GalvanicCellLab from '../components/simulations/GalvanicCellLab';
import ElectrolyticCellLab from '../components/simulations/ElectrolyticCellLab';

type TabId = 'galvanic' | 'electrolytic';

export default function ElectrochemistryPage() {
  const [activeTab, setActiveTab] = useState<TabId>('galvanic');

  return (
    <div className="flex flex-col h-full">
      {/* Sub-nav */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-3">
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 p-1.5 lg:p-2 rounded-lg">
            <Zap className="text-blue-600 w-4 h-4 lg:w-5 lg:h-5" />
          </div>
          <h1 className="text-base lg:text-xl font-bold text-slate-900">Electrochemistry</h1>
          <Badge variant="outline" className="text-[8px] lg:text-[9px]">UNIT 5</Badge>
        </div>
        <div className="flex bg-slate-200 p-1 rounded-lg sm:ml-auto w-full sm:w-auto">
          <button
            className={`flex-1 sm:flex-none px-3 lg:px-4 py-1.5 rounded-md text-xs lg:text-sm font-semibold transition-colors ${activeTab === 'galvanic' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600'}`}
            onClick={() => setActiveTab('galvanic')}
          >
            Galvanic Cell
          </button>
          <button
            className={`flex-1 sm:flex-none px-3 lg:px-4 py-1.5 rounded-md text-xs lg:text-sm font-semibold transition-colors ${activeTab === 'electrolytic' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600'}`}
            onClick={() => setActiveTab('electrolytic')}
          >
            Electrolytic Cell
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-auto">
        {activeTab === 'galvanic' ? <GalvanicCellLab /> : <ElectrolyticCellLab />}
      </div>
    </div>
  );
}
