import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPlus, FiMinus } from 'react-icons/fi';

type Crepe = {
  id: number;
  name: string;
  description: string;
  prices: { size: string; price: number }[];
  images: string[];
  preparationTime: number;
  rating: number;
  popular: boolean;
};

type OrderFormProps = {
  crepe: Crepe;
  onClose: () => void;
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning', duration?: number) => void;
};

export default function OrderForm({ crepe, onClose, showToast }: OrderFormProps) {
  const [selectedSize, setSelectedSize] = useState(crepe.prices[0].size);
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const selectedPrice = crepe.prices.find(p => p.size === selectedSize)?.price || 0;
  const totalPrice = selectedPrice * quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId: crepe.id,
          itemName: crepe.name,
          size: selectedSize,
          quantity,
          totalPrice,
          customerName,
          customerContact,
          deliveryLocation,
          additionalNotes,
        }),
      });

      if (!response.ok) throw new Error('Failed to place order');

      const data = await response.json();
      showToast(`Commande placée avec succès! Référence: ${data.reference}`, 'success');
      onClose();
    } catch (error) {
      showToast('Erreur lors de la commande. Veuillez réessayer.', 'error');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-pacifico text-primary">{crepe.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              {FiX({ size: 24 })}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Taille
              </label>
              <div className="grid grid-cols-2 gap-3">
                {crepe.prices.map((price) => (
                  <button
                    key={price.size}
                    type="button"
                    onClick={() => setSelectedSize(price.size)}
                    className={`p-3 rounded-lg border-2 transition-all ${selectedSize === price.size
                      ? 'border-secondary bg-secondary bg-opacity-10 text-secondary'
                      : 'border-gray-200 hover:border-secondary'
                      }`}
                  >
                    <div className="font-medium">{price.size}</div>
                    <div className="text-sm text-gray-600">
                      {price.price.toLocaleString()} FCFA
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantité
              </label>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 rounded-lg border border-gray-200 hover:border-secondary transition-colors"
                >
                  {/* <FiMinus /> */}
                  {FiMinus({})}
                </button>
                <span className="text-lg font-medium">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 rounded-lg border border-gray-200 hover:border-secondary transition-colors"
                >
                  {/* <FiPlus /> */}
                  {FiPlus({})}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom complet
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="input-field"
                placeholder="Votre nom"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact
              </label>
              <input
                type="tel"
                required
                value={customerContact}
                onChange={(e) => setCustomerContact(e.target.value)}
                className="input-field"
                placeholder="Votre numéro de téléphone"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lieu de livraison
              </label>
              <input
                type="text"
                required
                value={deliveryLocation}
                onChange={(e) => setDeliveryLocation(e.target.value)}
                className="input-field"
                placeholder="Adresse de livraison"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes supplémentaires
              </label>
              <textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                className="input-field h-24"
                placeholder="Instructions spéciales, allergies, etc."
              />
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-medium text-gray-700">Total</span>
                <span className="text-2xl font-bold text-primary">
                  {totalPrice.toLocaleString()} FCFA
                </span>
              </div>
              <button
                type="submit"
                className="btn-primary w-full"
              >
                Confirmer la commande
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}