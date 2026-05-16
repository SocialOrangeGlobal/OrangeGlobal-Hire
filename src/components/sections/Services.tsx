import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { fadeUp } from '../../utils/animations';
import { services } from '../../data/index';
import { useAppSelector } from '../../store';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function Services() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const isTalent = isAuthenticated && user?.role === 'TALENT';

  // For Talents, we redirect industry service clicks to jobs with a category filter
  const filteredServices = services.map(s => ({
    ...s,
    link: isTalent ? `/jobs?category=${encodeURIComponent(s.title)}` : s.link
  }));

  return (
    <section id="services" className="bg-rh-light py-12 md:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 md:mb-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <motion.h2 variants={fadeUp} className="text-fluid-h2 font-light text-rh-teal leading-[1.1] tracking-tight">
              Specialized staffing across <br />
              <span className="text-rh-red font-[300]">every discipline</span>
            </motion.h2>
          </motion.div>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          onBeforeInit={(swiper) => {
            // @ts-ignore
            swiper.params.navigation.prevEl = '.services-prev';
            // @ts-ignore
            swiper.params.navigation.nextEl = '.services-next';
            // @ts-ignore
            swiper.params.pagination.el = '.services-pagination';
          }}
          navigation={{
            prevEl: '.services-prev',
            nextEl: '.services-next',
          }}
          pagination={{
            clickable: true,
            el: '.services-pagination',
            type: 'bullets',
          }}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 24 },
            1024: { slidesPerView: 3, spaceBetween: 30 },
          }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          className="!overflow-visible"
        >
          {filteredServices.map((service) => (
            <SwiperSlide key={service.id}>
              <motion.div
                variants={fadeUp}
                className="group cursor-pointer h-full"
              >
                <div className="relative aspect-[4/3] rounded-[24px] md:rounded-[32px] overflow-hidden mb-6 md:mb-8 shadow-sm group-hover:shadow-xl transition-all duration-500 border border-gray-50">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-40 group-hover:opacity-60 transition-opacity lg:opacity-0 lg:group-hover:opacity-100" />
                  <div className="absolute top-4 left-4 md:top-6 md:left-6 w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-md rounded-xl md:rounded-2xl flex items-center justify-center text-rh-teal shadow-lg">
                    <service.icon className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                </div>

                <div className="px-1 md:px-2">
                  <h3 className="text-fluid-h3 font-bold text-rh-teal mb-2 md:mb-3 group-hover:text-rh-red transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-fluid-p text-gray-500 leading-relaxed mb-4 md:mb-6 line-clamp-2">
                    {service.description}
                  </p>
                  <a href={service.link} className="inline-flex items-center gap-2 text-xs md:text-[14px] font-bold uppercase tracking-widest text-rh-red group-hover:gap-3 transition-all">
                    Explore Solutions <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Carousel Footer: Progress Bar + Navigation */}
        <div className="mt-8 md:mt-12 flex flex-col items-center gap-6 md:gap-8">
          <div className="w-full max-w-xs md:max-w-md h-[2px] bg-gray-100 relative overflow-hidden">
            <div className="services-pagination absolute inset-0 !static !w-full h-full flex gap-0">
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="services-prev w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-rh-teal hover:text-rh-teal hover:bg-rh-light transition-all shadow-sm bg-white z-20 cursor-pointer">
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button className="services-next w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-rh-teal hover:text-rh-teal hover:bg-rh-light transition-all shadow-sm bg-white z-20 cursor-pointer">
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .services-pagination .swiper-pagination-bullet {
          flex: 1;
          height: 100%;
          border-radius: 0;
          background: transparent;
          opacity: 1;
          margin: 0 !important;
          position: relative;
          transition: background 0.3s;
        }
        .services-pagination .swiper-pagination-bullet-active {
          background: rgba(215, 25, 32, 0.1);
        }
        .services-pagination .swiper-pagination-bullet-active::after {
          content: '';
          position: absolute;
          inset: 0;
          background: #D71920;
          transform-origin: left;
          animation: bullet-progress 5s linear forwards;
        }
        @keyframes bullet-progress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        /* Fix for Swiper Navigation */
        .services-prev.swiper-button-disabled,
        .services-next.swiper-button-disabled {
          opacity: 0.3;
          cursor: not-allowed;
          pointer-events: none;
        }
      `}} />
    </section>
  );
}
