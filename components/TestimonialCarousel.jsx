import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/navigation";
import { EffectCards, Navigation } from "swiper/modules";

export default function TestimonialCarousel({ testimonials = [] }) {
    // Array of Tailwind red shades
    const redShades = [
        'bg-red-500',
        'bg-red-600',
        'bg-red-700',
        'bg-red-800',
        'bg-red-900',
    ];

    return (
        <Swiper
            effect="cards"
            loop
            modules={[EffectCards, Navigation]}
            navigation
            centeredSlides
            className="testimonial-swiper"
            style={{ overflow: "visible" }} // Prevent overflow from hidden overflow
        >
            {testimonials.map((testimonial, index) => (
                <SwiperSlide key={testimonial.id} style={{ marginLeft: '10px', marginRight: '10px' }}>
                    <div className={`border testimonial-card h-96 p-3 ${redShades[index % redShades.length]}`}>
                        <div className="flex justify-center">
                            <img
                                src={testimonial.image}
                                alt="testimonial image"
                                className="w-32 h-32 rounded-full aspect-square"
                            />
                        </div>
                        <h3 className="mt-3 font-medium text-center text-yellow-200">{testimonial.name}</h3>
                        <hr className="my-3" />
                        <p className="p-3 text-center text-white">"{testimonial.content}"</p>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
}
