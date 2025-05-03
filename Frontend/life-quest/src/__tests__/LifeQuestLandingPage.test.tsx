import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
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
  const MockButton = ({ children, onClick, type, shape, size }) => (
    <button onClick={onClick} data-testid="button">
      {children}
    </button>
  );
  
  const Typography = {
    Title: ({ children, level }) => <div data-testid={`title-${level || 1}`}>{children}</div>,
    Paragraph: ({ children }) => <p data-testid="paragraph">{children}</p>,
    Text: ({ children }) => <span data-testid="text">{children}</span>,
  };
  
  const Row = ({ children }) => <div data-testid="row">{children}</div>;
  const Col = ({ children }) => <div data-testid="col">{children}</div>;
  const Space = ({ children }) => <div data-testid="space">{children}</div>;
  
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
    render(<LifeQuestLandingPage />);
    
    // Instead of looking for text directly, look for elements with data-testid
    expect(screen.getByTestId('title-3')).toHaveTextContent('Life Quest');
    
    // Check if the hero section content is rendered
    expect(screen.getByTestId('title-1')).toHaveTextContent('Level Up Your Life');
    
    const paragraphs = screen.getAllByTestId('paragraph');
    // Find the paragraph that contains the expected text
    const heroParaContent = paragraphs.find(p => 
      p.textContent?.includes('Our gamified self-improvement app')
    );
    expect(heroParaContent).toBeTruthy();

    // Check if the "Get Started" buttons are present
    const getStartedButtons = screen.getAllByTestId('button');
    const startButtons = getStartedButtons.filter(b => b.textContent === 'Get Started');
    expect(startButtons.length).toBeGreaterThanOrEqual(1);
  });

  it('navigates to auth page when Get Started button is clicked', () => {
    render(<LifeQuestLandingPage />);
    
    const getStartedButtons = screen.getAllByTestId('button')
      .filter(btn => btn.textContent === 'Get Started');
    fireEvent.click(getStartedButtons[0]);
    
    expect(pushMock).toHaveBeenCalledWith('/auth-page');
  });

  it('expands feature sections when Learn More is clicked', () => {
    render(<LifeQuestLandingPage />);
    
    // Find a Learn More text
    const activitySection = screen.getAllByTestId('col')
      .find(col => within(col).queryByText('Activity Tracking') !== null);
    
    expect(activitySection).toBeTruthy();
    
    if (activitySection) {
      const learnMore = within(activitySection).getByText('Learn More');
      
      // Click to expand
      fireEvent.click(learnMore);
      
      // Check if expanded content is shown
      const expandedContent = within(activitySection).queryByText('Customized workout plans');
      expect(expandedContent).toBeTruthy();
      
      // Click again to collapse
      fireEvent.click(learnMore);
    }
  });

  it('renders all feature sections', () => {
    render(<LifeQuestLandingPage />);
    
    // Look for specific feature section heads
    const activityTitle = screen.getAllByText('Activity Tracking');
    expect(activityTitle.length).toBeGreaterThanOrEqual(1);
    
    const nutritionTitle = screen.getAllByText('Nutrition Planning');
    expect(nutritionTitle.length).toBeGreaterThanOrEqual(1);
    
    const productivityTitle = screen.getAllByText('Productivity Boost');
    expect(productivityTitle.length).toBeGreaterThanOrEqual(1);
    
    // Check for feature content by testing data-testid paragraphs
    const paragraphs = screen.getAllByTestId('paragraph');
    
    // Check for activity content
    const activityContent = paragraphs.some(p => 
      p.textContent?.includes('Track your workouts, step count, and physical activities')
    );
    expect(activityContent).toBeTruthy();
    
    // Check for nutrition content
    const nutritionContent = paragraphs.some(p => 
      p.textContent?.includes('Get personalized meal plans and nutrition tracking')
    );
    expect(nutritionContent).toBeTruthy();
    
    // Check for productivity content
    const productivityContent = paragraphs.some(p => 
      p.textContent?.includes('Turn your tasks into quests with our productivity system')
    );
    expect(productivityContent).toBeTruthy();
  });

  it('renders the avatar evolution section', () => {
    render(<LifeQuestLandingPage />);
    
    // Check for avatar section texts in data-testid elements
    const textElements = screen.getAllByTestId('text');
    const labelElement = textElements.find(text => text.textContent === 'Avatar Evolution');
    expect(labelElement).toBeTruthy();
    
    const titleElements = screen.getAllByTestId('title-1');
    const avatarTitle = titleElements.find(title => 
      title.textContent?.includes('Watch Your Avatar Grow')
    );
    expect(avatarTitle).toBeTruthy();
    
    // Check for steps content
    const stepTitles = screen.getAllByTestId('title-5');
    const completeQuestsStep = stepTitles.find(title => 
      title.textContent === 'Complete Daily Quests'
    );
    expect(completeQuestsStep).toBeTruthy();
    
    const paragraphs = screen.getAllByTestId('paragraph');
    const accomplishTasksDesc = paragraphs.some(p => 
      p.textContent?.includes('Accomplish your daily tasks')
    );
    expect(accomplishTasksDesc).toBeTruthy();
  });

  it('renders the footer with correct content', () => {
    render(<LifeQuestLandingPage />);
    
    // Look for the footer by finding sections at the bottom
    const titleElements = screen.getAllByTestId('title-4');
    const footerTitle = titleElements.find(title => title.textContent === 'Life Quest');
    expect(footerTitle).toBeTruthy();
    
    // Check for links
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
    
    // Check for specific link URLs that should exist
    const homeLink = links.find(link => link.getAttribute('href') === '/');
    expect(homeLink).toBeTruthy();
    
    // Check footer paragraph content
    const paragraphs = screen.getAllByTestId('paragraph');
    const footerParagraph = paragraphs.some(p => 
      p.textContent?.includes('Transform your daily habits into epic quests')
    );
    expect(footerParagraph).toBeTruthy();
  });

  it('renders the CTA section', () => {
    render(<LifeQuestLandingPage />);
    
    // Check for CTA title and content
    const titleElements = screen.getAllByTestId('title-1');
    const ctaTitle = titleElements.find(title => 
      title.textContent === 'Start Your Life Quest Today'
    );
    expect(ctaTitle).toBeTruthy();
    
    const paragraphs = screen.getAllByTestId('paragraph');
    const ctaParagraph = paragraphs.some(p => 
      p.textContent?.includes('Join thousands of users')
    );
    expect(ctaParagraph).toBeTruthy();
  });

  it('renders images throughout the page', () => {
    render(<LifeQuestLandingPage />);
    
    const images = screen.getAllByTestId('mock-image');
    expect(images.length).toBeGreaterThan(0);
  });
});