import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Target, Award, Heart, Code, TrendingUp, Shield, Zap } from 'lucide-react';
import { Link } from 'wouter';

export default function About() {
  const values = [
    {
      icon: Target,
      title: "Strategic Focus",
      description: "We align every solution with your business goals and growth objectives."
    },
    {
      icon: Code,
      title: "Technical Excellence",
      description: "Cutting-edge technology and best practices in every project we deliver."
    },
    {
      icon: Heart,
      title: "Client Partnership",
      description: "We treat your success as our success, building long-term relationships."
    },
    {
      icon: TrendingUp,
      title: "Results-Driven",
      description: "Every solution is designed to deliver measurable business impact."
    }
  ];

  const team = [
    {
      name: "Development Team",
      role: "Full-Stack Engineers",
      description: "Expert developers specializing in modern web technologies and scalable architectures."
    },
    {
      name: "Design Team",
      role: "UX/UI Specialists",
      description: "Creative designers focused on user experience and conversion optimization."
    },
    {
      name: "Marketing Team",
      role: "Growth Strategists",
      description: "Digital marketing experts driving traffic, leads, and revenue growth."
    },
    {
      name: "Consulting Team",
      role: "Business Advisors",
      description: "Strategic consultants helping optimize your business processes and operations."
    }
  ];

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 via-white to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                About <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">Precise Programming</span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed">
                We're a full-time platform dedicated to planning, creating, growing, and marketing your business with affordable packaged digital services.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                To democratize access to enterprise-level digital solutions by providing affordable, 
                comprehensive services that help businesses of all sizes compete and thrive in the digital economy.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We believe every business deserves access to professional digital services without the 
                traditional agency price tag. That's why we've created a platform that combines 
                strategic planning, creative development, growth marketing, and free business consulting 
                into affordable packages.
              </p>
              <Link href="/packages">
                <Button size="lg" className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700">
                  Explore Our Packages
                </Button>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-teal-100 to-blue-100 rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-teal-600 mb-2">200+</div>
                    <div className="text-gray-600">Happy Clients</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">70%</div>
                    <div className="text-gray-600">Average Savings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-teal-600 mb-2">24/7</div>
                    <div className="text-gray-600">Support Available</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
                    <div className="text-gray-600">Satisfaction Rate</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do and every solution we deliver.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Dedicated Teams
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Full-time specialists working exclusively on your projects to ensure consistent quality and results.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                          {member.name}
                        </h3>
                        <p className="text-teal-600 font-medium mb-3">
                          {member.role}
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                          {member.description}
                        </p>
                      </div>
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
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
              Join hundreds of businesses that have already saved money and achieved their goals with our comprehensive digital services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/quote">
                <Button size="lg" variant="secondary" className="bg-white text-teal-600 hover:bg-gray-100">
                  Get Free Consultation
                </Button>
              </Link>
              <Link href="/packages">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-teal-600">
                  View Packages
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}