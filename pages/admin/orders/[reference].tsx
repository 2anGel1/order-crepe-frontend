import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { FiArrowLeft, FiClock, FiPackage, FiTruck, FiCheckCircle } from 'react-icons/fi';
import type { IconType } from 'react-icons';
import { useAuth } from '../../../contexts/AuthContext';
import Toast from '../../../components/Toast';
import Icon from '../../../components/Icon';
import AuthModal from '../../../components/AuthModal';

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

const statusOrder: Order['status'][] = ['processing', 'preparing', 'delivering', 'delivered'];

export default function OrderDetails() {
  const router = useRouter();
  const { reference } = router.query;
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const fetchOrder = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/${reference}`);
      if (!response.ok) throw new Error('Failed to fetch order');
      const data = await response.json();
      setOrder(data);
    } catch (error) {
      setError('Erreur lors du chargement de la commande');
      setToast({
        message: 'Erreur lors du chargement de la commande',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  }, [reference]);

  useEffect(() => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else if (reference) {
      fetchOrder();
    }
  }, [reference, isAuthenticated, fetchOrder]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleStatusUpdate = async (newStatus: Order['status']) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/${reference}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setOrder(prev => prev ? { ...prev, status: newStatus } : null);
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

  if (!isAuthenticated) {
    return (
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setShowAuthModal(false)}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex justify-center items-center">
        {/* <Icon icon={FiClock} className="animate-spin text-4xl text-primary" /> */}
        {FiClock({ className: "animate-spin text-4xl text-primary" })}
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center">
        <p className="text-error mb-4">Commande non trouvée</p>
        <button
          onClick={() => router.push('/admin')}
          className="btn-primary flex items-center"
        >
          {/* <Icon icon={FiArrowLeft} className="mr-2" /> */}
          {FiArrowLeft({ className: "mr-2" })}
          Retour
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-white py-4 md:py-6 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/admin')}
              className="btn-secondary flex items-center"
            >
              {/* <Icon icon={FiArrowLeft} className="mr-2" /> */}
              {FiArrowLeft({ className: "mr-2" })}
              Retour
            </button>
            <h1 className="text-2xl md:text-4xl font-pacifico">Détails de la commande</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 md:py-8">
        {error && (
          <div className="bg-error/10 text-error p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="card mb-8">
          <h2 className="text-xl md:text-2xl font-pacifico text-primary mb-6">
            Commande #{order.reference}
          </h2>

          {/* Status Timeline */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {statusOrder.map((status, index) => {
                const isCompleted = statusOrder.indexOf(order.status) >= index;
                const isCurrent = order.status === status;
                const config = statusConfig[status];
                const canInteract = isCompleted || statusOrder.indexOf(order.status) === index - 1;

                return (
                  <div key={status} className="flex flex-col items-center justify-center">
                    <div
                      className={`${isCurrent ? 'w-16 h-16' : 'w-12 h-12'
                        } rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted ? config.bgColor : 'bg-gray-100'
                        } ${canInteract ? 'cursor-pointer hover:opacity-80' : ''}`}
                      onClick={() => {
                        if (canInteract) {
                          handleStatusUpdate(status);
                        }
                      }}
                      title={canInteract ? `Passer à ${config.label}` : ''}
                    >
                      {/* <Icon
                        icon={config.icon}
                        className={`${isCurrent ? 'text-4xl' : 'text-2xl'
                          } transition-all duration-300 ${isCompleted ? config.color : 'text-gray-400'
                          }`}
                      /> */}
                      {config.icon({
                        className: `${isCurrent ? 'text-4xl' : 'text-2xl'
                          } transition-all duration-300 ${isCompleted ? config.color : 'text-gray-400'
                          }`
                      })}
                    </div>
                    <span
                      className={`mt-2 text-center ${isCurrent ? 'text-xl font-bold' : 'text-sm'
                        } transition-all duration-300 ${isCurrent
                          ? 'text-primary'
                          : isCompleted
                            ? 'text-gray-900'
                            : 'text-gray-400'
                        }`}
                    >
                      {config.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-4">Détails de la commande</h3>
              <div className="space-y-3">
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
                <div className="flex justify-between">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium">
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-700 mb-4">Informations client</h3>
              <div className="space-y-3">
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
        </div>
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