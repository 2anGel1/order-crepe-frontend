import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiLogOut, FiRefreshCw, FiClock, FiTruck, FiPackage, FiCheckCircle } from 'react-icons/fi';
import type { IconType } from 'react-icons';
import { useRouter } from 'next/router';
import AuthModal from '../components/AuthModal';
import StatsCards from '../components/StatsCards';
import DateFilter from '../components/DateFilter';
import StatusFilter from '../components/StatusFilter';
import Toast from '../components/Toast';
import Icon from '../components/Icon';
import { useAuth } from '../contexts/AuthContext';

type Order = {
  id: number;
  reference: string;
  itemName: string;
  size: string;
  quantity: number;
  totalPrice: number;
  customerName: string;
  customerContact: string;
  deliveryLocation: string;
  additionalNotes: string;
  status: 'processing' | 'preparing' | 'delivering' | 'delivered';
  createdAt: string;
};

const statusConfig: Record<Order['status'], {
  icon: IconType;
  label: string;
  color: string;
  bgColor: string;
}> = {
  processing: {
    icon: FiClock,
    label: 'En traitement',
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
  preparing: {
    icon: FiPackage,
    label: 'En préparation',
    color: 'text-info',
    bgColor: 'bg-info/10',
  },
  delivering: {
    icon: FiTruck,
    label: 'En livraison',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  delivered: {
    icon: FiCheckCircle,
    label: 'Livrée',
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
};

export default function AdminPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['processing']);
  const [dateRange, setDateRange] = useState<{ startDate?: string; endDate?: string }>({});
  const { isAuthenticated, logout } = useAuth();

  const [selectedDateRange, setSelectedDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>({ startDate: '', endDate: '' });

  const [selectedStatus, setSelectedStatus] = useState<Order['status'] | 'all'>('all');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleStatusChange = (status: Order['status'] | 'all') => {
    setSelectedStatus(status);
  };

  const handleDateFilter = (startDate: string, endDate: string) => {
    setSelectedDateRange({ startDate, endDate });
  };

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const { startDate, endDate } = selectedDateRange;
      const statusParam = selectedStatus === 'all' ? '' : `&status=${selectedStatus}`;
      const dateParams = startDate && endDate ? `&startDate=${startDate}&endDate=${endDate}` : '';
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders?page=${currentPage}&limit=5${dateParams}${statusParam}`
      );
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data.orders);
      setFilteredOrders(data.orders);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Erreur lors du chargement des commandes');
      setToast({
        message: 'Erreur lors du chargement des commandes',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedDateRange, selectedStatus, currentPage]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    } else {
      setShowAuthModal(true);
    }
  }, [isAuthenticated, fetchOrders]);

  const handleRefresh = () => {
    fetchOrders();
  };

  const handleStatusUpdate = async (orderId: number, newStatus: Order['status']) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setOrders(orders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
        setFilteredOrders(filteredOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
        setToast({
          message: 'Statut de la commande mis à jour avec succès',
          type: 'success',
        });
      }
    } catch (error) {
      setToast({
        message: 'Erreur lors de la mise à jour du statut',
        type: 'error',
      });
    }
  };

  const stats = {
    totalOrders: orders.length,
    processingOrders: orders.filter(o => o.status === 'processing').length,
    preparingOrders: orders.filter(o => o.status === 'preparing').length,
    deliveringOrders: orders.filter(o => o.status === 'delivering').length,
    deliveredOrders: orders.filter(o => o.status === 'delivered').length,
  };

  if (!isAuthenticated) {
    return (
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setShowAuthModal(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-white py-4 md:py-6 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl md:text-4xl font-pacifico text-center md:text-left">Administration</h1>
            <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4">
              <button
                onClick={handleRefresh}
                className="btn-secondary flex items-center text-sm md:text-base"
                disabled={isLoading}
              >
                {/* <Icon icon={FiRefreshCw} className={`mr-2 text-xl ${isLoading ? 'animate-spin' : ''}`} /> */}
                {FiRefreshCw({ className: `mr-2 text-xl ${isLoading ? 'animate-spin' : ''}` })}
                Actualiser
              </button>
              <button
                onClick={logout}
                className="btn-secondary flex items-center text-sm md:text-base"
              >
                {/* <Icon icon={FiLogOut} className="mr-2 text-xl" /> */}
                {FiLogOut({ className: "mr-2 text-xl" })}
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 md:py-8">
        {error && (
          <div className="bg-error/10 text-error p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <StatsCards {...stats} />

        <div className="flex flex-col gap-6 mb-8">
          <DateFilter onFilterChange={handleDateFilter} />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleStatusChange('all')}
              className={`px-4 py-2 rounded-full ${selectedStatus === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
                }`}
            >
              Toutes
            </button>
            {Object.entries(statusConfig).map(([status, config]) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status as Order['status'])}
                className={`px-4 py-2 rounded-full flex items-center gap-2 ${selectedStatus === status ? config.bgColor : 'bg-gray-100'
                  }`}
              >
                {/* <Icon icon={config.icon} className={selectedStatus === status ? config.color : 'text-gray-400'} /> */}
                {config.icon({ className: selectedStatus === status ? config.color : 'text-gray-400' })}
                <span className={selectedStatus === status ? config.color : 'text-gray-700'}>
                  {config.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <h2 className="text-xl md:text-2xl font-pacifico text-primary mb-4 md:mb-6">
          Commandes
        </h2>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            {FiClock({ className: "animate-spin text-4xl text-primary" })}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Aucune commande trouvée</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:gap-6">
              {filteredOrders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => router.push(`/admin/orders/${order.reference}`)}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                    <div>
                      <h2 className="text-lg md:text-xl font-pacifico text-primary">
                        Commande #{order.reference}
                      </h2>
                      <p className="text-gray-500 text-sm">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full ${statusConfig[order.status].bgColor} w-full md:w-auto`}>
                      <span className={`flex items-center gap-2 ${statusConfig[order.status].color}`}>
                        {/* <Icon icon={statusConfig[order.status].icon} className="text-2xl" /> */}
                        {statusConfig[order.status].icon({ className: "text-2xl" })}
                        {statusConfig[order.status].label}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Détails de la commande</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Article</span>
                          <span className="font-medium">{order.itemName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Taille</span>
                          <span className="font-medium">{order.size}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Quantité</span>
                          <span className="font-medium">{order.quantity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total</span>
                          <span className="font-bold text-primary">
                            {order.totalPrice.toLocaleString()} FCFA
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Informations client</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Nom</span>
                          <span className="font-medium">{order.customerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Contact</span>
                          <span className="font-medium">{order.customerContact}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Lieu de livraison</span>
                          <span className="font-medium">{order.deliveryLocation}</span>
                        </div>
                        {order.additionalNotes && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Notes</span>
                            <span className="font-medium">{order.additionalNotes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="btn-secondary px-4 py-2"
                >
                  Précédent
                </button>
                <span className="text-gray-700">
                  Page {currentPage} sur {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="btn-secondary px-4 py-2"
                >
                  Suivant
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
} 