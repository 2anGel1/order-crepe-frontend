import { motion } from 'framer-motion';
import { FiX, FiCheck } from 'react-icons/fi';

type OrderData = {
  itemId: number;
  itemName: string;
  size: string;
  quantity: number;
  totalPrice: number;
  customerName: string;
  customerContact: string;
  deliveryLocation: string;
  additionalNotes: string;
};

type OrderSummarySheetProps = {
  orderData: OrderData;
  onConfirm: () => void;
  onCancel: () => void;
  onClose: () => void;
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning', duration?: number) => void;
};

export default function OrderSummarySheet({
  orderData,
  onConfirm,
  onCancel,
  onClose,
  showToast,
}: OrderSummarySheetProps) {
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
        className="bg-white rounded-xl shadow-xl max-w-md w-full"
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-pacifico text-primary">Récapitulatif de la commande</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              {/* <FiX size={24} /> */}
              {FiX({ size: 24 })}
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-700 mb-2">Détails de la commande</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Article</span>
                  <span className="font-medium">{orderData.itemName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taille</span>
                  <span className="font-medium">{orderData.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantité</span>
                  <span className="font-medium">{orderData.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total</span>
                  <span className="font-bold text-primary">
                    {orderData.totalPrice.toLocaleString()} FCFA
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-700 mb-2">Informations de livraison</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nom</span>
                  <span className="font-medium">{orderData.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Contact</span>
                  <span className="font-medium">{orderData.customerContact}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lieu de livraison</span>
                  <span className="font-medium">{orderData.deliveryLocation}</span>
                </div>
                {orderData.additionalNotes && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Notes</span>
                    <span className="font-medium">{orderData.additionalNotes}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium text-gray-700">Total à payer</span>
              <span className="text-2xl font-bold text-primary">
                {orderData.totalPrice.toLocaleString()} FCFA
              </span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onConfirm}
                className="btn-primary flex-1 flex items-center justify-center"
              >
                {/* <FiCheck className="mr-2" /> */}
                {FiCheck({ className: "mr-2" })}
                Confirmer
              </button>
              <button
                onClick={onCancel}
                className="btn-secondary flex-1"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}