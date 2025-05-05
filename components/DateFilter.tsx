import { useState } from 'react';
import { FiCalendar } from 'react-icons/fi';

interface DateFilterProps {
  onFilterChange: (startDate: string, endDate: string) => void;
}

export default function DateFilter({ onFilterChange }: DateFilterProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleFilter = () => {
    if (startDate && endDate) {
      onFilterChange(startDate, endDate);
    }
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    onFilterChange('', '');
  };

  return (
    <div className="card p-4 md:p-6 mb-6 md:mb-8">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
          {FiCalendar({ className: "text-primary" })}
          <span className="font-medium">Filtrer par date</span>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full">
          <div className="w-full md:w-auto">
            <label className="block text-sm text-gray-600 mb-1">Date de début</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input-field w-full"
            />
          </div>
          <div className="w-full md:w-auto">
            <label className="block text-sm text-gray-600 mb-1">Date de fin</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input-field w-full"
            />
          </div>
          <div className="flex items-end gap-2 w-full md:w-auto">
            <button
              onClick={handleFilter}
              disabled={!startDate || !endDate}
              className="btn-primary w-full md:w-auto"
            >
              Appliquer
            </button>
            <button
              onClick={handleReset}
              className="btn-secondary w-full md:w-auto"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 