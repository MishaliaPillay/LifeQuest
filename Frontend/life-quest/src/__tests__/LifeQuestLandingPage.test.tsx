import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent} from '@testing-library/react';
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
  const MockButton = ({ children, onClick }) => (
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
  const Col = ({ children}) => <div data-testid="col">{children}</div>;
  const Space = ({ children}) => <div data-testid="space">{children}</div>;
  
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
    
    // Check for the title using getAllByTestId since there might be multiple title-3 elements
    const titleElements = screen.getAllByTestId('title-3');
    const logoTitle = titleElements.find(title => title.textContent === 'Life Quest');
    expect(logoTitle).toBeTruthy();
    
    // Check if the hero section content is rendered
    const level1Titles = screen.getAllByTestId('title-1');
    const heroTitle = level1Titles.find(title => title.textContent === 'Level Up Your Life');
    expect(heroTitle).toBeTruthy();
    
    const paragraphs = screen.getAllByTestId('paragraph');
    // Find the paragraph that contains the expected text
    const heroParaContent = paragraphs.find(p => 
      p.textContent?.includes('Our gamified self-improvement app')
    );
    expect(heroParaContent).toBeTruthy();

    // Check if the "Get Started" buttons are present
    const getStartedButtons = screen.getAllByTestId('button');
    const startButtons = getStartedButtons.filter(b => b.textContent?.includes('Get Started'));
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
    
    // Find all Learn More buttons
    const learnMoreTexts = screen.getAllByText('Learn More');
    expect(learnMoreTexts.length).toBeGreaterThan(0);
    
    // Find the one in the Activity section
    const learnMoreButton = learnMoreTexts[0]; // First "Learn More" button should be Activity
    
    // Click to expand
    fireEvent.click(learnMoreButton);
    
    // Check if any expanded content is shown - looking for list items
    const expandedList = screen.queryByRole('list');
    expect(expandedList).toBeTruthy();
    
    // Verify some of the content is there
    const listItems = screen.getAllByRole('listitem');
    expect(listItems.length).toBeGreaterThan(0);
    
    // At least one item contains the expected text
    const hasExpectedItem = listItems.some(item => 
      item.textContent?.includes('workout') || 
      item.textContent?.includes('fitness') ||
      item.textContent?.includes('challenges')
    );
    expect(hasExpectedItem).toBeTruthy();
    
    // Click again to collapse
    fireEvent.click(learnMoreButton);
  });

  it('renders all feature sections', () => {
    render(<LifeQuestLandingPage />);
    
    // Look for specific feature section heads using Title components
    const titleElements = screen.getAllByTestId('title-4');
    
    // Check for required titles
    const activityTitle = titleElements.find(title => title.textContent === 'Activity Tracking');
    expect(activityTitle).toBeTruthy();
    
    const nutritionTitle = titleElements.find(title => title.textContent === 'Nutrition Planning');
    expect(nutritionTitle).toBeTruthy();
    
    const productivityTitle = titleElements.find(title => title.textContent === 'Productivity Boost');
    expect(productivityTitle).toBeTruthy();
    
    // Check for feature content by testing data-testid paragraphs
    const paragraphs = screen.getAllByTestId('paragraph');
    
    // Check for activity content
    const activityContent = paragraphs.some(p => 
      p.textContent?.includes('workouts') && p.textContent?.includes('physical activities')
    );
    expect(activityContent).toBeTruthy();
    
    // Check for nutrition content
    const nutritionContent = paragraphs.some(p => 
      p.textContent?.includes('meal plans') && p.textContent?.includes('nutrition')
    );
    expect(nutritionContent).toBeTruthy();
    
    // Check for productivity content
    const productivityContent = paragraphs.some(p => 
      p.textContent?.includes('tasks') && p.textContent?.includes('productivity')
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