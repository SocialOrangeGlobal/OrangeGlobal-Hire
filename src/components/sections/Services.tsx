import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import {
  BarChart2, Code2, Scale, Megaphone, ClipboardList, Star, ArrowRight, ChevronLeft, ChevronRight
} from 'lucide-react';
import { fadeUp } from '../../utils/animations';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const services = [
  {
    id: 1,
    icon: BarChart2,
    title: 'Finance & Accounting',
    description: 'From CFOs to staff accountants, we connect organizations with financial professionals who drive fiscal performance.',
    image: '/images/services/finance.png',
    link: '#',
  },
  {
    id: 2,
    icon: Code2,
    title: 'Technology',
    description: 'Source elite engineers, architects, and IT leaders who can scale your technical infrastructure.',
    image: '/images/services/tech.png',
    link: '#',
  },
  {
    id: 3,
    icon: Scale,
    title: 'Legal',
    description: 'Place attorneys, paralegals, and compliance officers from in-house counsel to major law firms.',
    image: '/images/services/legal.png',
    link: '#',
  },
  {
    id: 4,
    icon: Megaphone,
    title: 'Marketing & Creative',
    description: 'Build brand-defining teams with strategists, designers, and content professionals who deliver results.',
    image: '/images/services/marketing.png',
    link: '#',
  },
  {
    id: 5,
    icon: ClipboardList,
    title: 'Administrative Support',
    description: 'Match your organization with executive assistants, office managers, and operations professionals.',
    image: '/images/services/admin.png',
    link: '#',
  },
  {
    id: 6,
    icon: Star,
    title: 'Executive Search',
    description: 'Our retained executive search practice identifies and secures transformational C-suite and VP-level leaders.',
    image: '/images/services/executive.png',
    link: '#',
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-white py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <motion.h2 variants={fadeUp} className="text-[40px] sm:text-[52px] font-light text-gray-900 leading-[1.1] tracking-tight">
              Specialized staffing across <br />
              <span className="text-rh-red font-[300]">every discipline</span>
            </motion.h2>
          </motion.div>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
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
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          className="!overflow-visible"
        >
          {services.map((service) => (
            <SwiperSlide key={service.id}>
              <motion.div
                variants={fadeUp}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[4/3] rounded-[32px] overflow-hidden mb-8 shadow-sm group-hover:shadow-xl transition-all duration-500 border border-gray-50">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-6 left-6 w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center text-rh-teal shadow-lg">
                    <service.icon className="w-6 h-6" />
                  </div>
                </div>
                
                <div className="px-2">
                  <h3 className="text-[24px] font-bold text-rh-teal mb-3 group-hover:text-rh-red transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-[16px] text-gray-500 leading-relaxed mb-6 line-clamp-2">
                    {service.description}
                  </p>
                  <a href={service.link} className="inline-flex items-center gap-2 text-[14px] font-bold uppercase tracking-widest text-rh-red group-hover:gap-3 transition-all">
                    Explore Solutions <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
        
        {/* Carousel Footer: Progress Bar + Navigation */}
        <div className="mt-16 flex flex-col items-center gap-8">
            <div className="w-full max-w-md h-[2px] bg-gray-100 relative overflow-hidden">
                <div className="services-pagination absolute inset-0 !static !w-full h-full flex gap-0">
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                <button className="services-prev w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-rh-teal hover:text-rh-teal hover:bg-rh-light transition-all shadow-sm bg-white z-20 cursor-pointer">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button className="services-next w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-rh-teal hover:text-rh-teal hover:bg-rh-light transition-all shadow-sm bg-white z-20 cursor-pointer">
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
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
