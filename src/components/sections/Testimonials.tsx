import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { fadeUp } from '../../utils/animations';
import { testimonials } from '../../data';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-white py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2 variants={fadeUp} className="text-[40px] sm:text-[52px] font-light text-gray-900 leading-[1.1] tracking-tight">
            Trusted by the <br />
            <span className="text-rh-red font-[300]">best in the business</span>
          </motion.h2>
        </motion.div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          centeredSlides={true}
          onBeforeInit={(swiper) => {
            // @ts-ignore
            swiper.params.navigation.prevEl = '.testimonials-prev';
            // @ts-ignore
            swiper.params.navigation.nextEl = '.testimonials-next';
            // @ts-ignore
            swiper.params.pagination.el = '.testimonials-pagination';
          }}
          navigation={{
            prevEl: '.testimonials-prev',
            nextEl: '.testimonials-next',
          }}
          pagination={{ 
            clickable: true, 
            el: '.testimonials-pagination',
            type: 'bullets',
          }}
          breakpoints={{
            1024: { slidesPerView: 2, spaceBetween: 40 },
          }}
          autoplay={{ delay: 8000, disableOnInteraction: false }}
          className="!overflow-visible"
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <motion.div
                variants={fadeUp}
                className="max-w-2xl mx-auto bg-rh-light rounded-[32px] p-8 md:p-10 relative overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100"
              >
                <Quote className="absolute top-6 right-6 w-12 h-12 text-gray-200/50 -rotate-12 group-hover:text-rh-red/10 transition-colors" />
                
                <div className="relative z-10">
                  <p className="text-[16px] md:text-[20px] font-medium text-rh-teal leading-relaxed mb-8 italic">
                    "{testimonial.quote}"
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl overflow-hidden shadow-md border-2 border-white group-hover:scale-105 transition-transform">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.author}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-[16px] font-bold text-rh-teal">{testimonial.author}</h4>
                      <p className="text-[13px] text-gray-500 font-medium mb-0.5">{testimonial.role}</p>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-rh-red">{testimonial.company}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Carousel Footer: Progress Bar + Navigation */}
        <div className="mt-16 flex flex-col items-center gap-8">
            <div className="w-full max-w-md h-[2px] bg-gray-100 relative overflow-hidden">
                <div className="testimonials-pagination absolute inset-0 !static !w-full h-full flex gap-0">
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                <button className="testimonials-prev w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-rh-teal hover:text-rh-teal hover:bg-rh-light transition-all shadow-sm bg-white z-20 cursor-pointer">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button className="testimonials-next w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-rh-teal hover:text-rh-teal hover:bg-rh-light transition-all shadow-sm bg-white z-20 cursor-pointer">
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .testimonials-pagination .swiper-pagination-bullet {
          flex: 1;
          height: 100%;
          border-radius: 0;
          background: transparent;
          opacity: 1;
          margin: 0 !important;
          position: relative;
          transition: background 0.3s;
        }
        .testimonials-pagination .swiper-pagination-bullet-active {
          background: rgba(215, 25, 32, 0.1);
        }
        .testimonials-pagination .swiper-pagination-bullet-active::after {
          content: '';
          position: absolute;
          inset: 0;
          background: #D71920;
          transform-origin: left;
          animation: bullet-progress 8s linear forwards;
        }
        /* Fix for Swiper Navigation */
        .testimonials-prev.swiper-button-disabled,
        .testimonials-next.swiper-button-disabled {
          opacity: 0.3;
          cursor: not-allowed;
          pointer-events: none;
        }
      `}} />
    </section>
  );
}
