import { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { 
  Clock, 
  Truck, 
  Plus,
  Loader2,
  Smartphone,
  Zap,
  ShieldCheck,
  History,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { Toaster, toast } from 'sonner';

// Types
interface PricingPlan {
  id: string;
  size: string;
  price: string;
  note: string;
  popular?: boolean;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Step {
  number: string;
  title: string;
  description: string;
}

// Animation Variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

// Data
const pricingPlans: PricingPlan[] = [
  { id: '9kg', size: '9kg', price: 'R340', note: 'Exchange only' },
  { id: '19kg', size: '19kg', price: 'R715', note: 'Exchange only', popular: true },
  { id: '48kg', size: '48kg', price: 'R1,810', note: 'Exchange only' },
];

const faqItems: FAQItem[] = [
  {
    question: 'How do I start ordering?',
    answer: 'Simply send a WhatsApp message to +27 63 719 5979 saying "Hi" or "3" to order gas. Our bot will guide you through the entire process.'
  },
  {
    question: 'What payment methods are accepted?',
    answer: 'We accept all major credit and debit cards through our secure payment gateway. Payment is processed directly in the WhatsApp ordering flow.'
  },
  {
    question: 'How long does delivery take?',
    answer: 'We offer same-day delivery (4-8 hours), next-day delivery, and standard delivery (within 5 days). Choose your preferred option during checkout.'
  },
  {
    question: 'Do you deliver to my area?',
    answer: 'We deliver across Gauteng and major cities in South Africa. Enter your address during checkout to confirm availability.'
  },
  {
    question: 'Can I track my delivery?',
    answer: 'Yes! Once confirmed, you\'ll receive WhatsApp updates with tracking information and estimated delivery time.'
  },
  {
    question: 'Can I cancel or change my order?',
    answer: 'You can cancel or modify your order on WhatsApp before dispatch. Our team will assist you promptly.'
  }
];

const features: Feature[] = [
  { icon: <Clock className="w-5 h-5" />, title: '24/7 Available', description: 'Order anytime, even at midnight. Our bot never sleeps.' },
  { icon: <Smartphone className="w-5 h-5" />, title: 'No App Needed', description: 'Use WhatsApp you already have. No downloads required.' },
  { icon: <Zap className="w-5 h-5" />, title: 'Super Fast', description: 'Complete your order in under 60 seconds.' },
  { icon: <ShieldCheck className="w-5 h-5" />, title: 'Secure Payment', description: 'Encrypted payment processing. Your data is safe.' },
  { icon: <Truck className="w-5 h-5" />, title: 'Same-Day Delivery', description: 'Get your gas within hours. Choose your window.' },
  { icon: <History className="w-5 h-5" />, title: 'Order History', description: 'Reorder with one message. History saved in chat.' },
];

const steps: Step[] = [
  { number: '1', title: 'Say Hi', description: 'Send "Hi" to our WhatsApp bot to start ordering.' },
  { number: '2', title: 'Browse', description: 'View our catalog and select your gas cylinder size.' },
  { number: '3', title: 'Details', description: 'Enter your address and choose delivery time.' },
  { number: '4', title: 'Done!', description: 'Pay securely and we\'ll deliver same-day.' },
];

// WhatsApp Icon Component
const WhatsAppIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// Components
const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOrderClick = () => {
    setIsLoading(true);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: 'Connecting to WhatsApp...',
        success: 'Opening WhatsApp chat!',
        error: 'Could not connect',
      }
    );
    setTimeout(() => {
      setIsLoading(false);
      window.open('https://wa.me/27637195979?text=Hi!%20I\'d%20like%20to%20order%20gas', '_blank');
    }, 1000);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'glass shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <motion.a 
            href="https://www.thegascompany.co.za/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <img 
              src="https://i.postimg.cc/VkhcC3LR/TGC-LOGO-HORISONTAL.png" 
              alt="The Gas Company" 
              className="h-10 lg:h-12 w-auto object-contain"
            />
          </motion.a>

          <motion.button
            onClick={handleOrderClick}
            disabled={isLoading}
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-5 lg:px-6 py-2.5 lg:py-3 bg-[#25D366] text-white rounded-full font-semibold text-sm lg:text-base shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/40 transition-all duration-200 disabled:opacity-70"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 lg:w-5 lg:h-5 animate-spin" />
            ) : (
              <WhatsAppIcon className="w-4 h-4 lg:w-5 lg:h-5" />
            )}
            <span className="hidden sm:inline">Order Gas</span>
            <span className="sm:hidden">Order</span>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};

