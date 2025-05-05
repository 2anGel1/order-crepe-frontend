import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLock } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { authenticate } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await authenticate(passcode);
      if (success) {
        onSuccess();
        onClose();
      } else {
        setError('Code d\'accès incorrect');
      }
    } catch (error) {
      setError('Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
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
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
            >
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    {FiLock({ className: "text-primary text-2xl" })}
                  </div>
                </div>
                <h2 className="text-2xl font-pacifico text-primary mb-2">
                  Accès Administrateur
                </h2>
                <p className="text-gray-600">
                  Veuillez entrer le code d'accès pour continuer
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="input-field w-full"
                    placeholder="Code d'accès"
                    required
                  />
                </div>

                {error && (
                  <p className="text-error text-sm text-center">{error}</p>
                )}

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn-secondary flex-1"
                    disabled={isLoading}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Vérification...' : 'Valider'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 