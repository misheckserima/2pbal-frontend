import { useState, useMemo } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Menu, User, LogOut, Settings, BarChart3, Home, Shield, Mail, AlertTriangle, Code } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { ContactPopup } from '@/components/ui/contact-popup';
import { motion } from 'framer-motion';
// Logo will be served from public assets

interface HeaderProps {
  onOpenCalculator: () => void;
}

export default function Header({ onOpenCalculator }: HeaderProps) {
  const [location, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { toast } = useToast();

  const logoPath = "/logo.png";

  const navigation = [
    { name: 'Home', href: '/', icon: 'home' },
    { name: 'About Us', href: '/about', icon: 'info' },
    { name: 'Packages', href: '/packages', icon: 'package' },
    { name: 'Services', href: '/services', icon: 'grid' },
  ];

  // Smart CTA text based on current page
  const smartQuoteText = useMemo(() => {
    if (location.startsWith('/package/')) {
      const packageName = location.includes('pro') ? 'Pro Package' : 
                         location.includes('starter') ? 'Starter Package' :
                         location.includes('enterprise') ? 'Enterprise Package' : 'Package';
      return `Get Quote for ${packageName}`;
    }
    if (location.startsWith('/service/')) {
      return 'Get Quote for This Service';
    }
    if (location === '/packages') {
      return 'Get Custom Quote';
    }
    if (location === '/services') {
      return 'Get Service Quote';
    }
    return 'Get Quote';
  }, [location]);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "See you next time!",
      });
      setLocation('/');
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleResendVerification = async () => {
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        toast({
          title: "Verification Email Sent",
          description: "Please check your email for the verification link.",
        });
      } else {
        const data = await response.json();
        toast({
          title: "Failed to Send Email",
          description: data.message || "Could not send verification email.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send verification email.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {/* Email verification banner */}
      {isAuthenticated && !user?.emailVerified && (
        <div className="bg-yellow-500 text-black px-4 py-2 text-center text-sm fixed w-full top-0 z-50">
          <div className="flex items-center justify-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Please verify your email to make purchases.</span>
            <Button 
              variant="link" 
              size="sm" 
              className="text-black underline h-auto p-0"
              onClick={handleResendVerification}
            >
              Resend verification email
            </Button>
          </div>
        </div>
      )}
      
      <header className={`bg-gradient-to-r from-blue-900/95 to-blue-800/95 sm:bg-gradient-to-r sm:from-blue-900/95 sm:to-blue-800/95 bg-transparent backdrop-blur-md shadow-lg border-b border-blue-700/30 fixed w-full z-40 ${isAuthenticated && !user?.emailVerified ? 'top-10' : 'top-0'}`}>
      <nav className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-16 lg:h-20">
          <div className="flex items-center min-w-0 flex-1">
                          <Link href="/" className="flex items-center group mr-4 lg:mr-8 flex-shrink-0">
                <img 
                  src="https://res.cloudinary.com/ppbal/image/upload/v1755703718/2pbal_logo_cz5r0u.png" 
                  alt="2PBAL Logo" 
                  className="h-10 w-auto sm:h-12 lg:h-16 object-contain" 
                  onLoad={() => console.log('Logo loaded successfully')}
                  onError={(e) => {
                    console.error('Failed to load logo:', e);
                    // Fallback to text if logo fails to load
                    e.currentTarget.style.display = 'none';
                    document.getElementById('logo-fallback')?.classList.remove('hidden');
                  }}
                />
                <div className="flex flex-col ml-3">
                  <span className="text-white font-heading font-bold text-xs sm:text-sm lg:text-base drop-shadow-lg">Precise Programming</span>
                  <span className="text-blue-100 text-xs sm:text-xs -mt-1 hidden sm:block font-body drop-shadow-lg">for Business Advancement & Leverage</span>
                </div>
                {/* Fallback logo if image doesn't load */}
                <div className="h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center hidden" id="logo-fallback">
                  <span className="text-white font-bold text-xs sm:text-sm lg:text-base">2P</span>
                </div>
              </Link>
            <span className="text-xs sm:text-sm text-blue-100 font-medium hidden xl:block truncate ml-4">
              Enterprise Results, Without Enterprise Costs
            </span>
          </div>
          
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-3 flex-shrink-0">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`font-medium transition-colors text-xs xl:text-sm whitespace-nowrap px-3 py-2 rounded-lg hover:bg-blue-700/50 drop-shadow-lg ${
                  location === item.href 
                    ? 'text-white bg-blue-700/50 border border-blue-500' 
                    : 'text-blue-100 hover:text-white'
                }`}
              >
                <span className="xl:hidden">{item.name.split(' ')[0]}</span>
                <span className="hidden xl:inline">{item.name}</span>
              </Link>
            ))}
            {/* Smart Get Quote CTA with Liquid Fill Animation */}
            <motion.div className="relative ml-2">
              <Link href="/quote">
                <motion.div
                  whileHover="hover"
                  whileTap={{ scale: 0.95 }}
                  className="relative overflow-hidden bg-lime-primary text-white rounded-lg px-3 py-2 text-xs font-semibold cursor-pointer"
                >
                  {/* Liquid fill background */}
                  <motion.div
                    variants={{
                      hover: {
                        scaleX: 1,
                        transition: { duration: 0.4, ease: "easeInOut" }
                      }
                    }}
                    initial={{ scaleX: 0 }}
                    className="absolute inset-0 bg-lime-600 origin-left"
                  />
                  
                  {/* Button text */}
                  <span className="relative z-10 whitespace-nowrap">
                    {smartQuoteText}
                  </span>
                  
                  {/* Shimmer effect */}
                  <motion.div
                    animate={{
                      x: [-100, 200],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                      delay: Math.random() * 2
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-8 skew-x-12"
                  />
                </motion.div>
              </Link>
            </motion.div>
            
            <ContactPopup>
                              <Button 
                  className="bg-blue-700/50 text-white hover:bg-blue-600 text-xs px-3 py-2 whitespace-nowrap ml-2 border border-blue-500"
                  size="sm"
                >
                <Mail className="h-3 w-3 mr-1" />
                <span className="xl:hidden">Contact</span>
                <span className="hidden xl:inline">Contact</span>
              </Button>
            </ContactPopup>
            
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-blue-100 hover:text-white text-xs px-3 py-2" size="sm">
                    <User className="h-3 w-3 mr-1" />
                    <span className="hidden xl:inline">{user?.firstName || 'Account'}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href={user?.role === 'admin' ? '/admin-dashboard' : '/dashboard'} className="flex items-center cursor-pointer">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account-settings" className="flex items-center cursor-pointer">
                      <Settings className="h-4 w-4 mr-2" />
                      Account Settings
                    </Link>
                  </DropdownMenuItem>
                  {user?.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin-dashboard" className="flex items-center cursor-pointer">
                        <Shield className="h-4 w-4 mr-2" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" className="text-blue-100 hover:text-white text-xs px-3 py-2" size="sm">
                    <span className="xl:hidden">Login</span>
                    <span className="hidden xl:inline">Sign In</span>
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-blue-600 text-white hover:bg-blue-700 text-xs px-3 py-2" size="sm">
                    <span className="xl:hidden">Start</span>
                    <span className="hidden xl:inline">Get Started</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="p-2 min-h-[44px] min-w-[44px] text-white hover:bg-white/20 backdrop-blur-sm rounded-xl border border-white/20">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[280px] sm:w-[320px] bg-white/95 backdrop-blur-xl border-l border-gray-200/50">
                <div className="flex flex-col space-y-3 mt-8">
                  <Link
                    href="/"
                    className={`flex items-center space-x-3 font-semibold text-lg transition-all duration-200 p-4 rounded-xl shadow-sm ${
                      location === '/' 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                        : 'text-gray-700 hover:bg-gray-50 hover:shadow-md border border-gray-100'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Home className="h-5 w-5" />
                    <span>Home</span>
                  </Link>
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`font-semibold text-lg transition-all duration-200 p-4 rounded-xl shadow-sm ${
                        location === item.href 
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                          : 'text-gray-700 hover:bg-gray-50 hover:shadow-md border border-gray-100'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  

                  {isAuthenticated ? (
                    <div className="space-y-2 pt-4 border-t">
                      <Link href={user?.role === 'admin' ? '/admin-dashboard' : '/dashboard'} onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Dashboard
                        </Button>
                      </Link>
                      <Link href="/profile-setup" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start">
                          <Settings className="h-4 w-4 mr-2" />
                          Profile Settings
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-red-600"
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4 pt-8 border-t border-gray-200">
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full py-4 font-semibold rounded-xl border-2 hover:bg-gray-50">
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/signup" onClick={() => setIsOpen(false)}>
                        <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 py-4 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                          Get Started
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
    </>
  );
}