const Hero = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleOrderClick = () => {
    setIsLoading(true);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: 'Connecting to WhatsApp...',
        success: 'Opening WhatsApp chat!',
        error: 'Could not connect',
      }
    );
    setTimeout(() => {
      setIsLoading(false);
      window.open('https://wa.me/27637195979?text=Hi!%20I\'d%20like%20to%20order%20gas', '_blank');
    }, 1000);
  };

  const scrollToHowItWorks = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen pt-20 lg:pt-24 bg-clean overflow-hidden">
      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-6rem)] py-12 lg:py-16">
          {/* Left Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center lg:text-left order-2 lg:order-1"
          >
            <motion.div 
              variants={fadeInUp} 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E31679]/10 mb-6"
            >
              <Zap className="w-4 h-4 text-[#E31679]" />
              <span className="text-sm font-semibold text-[#E31679]" style={{ fontFamily: 'Montserrat, sans-serif' }}>Order in 60 Seconds</span>
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="text-hero font-bold text-[#0f172a] mb-5 lg:mb-6"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Order Gas on{' '}
              <span className="text-[#25D366]">WhatsApp</span>
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-base lg:text-lg text-[#64748b] mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed"
            >
              Skip the queues and calls. Order your gas cylinders instantly through WhatsApp and get fast, convenient delivery to your doorstep.
            </motion.p>

            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center lg:justify-start"
            >
              <motion.button
                onClick={handleOrderClick}
                disabled={isLoading}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary flex items-center justify-center gap-2.5 px-7 lg:px-8 py-3.5 lg:py-4 bg-[#25D366] text-white rounded-full font-semibold text-base lg:text-lg shadow-lg shadow-[#25D366]/30 transition-all duration-200 disabled:opacity-70"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <WhatsAppIcon className="w-5 h-5" />
                )}
                Start Ordering on WhatsApp
              </motion.button>

              <motion.button
                onClick={scrollToHowItWorks}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 px-7 lg:px-8 py-3.5 lg:py-4 bg-white text-[#0f172a] rounded-full font-semibold text-base lg:text-lg border-2 border-[#e2e8f0] hover:border-[#E31679]/30 hover:bg-[#E31679]/5 transition-all duration-200"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                See How It Works
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div 
              variants={fadeInUp}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-8 pt-6 border-t border-[#e2e8f0]"
            >
              {[
                { icon: <CheckCircle2 className="w-4 h-4" />, text: 'Same-day delivery' },
                { icon: <CheckCircle2 className="w-4 h-4" />, text: 'Secure payment' },
                { icon: <CheckCircle2 className="w-4 h-4" />, text: '24/7 support' },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-1.5 text-sm text-[#64748b]">
                  {item.icon}
                  <span>{item.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="flex justify-center lg:justify-end order-1 lg:order-2"
          >
            <div className="relative">
              {/* Phone Frame */}
              <div className="relative w-[280px] sm:w-[300px] lg:w-[340px] p-3 bg-[#1a1a2e] rounded-[36px] shadow-2xl">
                <div className="relative bg-white rounded-[28px] overflow-hidden">
                  {/* Phone Screen Content */}
                  <div className="bg-[#f0f2f5] min-h-[420px] lg:min-h-[480px]">
                    {/* WhatsApp Header */}
                    <div className="bg-[#128C7E] px-4 py-3 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                        <img 
                          src="https://i.postimg.cc/VkhcC3LR/TGC-LOGO-HORISONTAL.png" 
                          alt="TGC" 
                          className="w-6 h-6 object-contain"
                        />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>The Gas Company</p>
                        <p className="text-white/70 text-xs">Online</p>
                      </div>
                    </div>
                    
                    {/* Chat Messages */}
