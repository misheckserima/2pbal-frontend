import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PackageCard from '@/components/ui/package-card';
import { Check, X, MessageCircle, ClipboardList, Rocket, TrendingUp, Shield } from 'lucide-react';
import { PACKAGES, CASE_STUDIES } from '@/lib/constants';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { motion, useInView, useAnimation, AnimatePresence } from 'framer-motion';
import CountingNumbers from '@/components/ui/counting-numbers';
import { Link } from 'wouter';
import { HesitationTooltip } from '@/components/ui/smart-tooltip';

interface HomeProps {
  onOpenCalculator: () => void;
}

export default function Home({ onOpenCalculator }: HomeProps) {
  const { user, isAuthenticated } = useAuth();
  const [roiVisible, setRoiVisible] = useState(false);
  const [heroTransformed, setHeroTransformed] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [transitionType, setTransitionType] = useState<'fade' | 'slide'>('fade');
  const problemRef = useRef(null);
  const solutionRef = useRef(null);
  const trustBarRef = useRef(null);
  
  // Background images array - Only the 4 specified images
  const backgroundImages = [
    "https://res.cloudinary.com/ppbal/image/upload/v1755706320/smiling-businessman-signing-contract_as5sau.jpg",
    "https://res.cloudinary.com/ppbal/image/upload/v1755705712/african-entrepreneur-start-up-company-reading-charts-documents-paperwork-diverse-team-business-people-analyzing-company-financial-reports-from-computer-successful-corporate-professional-ent_cbit7s.jpg",
    "https://res.cloudinary.com/ppbal/image/upload/v1755705703/dynamic-data-visualization-3d_1_u0fq3e.jpg",
    "https://res.cloudinary.com/ppbal/image/upload/v1755705701/index-finger-touching-purple-arrow_xnjmry.jpg"
  ];
  
  const problemInView = useInView(problemRef, { once: true });
  const solutionInView = useInView(solutionRef, { once: true });
  const trustBarInView = useInView(trustBarRef, { once: true });
  
  const problemControls = useAnimation();
  const solutionControls = useAnimation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (problemInView) {
      problemControls.start("visible");
    }
  }, [problemControls, problemInView]);

  useEffect(() => {
    if (solutionInView) {
      // Delay solution animation slightly after problem
      setTimeout(() => {
        solutionControls.start("visible");
      }, 800);
    }
  }, [solutionControls, solutionInView]);

  useEffect(() => {
    if (trustBarInView) {
      setRoiVisible(true);
    }
  }, [trustBarInView]);

  // Randomize initial image and rotate images with specific transition sequence
  useEffect(() => {
    // Set random initial image
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    setCurrentImageIndex(randomIndex);
    
    // Rotate images every 6 seconds with specific transition sequence
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % backgroundImages.length;
        
        // Set transition type based on position in sequence
        // First 2: fade, 3rd: slide, 4th: fade
        const positionInSequence = (nextIndex + 1) % 4;
        if (positionInSequence === 3) {
          setTransitionType('slide'); // 3rd image slides from right
        } else {
          setTransitionType('fade'); // 1st, 2nd, and 4th images fade
        }
        
        return nextIndex;
      });
    }, 6000);
    
    return () => clearInterval(interval);
  }, [backgroundImages.length]);
  
  const handlePackageSelect = (packageId: string) => {
    window.location.href = `/package/${packageId}`;
  };

  const scrollToPackages = () => {
    document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`${isAuthenticated && !user?.emailVerified ? 'pt-[104px] lg:pt-[120px]' : 'pt-16 lg:pt-20'}`}>
      {/* Hero Section - Dynamic Background Images */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Dynamic Background Images - Reduced width */}
        <div className="absolute inset-0 flex justify-center">
          <div className="w-full max-w-6xl h-full">
          <AnimatePresence mode="wait">
            <motion.img 
              key={currentImageIndex}
              src={backgroundImages[currentImageIndex]}
              alt="Business growth and digital transformation" 
              className="w-full h-full object-cover"
              loading="eager"
              initial={transitionType === 'fade' 
                ? { opacity: 0, scale: 1.1 }
                : { opacity: 1, x: '100%' }
              }
              animate={transitionType === 'fade'
                ? { opacity: 1, scale: 1 }
                : { opacity: 1, x: 0 }
              }
              exit={transitionType === 'fade'
                ? { opacity: 0, scale: 0.9 }
                : { opacity: 0, x: '-100%' }
              }
              transition={{ 
                duration: transitionType === 'fade' ? 1.5 : 1.2, 
                ease: "easeInOut" 
              }}
              onLoad={() => console.log('Background image loaded successfully')}
              onError={(e) => {
                console.error('Failed to load background image:', e);
                e.currentTarget.style.display = 'none';
              }}
            />
          </AnimatePresence>
          </div>
          
          {/* Subtle overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-black/20"></div>
          
          {/* Cloud-like effect in bottom right corner */}
          <div className="absolute bottom-0 right-0 w-64 h-64 opacity-30">
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-xl"></div>
            <div className="absolute bottom-8 right-8 w-24 h-24 bg-white/15 rounded-full blur-lg"></div>
            <div className="absolute bottom-16 right-16 w-16 h-16 bg-white/10 rounded-full blur-md"></div>
          </div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-0">
          {/* Top small text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-4"
          >
            <motion.p 
              className="text-white text-sm sm:text-lg lg:text-xl font-body drop-shadow-lg"
              animate={{ 
                y: [0, -2, 0],
                opacity: [1, 0.9, 1]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              Benefit from our tried and tested solutions.
            </motion.p>
          </motion.div>

          {/* Main headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-white leading-tight drop-shadow-2xl"
              animate={{ 
                scale: [1, 1.02, 1],
                textShadow: [
                  "0 0 20px rgba(255,255,255,0.3)",
                  "0 0 30px rgba(255,255,255,0.5)",
                  "0 0 20px rgba(255,255,255,0.3)"
                ]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <span className="block">GROW YOUR</span>
              <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">COMPANY</span>
            </motion.h1>
          </motion.div>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-8"
          >
            <motion.p 
              className="text-lg sm:text-xl lg:text-2xl xl:text-3xl text-white font-body drop-shadow-lg"
              animate={{ 
                x: [0, 2, -2, 0],
                opacity: [1, 0.95, 1]
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              with digital strategies that work
            </motion.p>
          </motion.div>

          {/* Company name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-8"
          >
            <p className="text-sm sm:text-lg lg:text-xl text-white font-heading font-semibold drop-shadow-lg">
              Precise Programming for Business Advancement & Leverage
            </p>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Button
              onClick={() => {
                setHeroTransformed(true);
                setTimeout(() => onOpenCalculator(), 800);
              }}
              size="lg"
              className="bg-white text-blue-900 hover:bg-blue-50 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-heading"
            >
              Get Free Consultation
            </Button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white text-center"
          >
            <div className="text-sm font-body mb-2">Scroll to explore</div>
            <div className="w-6 h-10 border-2 border-white rounded-full mx-auto flex justify-center">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-3 bg-white rounded-full mt-2"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stop Overpaying Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white relative">
        {/* Add top margin to prevent overlap with floating elements */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-white"></div>
        {/* Mobile padding fix */}
        <div className="pt-8 sm:pt-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Main Content - 8 columns on desktop, full width on mobile */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-gray-900 lg:col-span-8"
            >
              {/* Dynamic Headline with staggered animation */}
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                {/* First part fades in immediately */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="block"
                >
                  {["Stop", "Overpaying", "for", "Digital", "Solutions."].map((word, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.6, 
                        delay: index * 0.1,
                        ease: "easeOut" 
                      }}
                      className="inline-block mr-2 sm:mr-3"
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.div>
                
                {/* Second part with delay and special animation */}
                <motion.span
                  initial={{ opacity: 0, x: -30, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ 
                    duration: 1, 
                    delay: 2,
                    ease: "backOut"
                  }}
                  className="text-teal-600 inline-block"
                >
                  Start Scaling.
                </motion.span>
              </div>
              
              {/* Subtext slides in from left after 2 second delay */}
              <motion.p 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 2.5 }}
                className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 text-gray-600"
              >
                Get a dedicated team of experts for less than the cost of one in-house hire. 
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 3, duration: 0.6 }}
                  className="font-semibold text-teal-600"
                >
                  {" "}Save up to 70% vs. traditional agencies.
                </motion.span>
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
                className="flex flex-col gap-3 max-w-xs sm:max-w-sm"
              >
                {/* Enhanced Pulsing CTA Button with "pulse" state after 3 seconds */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <Button 
                    onClick={() => {
                      setHeroTransformed(true);
                      setTimeout(() => onOpenCalculator(), 800);
                    }}
                    size="lg"
                    className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white text-sm sm:text-base px-4 sm:px-6 py-3 w-full relative overflow-hidden group"
                  >
                    {/* Enhanced glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-blue-600 opacity-75 blur-lg group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Button content */}
                    <span className="relative z-10 font-semibold">
                      <span className="hidden sm:inline">Schedule Free Consultation</span>
                      <span className="sm:hidden">Free Consultation</span>
                    </span>
                    
                    {/* Enhanced pulse animation that starts after headline animation */}
                    <motion.div
                      initial={{ scale: 1, opacity: 0 }}
                      animate={{ 
                        scale: [1, 1.15, 1], 
                        opacity: [0.2, 0.4, 0.2] 
                      }}
                      transition={{ 
                        duration: 2.5, 
                        repeat: Infinity,
                        delay: 3.5,  // Start pulsing after headline completes
                        ease: "easeInOut"
                      }}
                      className="absolute inset-0 bg-teal-600 rounded-lg"
                    />
                    
                    {/* Additional shimmer effect */}
                    <motion.div
                      animate={{
                        x: [-200, 300],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                        delay: 4
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-8 skew-x-12"
                    />
                  </Button>
                </motion.div>

                {/* Secondary CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.8 }}
                >
                  <Button 
                    variant="outline"
                    onClick={scrollToPackages}
                    size="lg"
                    className="w-full border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white text-sm sm:text-base px-4 sm:px-6 py-3 transition-all duration-300"
                  >
                    <span className="hidden sm:inline">View Services</span>
                    <span className="sm:hidden">Services</span>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* The Value Stack - 4 columns on desktop, appears after main content on mobile */}
            <motion.div 
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1, delay: 1.5, ease: "backOut" }}
              className="lg:col-span-4 space-y-4 mt-8 lg:mt-0"
            >
              {/* ROI Statement with parallax effect */}
              <motion.div
                whileInView={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                viewport={{ once: false }}
                className="bg-gradient-to-br from-teal-50 to-lime-50 border border-teal-200 rounded-xl p-6 shadow-lg"
              >
                <div className="text-center">
                  <motion.div 
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-3xl font-bold text-teal-600 mb-2"
                  >
                    <CountingNumbers end={70} suffix="%" trigger={true} />
                  </motion.div>
                  <p className="text-sm text-gray-700 font-medium">Average Client Savings</p>
                  <p className="text-xs text-gray-500 mt-1">vs. Traditional Agencies</p>
                </div>
              </motion.div>

              {/* Savings Badge with enhanced animation */}
              <motion.div
                whileInView={{ y: [0, 5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                viewport={{ once: false }}
                className="bg-gradient-to-br from-lime-50 to-green-50 border border-lime-200 rounded-xl p-6 shadow-lg"
              >
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: [0, 2, -2, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="w-12 h-12 bg-gradient-to-br from-lime-400 to-lime-600 rounded-full flex items-center justify-center mx-auto mb-3"
                  >
                    <span className="text-white font-bold text-lg">$</span>
                  </motion.div>
                  <h3 className="font-semibold text-gray-800">Cost-Effective Teams</h3>
                  <p className="text-xs text-gray-600 mt-1">
                    Full team for less than one hire
                  </p>
                </div>
              </motion.div>

              {/* Trust Indicator */}
              <motion.div
                whileInView={{ y: [0, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                viewport={{ once: false }}
                className="bg-gradient-to-br from-blue-50 to-teal-50 border border-blue-200 rounded-xl p-6 shadow-lg"
              >
                <div className="text-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3"
                  >
                    <Shield className="w-6 h-6 text-white" />
                  </motion.div>
                  <h3 className="font-semibold text-gray-800">Trusted by 200+</h3>
                  <p className="text-xs text-gray-600 mt-1">
                    Growing businesses worldwide
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Level Up Your Business Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">
                  Level Up
                </span> Your Business
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Transform your business with our comprehensive digital solutions. From strategic planning to execution, 
                we provide the expertise and tools you need to scale efficiently and compete in the digital marketplace.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  "Strategic business planning and market analysis",
                  "Custom web development and digital platforms",
                  "Growth marketing and lead generation",
                  "Ongoing support and optimization"
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-6 h-6 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700">{benefit}</span>
                  </motion.div>
                ))}
              </div>
              <Button
                onClick={() => {
                  setHeroTransformed(true);
                  setTimeout(() => onOpenCalculator(), 800);
                }}
                size="lg"
                className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Start Your Transformation
              </Button>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2 relative"
            >
              <div className="relative">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="relative z-10"
                >
                  <img 
                    src="https://res.cloudinary.com/ppbal/image/upload/v1755703719/levelup_xe0e7r.jpg" 
                    alt="Level up your business with digital transformation" 
                    className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                    loading="lazy"
                    onLoad={() => console.log('Levelup image loaded successfully')}
                    onError={(e) => {
                      console.error('Failed to load levelup image:', e);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </motion.div>
                
                {/* Floating elements - positioned in empty areas */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-8 -right-8 bg-white p-4 rounded-xl shadow-lg border border-gray-200 z-20"
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-teal-600">70%</div>
                    <div className="text-sm text-gray-600">Cost Savings</div>
                  </div>
                </motion.div>
                
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-8 -left-8 bg-white p-4 rounded-xl shadow-lg border border-gray-200 z-20"
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">24/7</div>
                    <div className="text-sm text-gray-600">Support</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Future Vision Section */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="relative z-10"
                >
                  <img 
                    src="https://res.cloudinary.com/ppbal/image/upload/v1755703722/future-visions-business-technology-concept_gomvpw.jpg" 
                    alt="Future vision of business technology and innovation" 
                    className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                    loading="lazy"
                    onLoad={() => console.log('Future vision image loaded successfully')}
                    onError={(e) => {
                      console.error('Failed to load future vision image:', e);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </motion.div>
                
                {/* Floating elements - positioned in empty areas */}
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-8 -left-8 bg-gradient-to-br from-teal-500 to-blue-500 p-4 rounded-xl shadow-lg z-20"
                >
                  <div className="text-center text-white">
                    <div className="text-2xl font-bold">Innovation</div>
                    <div className="text-sm opacity-90">Driven</div>
                  </div>
                </motion.div>
                
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                  className="absolute -bottom-8 -right-8 bg-white p-4 rounded-xl shadow-lg border border-gray-200 z-20"
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-teal-600">Future</div>
                    <div className="text-sm text-gray-600">Ready</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
                  Future Vision
                </span> Technology
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Stay ahead of the competition with cutting-edge technology solutions. Our forward-thinking approach 
                ensures your business is equipped with the latest innovations and digital strategies.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  "Advanced AI and automation solutions",
                  "Cloud-native architecture and scalability",
                  "Data-driven insights and analytics",
                  "Cybersecurity and compliance standards"
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </motion.div>
                ))}
              </div>
              <Button
                onClick={scrollToPackages}
                size="lg"
                variant="outline"
                className="border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Explore Our Solutions
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section ref={trustBarRef} className="py-8 bg-gray-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 lg:gap-16 text-gray-500"
          >
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gray-700 mb-1">
                <CountingNumbers end={200} suffix="+" trigger={roiVisible} />
              </div>
              <div className="text-sm">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gray-700 mb-1">
                <CountingNumbers end={500} suffix="+" trigger={roiVisible} />
              </div>
              <div className="text-sm">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gray-700 mb-1">
                <CountingNumbers end={70} suffix="%" trigger={roiVisible} />
              </div>
              <div className="text-sm">Average Savings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gray-700 mb-1">
                <CountingNumbers end={24} suffix="/7" trigger={roiVisible} />
              </div>
              <div className="text-sm">Support Available</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section ref={problemRef} className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={problemControls}
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              The Problem with Traditional Agencies
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Most businesses struggle with high costs, slow delivery, and lack of transparency when working with traditional digital agencies.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: X,
                title: "High Costs",
                description: "Traditional agencies charge $150-300/hour per specialist, making comprehensive solutions unaffordable for most businesses."
              },
              {
                icon: X,
                title: "Slow Delivery",
                description: "Complex agency structures and multiple handoffs result in months-long project timelines and missed opportunities."
              },
              {
                icon: X,
                title: "Lack of Transparency",
                description: "Hidden fees, unclear pricing, and limited visibility into project progress create frustration and uncertainty."
              }
            ].map((problem, index) => (
              <motion.div
                key={index}
                initial="hidden"
                animate={problemControls}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-red-50 border border-red-200 rounded-xl p-6 text-center"
              >
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <problem.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{problem.title}</h3>
                <p className="text-gray-600 leading-relaxed">{problem.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section ref={solutionRef} className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={solutionControls}
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Our Solution: Affordable Excellence
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've reimagined digital services to provide enterprise-quality solutions at prices that work for growing businesses.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Check,
                title: "Fixed Pricing",
                description: "Transparent, all-inclusive packages with no hidden fees. Know exactly what you're paying for upfront."
              },
              {
                icon: Check,
                title: "Rapid Delivery",
                description: "Streamlined processes and dedicated teams ensure faster project completion without sacrificing quality."
              },
              {
                icon: Check,
                title: "Full Transparency",
                description: "Real-time project tracking, regular updates, and clear communication throughout the entire process."
              }
            ].map((solution, index) => (
              <motion.div
                key={index}
                initial="hidden"
                animate={solutionControls}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-green-50 border border-green-200 rounded-xl p-6 text-center"
              >
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <solution.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{solution.title}</h3>
                <p className="text-gray-600 leading-relaxed">{solution.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Choose Your Growth Package
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive digital solutions designed to scale with your business, from startup to enterprise.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PACKAGES.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <PackageCard
                  package={pkg}
                  onSelect={handlePackageSelect}
                  isAuthenticated={isAuthenticated}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how we've helped businesses like yours achieve remarkable results and significant cost savings.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CASE_STUDIES.slice(0, 3).map((study, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-500 rounded-lg flex items-center justify-center mr-4">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{study.title}</h3>
                        <p className="text-sm text-gray-600">{study.industry}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4 leading-relaxed">{study.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-teal-600">{study.savings}</div>
                      <div className="text-sm text-gray-500">Cost Savings</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-teal-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
              Join hundreds of businesses that have already saved money and achieved their goals with our comprehensive digital services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => {
                  setHeroTransformed(true);
                  setTimeout(() => onOpenCalculator(), 800);
                }}
                size="lg"
                variant="secondary"
                className="bg-white text-teal-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
              >
                Get Free Consultation
              </Button>
              <Link href="/packages">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-teal-600 px-8 py-4 text-lg font-semibold"
                >
                  View All Packages
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
