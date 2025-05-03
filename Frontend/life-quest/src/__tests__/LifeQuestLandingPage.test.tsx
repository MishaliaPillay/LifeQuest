import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LifeQuestLandingPage from '../app/landing-page/landing-page';

// Mock styles
vi.mock('./styles', () => ({
  styles: {
    landingPage: {},
    header: {},
    logo: {},
    logoIcon: {},
    logoTitle: {},
    headerButton: {},
    heroSection: {},
    heroImageContainer: {},
    heroContent: {},
    heroTitle: {},
    heroSubtitle: {},
    heroParagraph: {},
    heroPrimaryButton: {},
    featuresSection: {},
    featuresTitleContainer: {},
    featuresLabel: {},
    featuresTitle: {},
    featureCard: {},
    featureIconContainer: () => ({}),
    featureIcon: () => ({}),
    featureParagraph: {},
    learnMoreButton: () => ({}),
    expandedFeatureContent: () => ({}),
    expandedFeatureList: {},
    avatarSection: {},
    avatarCircle1: {},
    avatarCircle2: {},
    avatarLabel: {},
    avatarTitle: {},
    avatarParagraph: {},
    stepItem: {},
    stepNumber: () => ({}),
    stepNumberText: {},
    stepTitle: {},
    stepDescription: {},
    avatarImageContainer: {},
    appFeaturesSection: {},
    featureItem: {},
    ctaSection: {},
    ctaCircle1: {},
    ctaCircle2: {},
    ctaContent: {},
    ctaTitle: {},
    ctaParagraph: {},
    footer: {},
    footerLogo: {},
    footerLogoIcon: {},
    footerLogoTitle: {},
    footerParagraph: {},
    footerLinkTitle: {},
    footerLinksContainer: {},
    footerLink: {},
  },
}));

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt }) => <img src={src} alt={alt} data-testid="mock-image" />
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ href, children }) => <a href={href}>{children}</a>
}));

// Mock next/navigation
const pushMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

// Mock antd components
vi.mock('antd', () => {
  const antd = vi.importActual('antd');
  const MockButton = ({ children, onClick, type, shape, size, style }) => (
    <button onClick={onClick} data-type={type} data-shape={shape} data-size={size}>
      {children}
    </button>
  );
  
  const Typography = {
    Title: ({ level, style, children }) => <div data-level={level}>{children}</div>,
    Paragraph: ({ style, children }) => <p>{children}</p>,
    Text: ({ style, children }) => <span>{children}</span>,
  };
  
  const Row = ({ gutter, align, children, style }) => <div data-testid="row">{children}</div>;
  const Col = ({ xs, sm, md, children, style }) => <div data-testid="col">{children}</div>;
  const Space = ({ size, direction, style, children }) => <div data-testid="space">{children}</div>;
  
  return {
    Button: MockButton,
    Typography,
    Row,
    Col,
    Space,
  };
});

// Mock antd icons
vi.mock('@ant-design/icons', () => ({
  RocketOutlined: () => <span data-testid="icon-rocket">🚀</span>,
  FireOutlined: () => <span data-testid="icon-fire">🔥</span>,
  TrophyOutlined: () => <span data-testid="icon-trophy">🏆</span>,
  HeartOutlined: () => <span data-testid="icon-heart">❤️</span>,
  DownOutlined: () => <span data-testid="icon-down">⬇️</span>,
  UpOutlined: () => <span data-testid="icon-up">⬆️</span>,
}));

describe('LifeQuestLandingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the landing page with correct title and buttons', () => {
    const { container } = render(<LifeQuestLandingPage />);
    
    // Check if the title is rendered
    expect(screen.getByText(/Life Quest/)).toBeInTheDocument();
    
    // Check if the hero section content is rendered
    expect(screen.getByText(/Level Up Your Life/)).toBeInTheDocument();
    expect(screen.getByText(/Transform your daily habits into epic quests/)).toBeInTheDocument();

    // Check if the "Get Started" buttons are present
    const getStartedButtons = screen.getAllByText(/Get Started/);
    expect(getStartedButtons.length).toBeGreaterThanOrEqual(1);
  });

  it('navigates to auth page when Get Started button is clicked', () => {
    render(<LifeQuestLandingPage />);
    
    const getStartedButtons = screen.getAllByText(/Get Started/);
    fireEvent.click(getStartedButtons[0]);
    
    expect(pushMock).toHaveBeenCalledWith('/auth-page');
  });

  it('expands feature sections when Learn More is clicked', () => {
    render(<LifeQuestLandingPage />);
    
    // Find the Learn More buttons
    const learnMoreButtons = screen.getAllByText(/Learn More/);
    expect(learnMoreButtons.length).toBeGreaterThanOrEqual(1);
    
    // Click to expand
    fireEvent.click(learnMoreButtons[0]);
    
    // Click again to collapse
    fireEvent.click(learnMoreButtons[0]);
  });

  it('renders all feature sections', () => {
    render(<LifeQuestLandingPage />);
    
    // Check for the feature titles
    expect(screen.getByText(/Activity Tracking/)).toBeInTheDocument();
    expect(screen.getByText(/Nutrition Planning/)).toBeInTheDocument();
    expect(screen.getByText(/Productivity Boost/)).toBeInTheDocument();
    
    // Check for content in features sections
    expect(screen.getByText(/Track your workouts, step count, and physical activities/)).toBeInTheDocument();
    expect(screen.getByText(/Get personalized meal plans and nutrition tracking/)).toBeInTheDocument();
    expect(screen.getByText(/Turn your tasks into quests with our productivity system/)).toBeInTheDocument();
  });

  it('renders the avatar evolution section', () => {
    render(<LifeQuestLandingPage />);
    
    expect(screen.getByText(/Avatar Evolution/)).toBeInTheDocument();
    expect(screen.getByText(/Watch Your Avatar Grow/)).toBeInTheDocument();
    
    // Check for steps content
    expect(screen.getByText(/Complete Daily Quests/)).toBeInTheDocument();
    expect(screen.getByText(/Accomplish your daily tasks/)).toBeInTheDocument();
  });

  it('renders the footer with correct content', () => {
    render(<LifeQuestLandingPage />);
    
    expect(screen.getByText(/Links/)).toBeInTheDocument();
    expect(screen.getByText(/Features/)).toBeInTheDocument();
    
    // Check for links
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });

  it('renders the CTA section', () => {
    render(<LifeQuestLandingPage />);
    
    expect(screen.getByText(/Start Your Life Quest Today/)).toBeInTheDocument();
    expect(screen.getByText(/Join thousands of users/)).toBeInTheDocument();
  });

  it('renders images throughout the page', () => {
    render(<LifeQuestLandingPage />);
    
    const images = screen.getAllByTestId('mock-image');
    expect(images.length).toBeGreaterThan(0);
  });
});