<div className="px-4 pb-4 pt-0">
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5 }}
    className="rounded-lg overflow-hidden shadow-lg"
  >
    <img 
      src="https://i.ibb.co/rK36vpzz/Hi.jpg" 
      alt="Order Gas Information" 
      className="w-full h-auto" 
    />
  </motion.div>
</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="section-padding bg-subtle">
      <div className="container-custom">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="text-center mb-12 lg:mb-16"
        >
          <motion.h2 
            variants={fadeInUp} 
            className="text-section font-bold text-[#0f172a] mb-4"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            How It Works
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-base lg:text-lg text-[#64748b] max-w-xl mx-auto">
            From chat to delivery in 4 simple steps. No apps to download.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="relative"
            >
              <div className="bg-white p-6 lg:p-8 rounded-2xl border border-[#e2e8f0] shadow-sm h-full">
                {/* Step Number */}
                <div className="w-12 h-12 rounded-full bg-[#E31679] flex items-center justify-center mb-5 shadow-lg shadow-[#E31679]/25">
                  <span className="text-lg font-bold text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>{step.number}</span>
                </div>
                
                <h3 
                  className="text-lg font-bold text-[#0f172a] mb-2"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {step.title}
                </h3>
                <p className="text-sm text-[#64748b] leading-relaxed">{step.description}</p>
              </div>
              
              {/* Connector Arrow */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ChevronRight className="w-6 h-6 text-[#cbd5e1]" />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const Features = () => {
  return (
    <section className="section-padding bg-clean">
      <div className="container-custom">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="text-center mb-12 lg:mb-16"
        >
          <motion.h2 
            variants={fadeInUp} 
            className="text-section font-bold text-[#0f172a] mb-4"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Why Order on WhatsApp?
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-base lg:text-lg text-[#64748b] max-w-xl mx-auto">
            The most convenient way to keep your gas supply uninterrupted
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ y: -4 }}
              className="card-hover group bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-sm"
            >
              <div className="w-11 h-11 rounded-lg bg-[#E31679]/10 flex items-center justify-center mb-4 text-[#E31679] group-hover:bg-[#E31679] group-hover:text-white transition-all duration-200">
                {feature.icon}
              </div>
              <h3 
                className="text-base font-bold text-[#0f172a] mb-1.5"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {feature.title}
              </h3>
              <p className="text-sm text-[#64748b] leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const Pricing = () => {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleOrder = (plan: PricingPlan) => {
    setIsLoading(plan.id);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: `Processing ${plan.size} order...`,
        success: `Opening WhatsApp for ${plan.size} order!`,
        error: 'Could not process order',
      }
    );
    setTimeout(() => {
      setIsLoading(null);
      window.open(`https://wa.me/27637195979?text=I'd%20like%20to%20order%20a%20${plan.size}%20cylinder`, '_blank');
    }, 1000);
  };

  return (
    <section className="section-padding bg-subtle">
      <div className="container-custom">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="text-center mb-12 lg:mb-16"
        >
          <motion.h2 
            variants={fadeInUp} 
            className="text-section font-bold text-[#0f172a] mb-4"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Gas Cylinder Pricing
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-base lg:text-lg text-[#64748b] max-w-xl mx-auto">
            Transparent pricing. No hidden fees. What you see is what you pay.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-4xl mx-auto"
        >
          {pricingPlans.map((plan) => (
            <motion.div
              key={plan.id}
              variants={scaleIn}
              whileHover={{ y: -6 }}
              className={`relative p-6 lg:p-8 rounded-2xl border-2 transition-all duration-200 ${
                plan.popular 
                  ? 'border-[#E31679] bg-white shadow-xl' 
                  : 'border-[#e2e8f0] bg-white hover:border-[#E31679]/40'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#E31679] text-white text-xs font-bold rounded-full">
                  MOST POPULAR
                </div>
              )}

              <div className="text-center mb-5">
                <div className="w-24 h-24 mx-auto mb-4">
                  <img 
                    src="https://tpc.googlesyndication.com/simgad/18244048150968669015" 
                    alt={`${plan.size} Gas Cylinder`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 
                  className="text-xl font-bold text-[#0f172a] mb-1"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {plan.size}
                </h3>
                <p className="text-sm text-[#94a3b8]">{plan.note}</p>
              </div>

              <div className="text-center mb-5">
                <span 
                  className="text-3xl lg:text-4xl font-bold text-[#E31679]"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {plan.price}
                </span>
              </div>

              <motion.button
                onClick={() => handleOrder(plan)}
                disabled={isLoading === plan.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-[#25D366] text-white rounded-full font-semibold shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/40 transition-all duration-200 disabled:opacity-70"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {isLoading === plan.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <WhatsAppIcon className="w-4 h-4" />
                )}
                Order Now
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="section-padding bg-clean">
      <div className="container-custom">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="text-center mb-12 lg:mb-16"
        >
          <motion.h2 
            variants={fadeInUp} 
            className="text-section font-bold text-[#0f172a] mb-4"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Common Questions
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-base lg:text-lg text-[#64748b] max-w-xl mx-auto">
            Everything you need to know about ordering gas on WhatsApp
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="max-w-2xl mx-auto space-y-3"
        >
          {faqItems.map((item, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden shadow-sm"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-[#f8fafc] transition-colors"
              >
                <span 
                  className="font-semibold text-[#0f172a] pr-4 text-sm lg:text-base"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {item.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0 w-7 h-7 rounded-full bg-[#E31679]/10 flex items-center justify-center text-[#E31679]"
                >
                  <Plus className="w-4 h-4" />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="px-5 pb-5">
                      <p className="text-sm text-[#64748b] leading-relaxed">{item.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const FinalCTA = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleOrderClick = () => {
    setIsLoading(true);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: 'Connecting to WhatsApp...',
        success: 'Opening WhatsApp chat!',
        error: 'Could not connect',
      }
    );
    setTimeout(() => {
      setIsLoading(false);
      window.open('https://wa.me/27637195979?text=Hi!%20I\'d%20like%20to%20order%20gas', '_blank');
    }, 1000);
  };

  return (
    <section className="py-16 lg:py-20 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#E31679] to-[#ff4d9e]" />
      
      <div className="container-custom relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="text-center"
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-section font-bold text-white mb-4"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Ready to Order?
          </motion.h2>
          <motion.p 
            variants={fadeInUp}
            className="text-base lg:text-lg text-white/90 mb-8 max-w-lg mx-auto"
          >
            Join thousands who order their gas on WhatsApp. Fast, simple, reliable.
          </motion.p>
          <motion.div variants={fadeInUp}>
            <motion.button
              onClick={handleOrderClick}
              disabled={isLoading}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 px-8 lg:px-10 py-4 lg:py-5 bg-white text-[#E31679] rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-200 disabled:opacity-70"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <WhatsAppIcon className="w-5 h-5" />
              )}
              Start Ordering Now
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-8 lg:py-10 bg-[#0f172a]">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-5"
        >
          <p className="text-[#94a3b8] text-sm text-center">
            &copy; {new Date().getFullYear()} The Gas Company. All rights reserved. Since 1947
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

const FloatingWhatsApp = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: 'Connecting to WhatsApp...',
        success: 'Opening WhatsApp chat!',
        error: 'Could not connect',
      }
    );
    setTimeout(() => {
      setIsLoading(false);
      window.open('https://wa.me/27637195979?text=Hi!%20I\'d%20like%20to%20order%20gas', '_blank');
    }, 1000);
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={isLoading}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.8, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      className="fixed bottom-5 right-5 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#25D366]/40 hover:shadow-xl hover:shadow-[#25D366]/50 transition-all duration-200 disabled:opacity-70 pulse-ring"
    >
      {isLoading ? (
        <Loader2 className="w-6 h-6 animate-spin" />
      ) : (
        <WhatsAppIcon className="w-6 h-6" />
      )}
    </motion.button>
  );
};

// Main App Component
function App() {
  return (
    <div className="min-h-screen bg-white">
      {/* Toast Notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '14px 18px',
            fontFamily: 'Nunito Sans, sans-serif',
            boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.1)',
          },
        }}
      />

      {/* Skip Link for Accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main id="main-content">
        <Hero />
        <HowItWorks />
        <Features />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp Button */}
      <FloatingWhatsApp />
    </div>
  );
}

export default App;
