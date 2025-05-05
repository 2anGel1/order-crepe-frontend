import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiSearch, FiClock, FiCheckCircle, FiTruck, FiPackage } from 'react-icons/fi';
import Link from 'next/link';

type Order = {
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

const statusConfig = {
  processing: {
    // icon: <FiClock className="text-warning" />,
    icon: FiClock({ className: "text-warning" }),
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

export default function TrackOrder() {
  const [reference, setReference] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTrack = async () => {
    if (!reference.trim()) {
      setError('Veuillez entrer un numéro de commande');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/${reference}`);
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setOrder(null);
      } else {
        setOrder(data);
        setError('');
      }
    } catch {
      setError('Une erreur est survenue lors de la recherche de votre commande.');
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-white py-6 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-pacifico text-center mb-2">Suivi de commande</h1>
          <p className="text-center text-gray-200">Suivez l'état de votre commande en temps réel</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Search Section */}
          <div className="card mb-8">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Entrez votre numéro de commande"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="input-field flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
              />
              <button
                onClick={handleTrack}
                disabled={isLoading}
                className="btn-primary flex items-center justify-center min-w-[120px]"
              >
                {/* <FiSearch className="mr-2" /> */}
                {FiSearch({ className: "mr-2" })}
                {isLoading ? 'Recherche...' : 'Suivre'}
              </button>
            </div>
            {error && (
              <p className="text-error mt-4 text-sm">{error}</p>
            )}
          </div>

          {/* Order Details */}
          {order && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-pacifico text-primary">Détails de la commande</h2>
                  <div className={`px-4 py-2 rounded-full ${statusConfig[order.status].bgColor} ${statusConfig[order.status].color} flex items-center gap-2`}>
                    {statusConfig[order.status].icon}
                    <span className="font-medium">{statusConfig[order.status].label}</span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm mt-1">
                  Référence: {order.reference}
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
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

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-700 mb-2">Informations de livraison</h3>
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

              <div className="mt-6 pt-4 border-t border-gray-200">
                <Link href="/" className="btn-secondary w-full text-center">
                  Retour à l'accueil
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}