import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheck, FiAlertCircle, FiInfo } from 'react-icons/fi';

type ToastProps = {
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
    onClose: () => void;
};

const Toast = ({ message, type, duration = 3000, onClose }: ToastProps) => {
    const getIcon = () => {
        switch (type) {
            case 'success':
                // return <FiCheck className="text-success" />;
                return FiCheck({ className: "text-success" });
            case 'error':
                // return <FiAlertCircle className="text-error" />;
                return FiAlertCircle({ className: "text-error" });
            case 'warning':
                // return <FiAlertCircle className="text-warning" />;
                return FiAlertCircle({ className: "text-warning" });
            case 'info':
                // return <FiInfo className="text-info" />;
                return FiInfo({ className: "text-info" });
            default:
                return null;
        }
    };

    const getBackgroundColor = () => {
        switch (type) {
            case 'success':
                return 'bg-success';
            case 'error':
                return 'bg-error';
            case 'warning':
                return 'bg-warning';
            case 'info':
                return 'bg-info';
            default:
                return 'bg-primary';
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className={`toast ${getBackgroundColor()}`}
            >
                <div className="flex items-center">
                    <div className="mr-3 text-xl">{getIcon()}</div>
                    <div className="flex-1">{message}</div>
                    <button
                        onClick={onClose}
                        className="ml-3 text-white hover:text-gray-200 transition-colors"
                    >
                        {/* <FiX /> */}
                        {FiX({})}
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default Toast;