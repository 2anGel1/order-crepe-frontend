import { motion } from 'framer-motion';
import { FiPackage, FiClock, FiTruck, FiCheckCircle } from 'react-icons/fi';

interface StatsCardsProps {
  totalOrders: number;
  processingOrders: number;
  preparingOrders: number;
  deliveringOrders: number;
  deliveredOrders: number;
}

const stats = [
  {
    title: 'Total',
    value: 'totalOrders',
    icon: FiPackage,
    color: 'bg-primary/10 text-primary',
  },
  {
    title: 'En traitement',
    value: 'processingOrders',
    icon: FiClock,
    color: 'bg-warning/10 text-warning',
  },
  {
    title: 'En préparation',
    value: 'preparingOrders',
    icon: FiPackage,
    color: 'bg-info/10 text-info',
  },
  {
    title: 'En livraison',
    value: 'deliveringOrders',
    icon: FiTruck,
    color: 'bg-primary/10 text-primary',
  },
  {
    title: 'Livrées',
    value: 'deliveredOrders',
    icon: FiCheckCircle,
    color: 'bg-success/10 text-success',
  },
];

export default function StatsCards({
  totalOrders,
  processingOrders,
  preparingOrders,
  deliveringOrders,
  deliveredOrders,
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="card p-4 md:p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{stat.title}</p>
              <h3 className="text-xl md:text-2xl font-bold mt-1">
                {stat.value === 'totalOrders' && totalOrders}
                {stat.value === 'processingOrders' && processingOrders}
                {stat.value === 'preparingOrders' && preparingOrders}
                {stat.value === 'deliveringOrders' && deliveringOrders}
                {stat.value === 'deliveredOrders' && deliveredOrders}
              </h3>
            </div>
            <div className={`p-2 md:p-3 rounded-full ${stat.color}`}>
              {/* <stat.icon className="text-xl md:text-2xl" /> */}
              {stat.icon({ className: "text-xl md:text-2xl" })}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
} 