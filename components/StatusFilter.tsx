import { useState, useEffect } from 'react';
import { FiClock, FiPackage, FiTruck, FiCheckCircle } from 'react-icons/fi';

type Status = 'processing' | 'preparing' | 'delivering' | 'delivered';

interface StatusFilterProps {
  onStatusChange: (statuses: Status[]) => void;
}

const statusConfig = {
  processing: {
    // icon: <FiClock className="text-warning" />,
    icon: FiClock({ className: "text-warning text-2xl" }),
    label: 'En traitement',
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
  preparing: {
    // icon: <FiPackage className="text-info" />,
    icon: FiPackage({ className: "text-info" }),
    label: 'En préparation',
    color: 'text-info',
    bgColor: 'bg-info/10',
  },
  delivering: {
    // icon: <FiTruck className="text-primary" />,
    icon: FiTruck({ className: "text-primary" }),
    label: 'En livraison',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  delivered: {
    // icon: <FiCheckCircle className="text-success" />,
    icon: FiCheckCircle({ className: "text-success" }),
    label: 'Livrée',
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
};

export default function StatusFilter({ onStatusChange }: StatusFilterProps) {
  const [selectedStatuses, setSelectedStatuses] = useState<Status[]>([]);

  const toggleStatus = (status: Status) => {
    setSelectedStatuses(prev => {
      if (prev.includes(status)) {
        return prev.filter(s => s !== status);
      } else {
        return [...prev, status];
      }
    });
  };

  useEffect(() => {
    onStatusChange(selectedStatuses);
  }, [selectedStatuses, onStatusChange]);

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {(Object.keys(statusConfig) as Status[]).map((status) => (
        <button
          key={status}
          onClick={() => toggleStatus(status)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${selectedStatuses.includes(status)
            ? `${statusConfig[status].bgColor} ${statusConfig[status].color}`
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          {statusConfig[status].icon}
          <span>{statusConfig[status].label}</span>
        </button>
      ))}
    </div>
  );
} 