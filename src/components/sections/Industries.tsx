import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import {
  Building2, Cpu, HeartPulse, Factory,
  Scale, ShoppingBag, Layers, Network, ChevronLeft, ChevronRight
} from 'lucide-react';
import { fadeUp } from '../../utils/animations';
import { industries } from '../../data';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const iconMap: Record<string, React.ElementType> = {
  'building-2': Building2,
  'cpu': Cpu,
  'heart-pulse': HeartPulse,
  'factory': Factory,
  'scale': Scale,
  'shopping-bag': ShoppingBag,
  'layers': Layers,
  'network': Network,
};

export default function Industries() {
  return (
    <section id="industries" className="bg-rh-light py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 md:mb-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-3xl"
          >
            <motion.h2 variants={fadeUp} className="text-3xl xs:text-4xl sm:text-[56px] font-light text-gray-900 leading-[1.1] tracking-tight">
              Deep domain expertise across <br />
              <span className="text-rh-red font-[300]">core economic sectors</span>
            </motion.h2>
          </motion.div>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          onBeforeInit={(swiper) => {
            // @ts-ignore
            swiper.params.navigation.prevEl = '.industries-prev';
            // @ts-ignore
            swiper.params.navigation.nextEl = '.industries-next';
            // @ts-ignore
            swiper.params.pagination.el = '.industries-pagination';
          }}
          navigation={{
            prevEl: '.industries-prev',
            nextEl: '.industries-next',
          }}
          pagination={{ 
            clickable: true, 
            el: '.industries-pagination',
            type: 'bullets',
          }}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 24 },
            1024: { slidesPerView: 4, spaceBetween: 24 },
          }}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          className="!overflow-visible"
        >
          {industries.map((industry) => {
            const Icon = iconMap[industry.icon] || Building2;
            return (
              <SwiperSlide key={industry.id}>
                <motion.a
                  href="#"
                  variants={fadeUp}
                  className="group block bg-white rounded-[24px] md:rounded-[32px] overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500"
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={industry.image}
                      alt={industry.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#081B2D]/90 via-[#081B2D]/40 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />

                    <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-md rounded-xl md:rounded-2xl flex items-center justify-center text-white mb-3 md:mb-4 group-hover:bg-rh-red transition-colors duration-300">
                        <Icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-xl md:text-[22px] font-bold text-white mb-1.5 md:mb-2 leading-tight">
                        {industry.name}
                      </h3>
                      <p className="text-[11px] md:text-[13px] font-bold text-white/70 uppercase tracking-widest">
                        {industry.count}+ Active Roles
                      </p>
                    </div>
                  </div>
                </motion.a>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Carousel Footer: Progress Bar + Navigation */}
        <div className="mt-12 md:mt-16 flex flex-col items-center gap-6 md:gap-8">
            <div className="w-full max-w-xs md:max-w-md h-[2px] bg-gray-200 relative overflow-hidden">
                <div className="industries-pagination absolute inset-0 !static !w-full h-full flex gap-0">
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                <button className="industries-prev w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:border-rh-teal hover:text-rh-teal hover:bg-rh-light transition-all shadow-sm z-20 cursor-pointer">
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                </button>
                <button className="industries-next w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:border-rh-teal hover:text-rh-teal hover:bg-rh-light transition-all shadow-sm z-20 cursor-pointer">
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                </button>
            </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .industries-pagination .swiper-pagination-bullet {
          flex: 1;
          height: 100%;
          border-radius: 0;
          background: transparent;
          opacity: 1;
          margin: 0 !important;
          position: relative;
          transition: background 0.3s;
        }
        .industries-pagination .swiper-pagination-bullet-active {
          background: rgba(215, 25, 32, 0.1);
        }
        .industries-pagination .swiper-pagination-bullet-active::after {
          content: '';
          position: absolute;
          inset: 0;
          background: #D71920;
          transform-origin: left;
          animation: bullet-progress 6s linear forwards;
        }
        /* Fix for Swiper Navigation */
        .industries-prev.swiper-button-disabled,
        .industries-next.swiper-button-disabled {
          opacity: 0.3;
          cursor: not-allowed;
          pointer-events: none;
        }
      `}} />
    </section>
  );
}
