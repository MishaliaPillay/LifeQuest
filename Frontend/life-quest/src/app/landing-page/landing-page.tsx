"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { Button, Row, Col, Typography, Space } from 'antd';
import { RocketOutlined, FireOutlined, TrophyOutlined, HeartOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { styles } from './styles';

const { Title, Paragraph, Text } = Typography;

const LifeQuestLandingPage: React.FC = () => {
  const [expandedFeatures, setExpandedFeatures] = useState<Record<string, boolean>>({
    activity: false,
    nutrition: false,
    productivity: false
  });
  
  return (
    <div className="landing-page" style={styles.landingPage}>
      {/* Header */}
      <header style={styles.header}>
        <div className="logo" style={styles.logo}>
          <RocketOutlined style={styles.logoIcon} />
          <Title level={3} style={styles.logoTitle}>Life Quest</Title>
        </div>
       
        <Button type="primary" shape="round" size="large" style={styles.headerButton}>
          Get Started
        </Button>
      </header>

      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroImageContainer}>
          {/* Hero image placeholder */}
          <Image 
            src="/images/trophy.png"
            alt="Hero" 
            layout="fill" 
            objectFit="contain"
          />
        </div>
        
        <div style={styles.heroCircle1} />
        <div style={styles.heroCircle2} />
        
        <Row gutter={48} style={styles.heroContent}>
          <Col xs={24} md={12}>
            <Title style={styles.heroTitle}>
              Level Up Your Life
            </Title>
            <Title level={3} style={styles.heroSubtitle}>
              Transform your daily habits into epic quests and watch yourself evolve in real-time
            </Title>
            <Paragraph style={styles.heroParagraph}>
              Our gamified self-improvement app helps you build better habits, track progress, and achieve your goals across fitness, nutrition, productivity, and emotional wellbeing.
            </Paragraph>
            <Space size="large">
              <Button type="primary" shape="round" size="large" style={styles.heroPrimaryButton}>
                Get Started
              </Button>
            </Space>
       </Col>
        </Row>
      </section>

      {/* Features Section */}
      <section style={styles.featuresSection}>
        <div style={styles.featuresTitleContainer}>
          <Text style={styles.featuresLabel}>Why Choose Life Quest</Text>
          <Title style={styles.featuresTitle}>
            Transform Your Life With
            <br />
            Gamified Self-Improvement
          </Title>
        </div>

        <Row gutter={[48, 48]} style={{ marginTop: '64px' }}>
          <Col xs={24} md={8}>
            <div style={styles.featureCard}>
              <div style={styles.featureIconContainer('#6a11cb')}>
                <FireOutlined style={styles.featureIcon('#6a11cb')} />
              </div>
              <Title level={4}>Activity Tracking</Title>
              <Paragraph style={styles.featureParagraph}>
                Track your workouts, step count, and physical activities with gamified challenges that make fitness fun and rewarding.
              </Paragraph>
              <div>
                <div 
                  onClick={() => setExpandedFeatures(prev => ({ ...prev, activity: !prev.activity }))}
                  style={styles.learnMoreButton('#9733EE')}
                >
                  Learn More
                  {expandedFeatures.activity ? 
                    <UpOutlined style={{ marginLeft: '5px' }} /> : 
                    <DownOutlined style={{ marginLeft: '5px' }} />
                  }
                </div>
                
                {expandedFeatures.activity && (
                  <div style={styles.expandedFeatureContent('#9733EE')}>
                    <Paragraph style={{ color: '#666', margin: 0 }}>
                      <ul style={styles.expandedFeatureList}>
                        <li>Customized workout plans based on your fitness level</li>
                        <li>Integration with popular fitness trackers</li>
                        <li>Weekly challenges to keep you motivated</li>
                        <li>Progress tracking with detailed statistics</li>
                      </ul>
                    </Paragraph>
                  </div>
                )}
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <div style={styles.featureCard}>
              <div style={styles.featureIconContainer('#FF5E62')}>
                <HeartOutlined style={styles.featureIcon('#FF5E62')} />
              </div>
              <Title level={4}>Nutrition Planning</Title>
              <Paragraph style={styles.featureParagraph}>
                Get personalized meal plans and nutrition tracking to fuel your body properly while completing food-related quests.
              </Paragraph>
              <div>
                <div 
                  onClick={() => setExpandedFeatures(prev => ({ ...prev, nutrition: !prev.nutrition }))}
                  style={styles.learnMoreButton('#FF5E62')}
                >
                  Learn More
                  {expandedFeatures.nutrition ? 
                    <UpOutlined style={{ marginLeft: '5px' }} /> : 
                    <DownOutlined style={{ marginLeft: '5px' }} />
                  }
                </div>
                
                {expandedFeatures.nutrition && (
                  <div style={styles.expandedFeatureContent('#FF5E62')}>
                    <Paragraph style={{ color: '#666', margin: 0 }}>
                      <ul style={styles.expandedFeatureList}>
                        <li>Personalized meal plans based on your dietary needs</li>
                        <li>Food logging with barcode scanning</li>
                        <li>Nutritional insights and recommendations</li>
                        <li>Hydration tracking and reminders</li>
                      </ul>
                    </Paragraph>
                  </div>
                )}
              </div>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div style={styles.featureCard}>
              <div style={styles.featureIconContainer('#2575fc')}>
                <TrophyOutlined style={styles.featureIcon('#2575fc')} />
              </div>
              <Title level={4}>Productivity Boost</Title>
              <Paragraph style={styles.featureParagraph}>
                Turn your tasks into quests with our productivity system that helps you build habits and achieve your goals.
              </Paragraph>
              <div>
                <div 
                  onClick={() => setExpandedFeatures(prev => ({ ...prev, productivity: !prev.productivity }))}
                  style={styles.learnMoreButton('#FF8C00')}
                >
                  Learn More
                  {expandedFeatures.productivity ? 
                    <UpOutlined style={{ marginLeft: '5px' }} /> : 
                    <DownOutlined style={{ marginLeft: '5px' }} />
                  }
                </div>
                
                {expandedFeatures.productivity && (
                  <div style={styles.expandedFeatureContent('#FF8C00')}>
                    <Paragraph style={{ color: '#666', margin: 0 }}>
                      <ul style={styles.expandedFeatureList}>
                        <li>Transform tasks into rewarding quests</li>
                        <li>Habit tracking with streak rewards</li>
                        <li>Focus timer with gamified incentives</li>
                        <li>Goal setting with milestone celebrations</li>
                      </ul>
                    </Paragraph>
                  </div>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </section>

      {/* Avatar Evolution Section */}
      <section style={styles.avatarSection}>
        <div style={styles.avatarCircle1} />
        <div style={styles.avatarCircle2} />
        
        <Row gutter={48} align="middle">
          <Col xs={24} md={12}>
           
            <Text style={styles.avatarLabel}>Avatar Evolution</Text>
            <Title style={styles.avatarTitle}>
              Watch Your Avatar Grow
              <br />
              As You Level Up
            </Title>
            <Paragraph style={styles.avatarParagraph}>
              Your virtual avatar visually evolves as you complete quests and improve your habits. See your progress reflected in real-time with unique customization options.
            </Paragraph>
            
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div style={styles.stepItem}>
                <div style={styles.stepNumber('rgba(106, 17, 203)')}>
                  <span style={styles.stepNumberText}>1</span>
                </div>
                <div>
                  <Title level={5} style={styles.stepTitle}>Complete Daily Quests</Title>
                  <Paragraph style={styles.stepDescription}>
                    Accomplish your daily tasks and watch your avatar level up
                  </Paragraph>
                </div>
              </div>
              
              <div style={styles.stepItem}>
                <div style={styles.stepNumber('rgba(255, 94, 98)')}>
                  <span style={styles.stepNumberText}>2</span>
                </div>
                <div>
                  <Title level={5} style={styles.stepTitle}>Unlock New Abilities</Title>
                  <Paragraph style={styles.stepDescription}>
                    Gain new skills and powers as you progress through your journey
                  </Paragraph>
                </div>
              </div>
              
              <div style={styles.stepItem}>
                <div style={styles.stepNumber('rgba(37, 117, 252)')}>
                  <span style={styles.stepNumberText}>3</span>
                </div>
                <div>
                  <Title level={5} style={styles.stepTitle}>Customize Your Character</Title>
                  <Paragraph style={styles.stepDescription}>
                    Personalize your avatar with unique items and accessories
                  </Paragraph>
                </div>
              </div>
            </Space>
          </Col>
          <Col xs={24} md={12} style={{ position: 'relative' }}>
            <div style={styles.avatarImageContainer}>
              {/* Avatar evolution image */}
              <Image 
               src="/images/landing.png"
                alt="Avatar Evolution" 
                layout="fill" 
                objectFit="contain"
              />
            </div>
          </Col>
        </Row>
      </section>

      {/* App Features Section */}
      <section style={styles.appFeaturesSection}>
        <div style={styles.featuresTitleContainer}>
          <Text style={styles.featuresLabel}>Key Features</Text>
          <Title style={styles.featuresTitle}>
            Life Quest - Four Pillars of
            <br />
            Holistic Self-Improvement
          </Title>
        </div>

        <Row gutter={[32, 64]}>
          <Col xs={24} sm={12}>
            <div style={styles.featureItem}>
              <div style={styles.featureIconContainer('#6a11cb')}>
                <FireOutlined style={styles.featureIcon('#6a11cb')} />
              </div>
              <div>
                <Title level={4}>Activity</Title>
                <Paragraph style={styles.featureParagraph}>
                  Track your workouts, step count, and physical activities with gamified challenges. Connect with fitness trackers and wellness devices to automatically log your progress.
                </Paragraph>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12}>
            <div style={styles.featureItem}>
              <div style={styles.featureIconContainer('#FF5E62')}>
                <HeartOutlined style={styles.featureIcon('#FF5E62')} />
              </div>
              <div>
                <Title level={4}>Nutrition</Title>
                <Paragraph style={styles.featureParagraph}>
                  Get personalized meal plans and nutrition tracking to fuel your body properly. Complete food-related quests and maintain a balanced diet with our smart recommendations.
                </Paragraph>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12}>
            <div style={styles.featureItem}>
              <div style={styles.featureIconContainer('#2575fc')}>
                <TrophyOutlined style={styles.featureIcon('#2575fc')} />
              </div>
              <div>
                <Title level={4}>Productivity</Title>
                <Paragraph style={styles.featureParagraph}>
                  Turn your tasks into quests with our productivity system. Build habits, achieve goals, and stay motivated with rewards and achievements that make work feel like play.
                </Paragraph>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12}>
            <div style={styles.featureItem}>
              <div style={styles.featureIconContainer('#FFA800')}>
                <span style={{ fontSize: '32px', color: '#FFA800' }}>😊</span>
              </div>
              <div>
                <Title level={4}>Mood</Title>
                <Paragraph style={styles.featureParagraph}>
                  Track your emotional wellbeing with AI-powered journaling. Use text or voice entries to log your feelings, and receive insights and suggestions to improve your mental health.
                </Paragraph>
              </div>
            </div>
          </Col>
        </Row>
      </section>

      {/* CTA Section */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaCircle1} />
        <div style={styles.ctaCircle2} />
        
        <div style={styles.ctaContent}>
          <Title style={styles.ctaTitle}>
            Start Your Life Quest Today
          </Title>
          <Paragraph style={styles.ctaParagraph}>
            Join thousands of users who are already leveling up their lives with our gamified self-improvement app.
          </Paragraph>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <Row gutter={[48, 32]}>
          <Col xs={24} sm={12} md={8}>
            <div style={styles.footerLogo}>
              <RocketOutlined style={styles.footerLogoIcon} />
              <Title level={4} style={styles.footerLogoTitle}>Life Quest</Title>
            </div>
            <Paragraph style={styles.footerParagraph}>
              Transform your daily habits into epic quests and watch yourself evolve in real-time with our gamified self-improvement app.
            </Paragraph>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Title level={5} style={styles.footerLinkTitle}>Links</Title>
            <div style={styles.footerLinksContainer}>
              <Link href="/" style={styles.footerLink}>Home</Link>
              <Link href="/features" style={styles.footerLink}>Features</Link>
              <Link href="/about" style={styles.footerLink}>About</Link>
              <Link href="/blog" style={styles.footerLink}>Blog</Link>
              <Link href="/contact" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Contact</Link>
            </div>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Title level={5} style={styles.footerLinkTitle}>Features</Title>
            <div style={styles.footerLinksContainer}>
              <Link href="/features/activity" style={styles.footerLink}>Activity</Link>
              <Link href="/features/nutrition" style={styles.footerLink}>Nutrition</Link>
              <Link href="/features/productivity" style={styles.footerLink}>Productivity</Link>
              <Link href="/features/mood" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Mood</Link>
            </div>
          </Col>
        </Row>
      </footer>
    </div>
  );
};

export default LifeQuestLandingPage;