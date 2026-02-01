import type { Metadata } from 'next'

import { DarkSections } from '@/components/DarkSections'
import { Call, Hero, Services, Team } from '@/components/sections'

export const metadata: Metadata = {
  title: 'Multidisciplinary Design Syndicate – KLAD',
  description: 'Klad Syndicate is a multidisciplinary design studio offering comprehensive solutions for ambitious brands. Every design we deliver is original and every project is approached as a unique challenge. We see our clients as long-term partners, helping them reach new heights in how they express themselves and present their identity.',
}

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'Klad Syndicate',
    'alternateName': 'KLAD',
    'description': 'Multidisciplinary design studio working across branding, web, UI/UX, 3D and motion for ambitious brands.',
    'foundingDate': '2020',
    'url': 'https://klad.design',
    'logo': 'https://klad.design/images/logotype.svg',
    'email': 'info@klad.design',
    'telephone': '+995591017066',
    'areaServed': 'Worldwide',
    'industry': [
      'AI',
      'Web3 & Blockchain',
      'Retail & E-commerce',
      'Lifestyle',
      'Food & Beverage',
      'Biotech',
      'Jewelry manufacturing',
      'Banking & finance',
      'Digital marketing',
      'Robotics',
      'Logistics & transportation',
    ],
    'knowsAbout': [
      'Branding',
      'Visual Identity',
      'Web Design',
      'UI/UX',
      '3D Modeling',
      'Motion Design',
      'Frontend Development',
      'Visual Research',
    ],
    'makesOffer': {
      '@type': 'Offer',
      'itemOffered': {
        '@type': 'Service',
        'serviceType': [
          'Visual identity and logotype',
          'Packaging',
          'Signage',
          'Digital and printed material',
          'Web design',
          'UI/UX',
          '3D modeling',
          'Motion design',
          'Visual research',
          'Frontend',
        ],
      },
    },
    'award': [
      'Awwwards',
      'CSS Design Awards',
      'Behance Featured Project',
    ],
    'sameAs': [
      'https://www.linkedin.com/company/klad',
      'https://www.behance.net/klad_design',
      'https://www.instagram.com/klad_syndicate/',
      'https://dribbble.com/klad-design',
      'https://www.pinterest.com/klad_design/',
    ],
    'member': [
      {
        '@type': 'Person',
        'name': 'Egor Zmaznev',
        'jobTitle': 'Co-founder',
      },
      {
        '@type': 'Person',
        'name': 'Daria Kravchenko',
        'jobTitle': 'Co-founder',
      },
      {
        '@type': 'Person',
        'name': 'Ksenia Leonteva',
        'jobTitle': 'Co-founder & Web Designer',
      },
      {
        '@type': 'Person',
        'name': 'Lena Riazantseva',
        'jobTitle': 'Art Direction & Brand Design',
      },
      {
        '@type': 'Person',
        'name': 'Lena Sivakova',
        'jobTitle': '3D and Motion Designer',
      },
    ],
  }

  return (
    <>
      <Hero />
      <Services />
      <Team />
      <Call />
      <DarkSections>
        <Hero />
        <Services />
        <Team />
        <Call />
      </DarkSections>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
    </>
  )
}
