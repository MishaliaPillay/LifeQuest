// styles.tsx
import { CSSProperties } from 'react';

export const styles = {
  landingPage: {
    overflowX: 'hidden' as const,
    fontFamily: 'sans-serif'
  },
  header: {
    padding: '16px 48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'linear-gradient(90deg, #FF416C 0%, #FF4B2B 100%)',
    color: 'white',
    flexWrap: 'wrap' as const,
    gap: '16px'
  },
  logo: {
    display: 'flex',
    alignItems: 'center'
  },
  logoIcon: {
    fontSize: '28px',
    marginRight: '8px'
  },
  logoTitle: {
    margin: 0,
    color: 'white'
  },
  headerButton: {
    background: '#FF5E62',
    borderColor: '#FF5E62',
    boxShadow: '0 4px 8px rgba(255, 94, 98, 0.3)'
  },
  heroSection: {
    padding: '80px 48px',
    background: 'linear-gradient(135deg, #9733EE 0%, #DA22FF 100%)',
    color: 'white',
    position: 'relative' as const,
    overflow: 'hidden'
  },
  heroImageContainer: {
    position: 'absolute' as const,
    top: '15%',
    right: '2%',
    width: '50%',
    height: '80%',
    zIndex: 1
  },
  heroCircle1: {
    position: 'absolute' as const,
    bottom: '10%',
    left: '10%',
    width: '200px',
    height: '200px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
    zIndex: 0
  },
  heroCircle2: {
    position: 'absolute' as const,
    top: '20%',
    right: '30%',
    width: '100px',
    height: '100px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
    zIndex: 0
  },
  heroContent: {
    position: 'relative' as const,
    zIndex: 2
  },
  heroTitle: {
    fontSize: '56px',
    fontWeight: 'bold',
    marginBottom: '24px',
    color: 'white'
  },
  heroSubtitle: {
    fontWeight: 'normal',
    marginBottom: '32px',
    color: 'rgba(255, 255, 255, 0.9)'
  },
  heroParagraph: {
    fontSize: '18px',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: '40px'
  },
  heroPrimaryButton: {
    background: '#FF8C00',
    borderColor: '#FF8C00',
    height: '50px',
    fontSize: '18px',
    padding: '0 32px',
    boxShadow: '0 4px 8px rgba(255, 140, 0, 0.3)'
  },
  featuresSection: {
    padding: '80px 48px',
    background: 'white'
  },
  featuresTitleContainer: {
  
    marginBottom: '48px'
  },
  featuresLabel: {
    color: '#FF5E62',
    fontWeight: 'bold',
    fontSize: '18px'
  },
  featuresTitle: {
    fontSize: '40px',
    marginTop: '16px'
  },
  featureCard: {
    padding: '32px',
    background: '#F8F9FF',
    borderRadius: '16px',
    height: '100%',
    transition: 'all 0.3s',
    cursor: 'pointer',
  },
  featureIconContainer: (color: string): CSSProperties => ({
    width: '64px',
    height: '64px',
    borderRadius: '12px',
    background: `rgba${color.replace('#', '(').replace(/([0-9a-f]{2})/gi, (match) => parseInt(match, 16) + ',')}0.1)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '24px'
  }),
  featureIcon: (color: string): CSSProperties => ({
    fontSize: '32px',
    color
  }),
  featureParagraph: {
    color: '#666',
    fontSize: '16px'
  },
  learnMoreButton: (color: string): CSSProperties => ({
    color,
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center'
  }),
  expandedFeatureContent: (color: string): CSSProperties => ({
    marginTop: '16px',
    padding: '16px',
    background: `rgba${color.replace('#', '(').replace(/([0-9a-f]{2})/gi, (match) => parseInt(match, 16) + ',')}0.05)`,
    borderRadius: '8px',
    border: `1px solid rgba${color.replace('#', '(').replace(/([0-9a-f]{2})/gi, (match) => parseInt(match, 16) + ',')}0.2)`
  }),
  expandedFeatureList: {
    paddingLeft: '20px',
    margin: '0'
  },
  avatarSection: {
    padding: '80px 48px',
    background: 'linear-gradient(135deg, #FFF0F5 0%, #FFE6EE 100%)',
    position: 'relative' as const,
    overflow: 'hidden'
  },
  avatarCircle1: {
    position: 'absolute' as const,
    top: '10%',
    right: '5%',
    width: '100px',
    height: '100px',
    background: 'rgba(106, 17, 203, 0.1)',
    borderRadius: '50%',
    zIndex: 0
  },
  avatarCircle2: {
    position: 'absolute' as const,
    bottom: '20%',
    left: '5%',
    width: '150px',
    height: '150px',
    background: 'rgba(255, 94, 98, 0.1)',
    borderRadius: '50%',
    zIndex: 0
  },
  avatarLabel: {
    color: '#FF5E62',
    fontWeight: 'bold',
    fontSize: '18px'
  },
  avatarTitle: {
    fontSize: '40px',
    marginTop: '16px'
  },
  avatarParagraph: {
    fontSize: '18px',
    color: '#666',
    marginBottom: '32px'
  },
  stepItem: {
    display: 'flex',
    alignItems: 'center'
  },
  stepNumber: (color: string): CSSProperties => ({
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: `rgba${color.replace('#', '(').replace(/([0-9a-f]{2})/gi, (match) => parseInt(match, 16) + ',')}0.1)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '16px'
  }),
  stepNumberText: {
    fontSize: '24px'
  },
  stepTitle: {
    margin: 0
  },
  stepDescription: {
    margin: 0,
    color: '#666'
  },
  avatarImageContainer: {
    width: '100%',
    height: '500px',
    position: 'relative' as const
  },
  appFeaturesSection: {
    padding: '80px 48px',
    background: 'white'
  },
  featureItem: {
    display: 'flex',
    alignItems: 'flex-start'
  },
  ctaSection: {
    padding: '80px 48px',
    background: 'linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%)',
    color: 'white',
    position: 'relative' as const,
    overflow: 'hidden',
    textAlign: 'center' as const
  },
  ctaCircle1: {
    position: 'absolute' as const,
    top: '10%',
    right: '5%',
    width: '200px',
    height: '200px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
    zIndex: 0
  },
  ctaCircle2: {
    position: 'absolute' as const,
    bottom: '10%',
    left: '5%',
    width: '150px',
    height: '150px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
    zIndex: 0
  },
  ctaContent: {
    maxWidth: '800px',
    margin: '0 auto',
    position: 'relative' as const,
    zIndex: 1
  },
  ctaTitle: {
    color: 'white',
    fontSize: '48px'
  },
  ctaParagraph: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '20px',
    marginBottom: '40px'
  },
  footer: {
    padding: '48px',
    background: '#3A0F54',
    color: 'white'
  },
  footerLogo: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '24px'
  },
  footerLogoIcon: {
    fontSize: '24px',
    marginRight: '8px'
  },
  footerLogoTitle: {
    margin: 0,
    color: 'white'
  },
  footerParagraph: {
    color: 'rgba(255, 255, 255, 0.6)'
  },
  footerLinkTitle: {
    color: 'white'
  },
  footerLinksContainer: {
    display: 'flex',
    flexDirection: 'column' as const
  },
  footerLink: {
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: '12px'
  }
};