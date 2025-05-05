import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import OrderForm from '../components/OrderForm';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Toast from '../components/Toast';
import { FiShoppingCart, FiClock, FiStar, FiSearch } from 'react-icons/fi';
import Link from 'next/link';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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

type ToastMessage = {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
};

export default function Home() {
  const [crepes, setCrepes] = useState<Crepe[]>([]);
  const [selectedCrepe, setSelectedCrepe] = useState<Crepe | null>(null);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'popular'>('all');

  useEffect(() => {
    // showToast("Bienvenue à L'orna crêperie !", 'info', 5000);
    fetch('/crepes.json')
      .then(res => res.json())
      .then(data => setCrepes(data))
      .catch(err => console.error('Error fetching crepes:', err));
  }, []);

  const openOrderForm = (crepe: Crepe) => {
    setSelectedCrepe(crepe);
    setIsOrderFormOpen(true);
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning', duration?: number) => {
    setToast({ message, type, duration });
  };

  const filteredCrepes = crepes.filter(crepe => {
    const matchesSearch = crepe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crepe.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'popular' && crepe.popular);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-white py-6 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-pacifico text-center mb-2">Orna Crêperie</h1>
          <p className="text-center text-gray-200">Découvrez nos délicieuses crêpes faites maison</p>
          <div className="flex justify-center mt-4 gap-4">
            <Link href="/track" className="btn-secondary flex items-center">
              {/* <FiSearch className="mr-2" /> */}
              {FiSearch({ className: "mr-2" })}
              Suivre ma commande
            </Link>
          </div>
        </div>
      </header>

      {/* Search and Filter */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Rechercher une crêpe..."
            className="input-field"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              className={`btn-secondary ${filter === 'all' ? 'bg-opacity-100' : 'bg-opacity-50'}`}
              onClick={() => setFilter('all')}
            >
              Toutes
            </button>
            <button
              className={`btn-secondary ${filter === 'popular' ? 'bg-opacity-100' : 'bg-opacity-50'}`}
              onClick={() => setFilter('popular')}
            >
              Populaires
            </button>
          </div>
        </div>

        {/* Crepes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCrepes.map(crepe => (
            <motion.div
              key={crepe.id}
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {crepe.popular && (
                <div className="absolute top-2 right-2 bg-accent text-primary px-3 py-1 rounded-full text-sm font-medium">
                  {/* <FiStar className="inline mr-1" /> */}
                  {FiStar({ className: "inline mr-1" })}
                  Populaire
                </div>
              )}
              <div className="relative h-48 mb-4">
                <Swiper
                  modules={[Navigation]}
                  navigation={{
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                    disabledClass: 'opacity-0 cursor-default',
                  }}
                  className="w-full h-full rounded-lg"
                >
                  {crepe.images.map((img, idx) => (
                    <SwiperSlide key={idx}>
                      <Image
                        src={img}
                        alt={crepe.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                        }}
                      />
                    </SwiperSlide>
                  ))}
                  <div className="swiper-button-next !text-white !bg-black/40 hover:!bg-black/60 !rounded-full !w-10 !h-10 !right-2 transition-all duration-200 after:!text-sm after:!font-bold" />
                  <div className="swiper-button-prev !text-white !bg-black/40 hover:!bg-black/60 !rounded-full !w-10 !h-10 !left-2 transition-all duration-200 after:!text-sm after:!font-bold" />
                </Swiper>
              </div>
              <h2 className="text-2xl font-pacifico text-primary mb-2">{crepe.name}</h2>
              <p className="text-gray-600 mb-4">{crepe.description}</p>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-gray-600">
                  {/* <FiClock className="mr-1" /> */}
                  {FiClock({ className: "mr-1" })}
                  <span>{crepe.preparationTime} min</span>
                </div>
                <div className="flex items-center text-accent">
                  {/* <FiStar className="mr-1" /> */}
                  {FiStar({ className: "mr-1" })}
                  <span>{crepe.rating.toFixed(1)}</span>
                </div>
              </div>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Prix</h3>
                <div className="space-y-1">
                  {crepe.prices.map((price, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">{price.size}</span>
                      <span className="font-medium text-primary">{price.price.toLocaleString()} FCFA</span>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => openOrderForm(crepe)}
                className="btn-primary w-full flex items-center justify-center"
              >
                {/* <FiShoppingCart className="mr-2" /> */}
                {FiShoppingCart({ className: "mr-2" })}
                Commander
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      {/* Order Form Modal */}
      <AnimatePresence>
        {isOrderFormOpen && selectedCrepe && (
          <OrderForm
            crepe={selectedCrepe}
            onClose={() => setIsOrderFormOpen(false)}
            showToast={showToast}
          />
        )}
      </AnimatePresence>
    </div>
  );
}