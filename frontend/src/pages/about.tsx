
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Target, Lightbulb, Award } from 'lucide-react';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { SEO } from '@/components/ui/seo';

export default function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO 
        title="About 2PBAL - Our Story, Mission & Founding Team | Digital Solutions"
        description="Learn about 2PBAL's journey from a simple question to a powerful business solution. Meet our founding team of Misheck Serima (CEO), Elton Huche, and Makanaka Mukorombindo (CTO). Discover our mission to bridge the digital gap for small businesses."
        keywords="about 2PBAL, founding team, Misheck Serima, Elton Huche, Makanaka Mukorombindo, business story, digital solutions, small business, startup, company mission, team values"
        url="https://2pbal.com/about"
      />
      <div className="pt-16 lg:pt-20 min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-teal-600 to-blue-700 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 text-white">
              About 2PBAL
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed text-blue-100 font-body">
              Empowering small businesses with the tools and support they need to succeed in today's fast-moving digital world.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Origin Story */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-heading font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-6 text-gray-600 leading-relaxed font-body">
                <p>
                  2PBAL was born from a shared vision — to empower small businesses with the tools and support they need to succeed in today's fast-moving digital world.
                </p>
                <p>
                  It all began when Elton, one of our co-founders, approached Misheck Serima with a question: 
                  <span className="font-semibold text-teal-600"> "How would you bridge the gap for small businesses struggling to grow and stand out?"</span>
                </p>
                <p>
                  That single conversation uncovered a deep need in the market — a gap where startups and small businesses lacked the guidance, digital presence, and technical solutions required to scale effectively.
                </p>
                <p>
                  With a passion for innovation and impact, Misheck took the lead as CEO and reached out to his former schoolmate, Makanaka Mukorombindo, a skilled developer and business strategist with strong expertise in business development and systems design.
                </p>
                <p>
                  Recognizing his talent and leadership in technology, Makanaka was officially appointed as the Chief Technology Officer (CTO) of 2PBAL.
                </p>
                <p className="font-semibold">
                  Together, the three visionaries — Misheck, Elton, and Makanaka — laid the foundation of what would become a powerful platform for business transformation.
                </p>
              </div>
            </motion.div>
            <motion.div 
              className="flex items-center justify-center"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="w-full max-w-md shadow-xl">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mb-4">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-heading">Our Mission</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 font-body">
                    Bridge the digital gap for small businesses by providing comprehensive tools, guidance, and technical solutions for effective scaling.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Founding Team */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">Our Founding Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-body">
              Meet the visionaries who transformed a simple question into a powerful business solution.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Misheck Serima */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="mx-auto w-20 h-20 bg-gradient-to-br from-teal-600 to-blue-600 rounded-full flex items-center justify-center mb-4">
                    <Users className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-xl font-heading">Misheck Serima</CardTitle>
                  <CardDescription className="text-teal-600 font-semibold font-body">Co-Founder & CEO</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 font-body">
                    Visionary leader with a drive to solve real-world business problems through technology.
                  </p>
                  <Badge variant="secondary" className="mt-3">Leadership</Badge>
                </CardContent>
              </Card>
            </motion.div>

            {/* Elton Huche */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="mx-auto w-20 h-20 bg-gradient-to-br from-lime-500 to-teal-600 rounded-full flex items-center justify-center mb-4">
                    <Lightbulb className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-xl font-heading">Elton Huche</CardTitle>
                  <CardDescription className="text-lime-600 font-semibold font-body">Co-Founder</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 font-body">
                    The originator of the idea to help small businesses bridge their digital gaps.
                  </p>
                  <Badge variant="secondary" className="mt-3">Innovation</Badge>
                </CardContent>
              </Card>
            </motion.div>

            {/* Makanaka Mukorombindo */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
                    <Award className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-xl font-heading">Makanaka Mukorombindo</CardTitle>
                  <CardDescription className="text-blue-600 font-semibold font-body">Chief Technology Officer</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 font-body">
                    Technical strategist and co-developer of the company's foundational systems and website.
                  </p>
                  <Badge variant="secondary" className="mt-3">Technology</Badge>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 font-body">
              The principles that drive everything we do at 2PBAL.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="mx-auto w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-heading font-semibold text-gray-900 mb-2">Precision</h3>
                <p className="text-sm text-gray-600 font-body">
                  Precise programming and solutions tailored to your exact business needs.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="mx-auto w-12 h-12 bg-lime-500 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-heading font-semibold text-gray-900 mb-2">Partnership</h3>
                <p className="text-sm text-gray-600 font-body">
                  Building lasting relationships with our clients for mutual growth.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="mx-auto w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <Lightbulb className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-heading font-semibold text-gray-900 mb-2">Innovation</h3>
                <p className="text-sm text-gray-600 font-body">
                  Leveraging cutting-edge technology to drive business advancement.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Card className="text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="mx-auto w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-heading font-semibold text-gray-900 mb-2">Excellence</h3>
                <p className="text-sm text-gray-600 font-body">
                  Delivering exceptional results that exceed expectations.
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}