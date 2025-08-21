import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

export const SEO = ({
  title = '2PBAL - Small Business Growth & Sales Boost | Free Consultation | Installment Plans',
  description = '2PBAL helps small businesses and startups grow, boost sales, and dominate online competition. Get free business consultation, affordable installment plans, and dedicated team support. Save 70% vs agencies. Perfect for business growth and digital transformation.',
  keywords = 'small business growth, startup help, sales boost, online competition, brand growth, free business consultation, affordable digital services, installment plans, cheap web development, small business marketing, startup digital solutions, business growth services, dedicated team, cost-effective, web development, digital marketing, AI automation',
  image = 'https://res.cloudinary.com/ppbal/image/upload/v1755703718/2pbal_logo_cz5r0u.png',
  url = 'https://2pbal.com',
  type = 'website',
  publishedTime,
  modifiedTime,
  author = '2PBAL',
  section,
  tags = []
}: SEOProps) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta tags
    const updateMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    const updatePropertyTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Update primary meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', author);

    // Update Open Graph tags
    updatePropertyTag('og:title', title);
    updatePropertyTag('og:description', description);
    updatePropertyTag('og:image', image);
    updatePropertyTag('og:url', url);
    updatePropertyTag('og:type', type);

    // Update Twitter tags
    updatePropertyTag('twitter:title', title);
    updatePropertyTag('twitter:description', description);
    updatePropertyTag('twitter:image', image);
    updatePropertyTag('twitter:url', url);

    // Update additional Open Graph tags if provided
    if (publishedTime) {
      updatePropertyTag('article:published_time', publishedTime);
    }
    if (modifiedTime) {
      updatePropertyTag('article:modified_time', modifiedTime);
    }
    if (author) {
      updatePropertyTag('article:author', author);
    }
    if (section) {
      updatePropertyTag('article:section', section);
    }
    if (tags.length > 0) {
      tags.forEach(tag => {
        const meta = document.createElement('meta');
        meta.setAttribute('property', 'article:tag');
        meta.content = tag;
        document.head.appendChild(meta);
      });
    }

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;

  }, [title, description, keywords, image, url, type, publishedTime, modifiedTime, author, section, tags]);

  return null;
};
