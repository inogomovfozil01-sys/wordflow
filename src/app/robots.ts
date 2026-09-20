import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://wordflow.app';

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/dictionary', '/dictionary/*', '/learn', '/practice', '/about', '/privacy', '/terms'],
      disallow: ['/dashboard', '/review', '/settings', '/admin', '/api/*'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
