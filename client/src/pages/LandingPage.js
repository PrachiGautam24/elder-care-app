import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [visibleSections, setVisibleSections] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth <= 968 && window.innerWidth > 768);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const observerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsTablet(window.innerWidth <= 968 && window.innerWidth > 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Intersection Observer for scroll animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all animated sections
    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach((section) => observerRef.current.observe(section));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={styles.container}>
      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navContent}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>E</div>
            <span style={isMobile ? styles.logoTextMobile : styles.logoText}>ElderEase</span>
          </div>
          {isMobile ? (
            <>
              <button 
                onClick={() => setShowMobileMenu(!showMobileMenu)} 
                style={styles.hamburger}
              >
                {showMobileMenu ? '✕' : '☰'}
              </button>
              {showMobileMenu && (
                <div style={styles.mobileMenu}>
                  <button onClick={() => { scrollToSection('services'); setShowMobileMenu(false); }} style={styles.mobileNavLink}>Services</button>
                  <button onClick={() => { scrollToSection('about'); setShowMobileMenu(false); }} style={styles.mobileNavLink}>About</button>
                  <button onClick={() => { scrollToSection('contact'); setShowMobileMenu(false); }} style={styles.mobileNavLink}>Contact</button>
                  <button onClick={() => navigate('/login')} style={styles.mobileGetStartedBtn}>Get Started</button>
                </div>
              )}
            </>
          ) : (
            <div style={styles.navLinks}>
              <button onClick={() => scrollToSection('services')} style={styles.navLink}>Services</button>
              <button onClick={() => scrollToSection('about')} style={styles.navLink}>About</button>
              <button onClick={() => scrollToSection('contact')} style={styles.navLink}>Contact</button>
              <button onClick={() => navigate('/login')} style={styles.getStartedBtn}>Get Started</button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={isMobile || isTablet ? styles.heroContentMobile : styles.heroContent}>
          <div style={styles.heroLeft}>
            <h1 style={isMobile ? styles.heroTitleMobile : styles.heroTitle}>
              Senior Care,<br />Simplified
            </h1>
            <p style={isMobile ? styles.heroSubtitleMobile : styles.heroSubtitle}>
              Connect with qualified caregivers and nurses.{!isMobile && <br />}
              Professional, reliable, and compassionate support for{!isMobile && <br />}
              elderly healthcare at home.
            </p>
            <div style={isMobile ? styles.heroButtonsMobile : styles.heroButtons}>
              <button onClick={() => navigate('/login')} style={styles.primaryBtn}>Get Started</button>
              <button onClick={() => scrollToSection('services')} style={styles.secondaryBtn}>Learn More</button>
            </div>
          </div>
          <div style={isMobile || isTablet ? styles.heroRightMobile : styles.heroRight}>
            <div style={styles.featuresBox}>
              <h3 style={styles.featuresTitle}>Key Features</h3>
              <div style={styles.featuresList}>
                <div style={styles.featureItem}>✓ Licensed & Vetted Professionals</div>
                <div style={styles.featureItem}>✓ 24/7 Availability</div>
                <div style={styles.featureItem}>✓ Flexible Scheduling</div>
                <div style={styles.featureItem}>✓ Transparent Pricing</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={styles.stats}>
        <div style={isMobile ? styles.statsGridMobile : isTablet ? styles.statsGridTablet : styles.statsGrid}>
          <div style={styles.statItem}>
            <h2 style={isMobile ? styles.statNumberMobile : styles.statNumber}>1K+</h2>
            <p style={styles.statLabel}>Seniors Cared For</p>
          </div>
          <div style={styles.statItem}>
            <h2 style={isMobile ? styles.statNumberMobile : styles.statNumber}>500+</h2>
            <p style={styles.statLabel}>Professional Caregivers</p>
          </div>
          <div style={styles.statItem}>
            <h2 style={isMobile ? styles.statNumberMobile : styles.statNumber}>99%</h2>
            <p style={styles.statLabel}>Satisfaction Rate</p>
          </div>
          <div style={styles.statItem}>
            <h2 style={isMobile ? styles.statNumberMobile : styles.statNumber}>12</h2>
            <p style={styles.statLabel}>Years in Service</p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" style={styles.services}>
        <h2 style={isMobile ? styles.sectionTitleMobile : styles.sectionTitle}>Our Services</h2>
        <p style={isMobile ? styles.sectionSubtitleMobile : styles.sectionSubtitle}>
          Comprehensive care solutions tailored to individual needs
        </p>
        <div style={isMobile ? styles.servicesGridMobile : styles.servicesGrid}>
          <div
            id="service-1"
            data-animate="slide-left"
            style={{
              ...styles.serviceCard,
              ...(isMobile ? styles.serviceCardMobile : {}),
              ...(visibleSections['service-1'] ? styles.slideInLeft : styles.slideOutLeft),
            }}
          >
            <h3 style={isMobile ? styles.serviceTitleMobile : styles.serviceTitle}>Personal Care Assistance</h3>
            <p style={styles.serviceDesc}>
              Assistance with daily activities including bathing, dressing, grooming, and mobility support.
            </p>
          </div>
          <div
            id="service-2"
            data-animate="slide-right"
            style={{
              ...styles.serviceCard,
              ...(isMobile ? styles.serviceCardMobile : {}),
              ...(visibleSections['service-2'] ? styles.slideInRight : styles.slideOutRight),
            }}
          >
            <h3 style={isMobile ? styles.serviceTitleMobile : styles.serviceTitle}>Medical Nursing</h3>
            <p style={styles.serviceDesc}>
              Licensed nurses for wound care, medication management, and health monitoring.
            </p>
          </div>
          <div
            id="service-3"
            data-animate="slide-left"
            style={{
              ...styles.serviceCard,
              ...(isMobile ? styles.serviceCardMobile : {}),
              ...(visibleSections['service-3'] ? styles.slideInLeft : styles.slideOutLeft),
            }}
          >
            <h3 style={isMobile ? styles.serviceTitleMobile : styles.serviceTitle}>Specialized Care</h3>
            <p style={styles.serviceDesc}>
              Expert care for Alzheimer's, dementia, Parkinson's, and post-operative recovery.
            </p>
          </div>
          <div
            id="service-4"
            data-animate="slide-right"
            style={{
              ...styles.serviceCard,
              ...(isMobile ? styles.serviceCardMobile : {}),
              ...(visibleSections['service-4'] ? styles.slideInRight : styles.slideOutRight),
            }}
          >
            <h3 style={isMobile ? styles.serviceTitleMobile : styles.serviceTitle}>Companionship & Support</h3>
            <p style={styles.serviceDesc}>
              Social engagement, meal preparation, and household management services.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section id="about" style={styles.whyChoose}>
        <div style={isMobile || isTablet ? styles.whyChooseContentMobile : styles.whyChooseContent}>
          <div style={styles.whyChooseLeft}>
            <h2 style={isMobile ? styles.whyChooseTitleMobile : styles.whyChooseTitle}>
              Why Choose<br />ElderEase?
            </h2>
            
            <div style={styles.whyChooseItem}>
              <h3 style={styles.whyChooseItemTitle}>Professional Standards</h3>
              <p style={styles.whyChooseItemDesc}>
                All caregivers are licensed, insured, and undergo thorough background checks and training.
              </p>
            </div>

            <div style={styles.whyChooseItem}>
              <h3 style={styles.whyChooseItemTitle}>Personalized Plans</h3>
              <p style={styles.whyChooseItemDesc}>
                Custom care plans developed with medical professionals and family input.
              </p>
            </div>

            <div style={styles.whyChooseItem}>
              <h3 style={styles.whyChooseItemTitle}>Reliable Support</h3>
              <p style={styles.whyChooseItemDesc}>
                24/7 availability with dedicated care coordinators and emergency response teams.
              </p>
            </div>

            <div style={styles.whyChooseItem}>
              <h3 style={styles.whyChooseItemTitle}>Transparent Pricing</h3>
              <p style={styles.whyChooseItemDesc}>
                No hidden fees. Clear, upfront pricing with flexible payment options.
              </p>
            </div>
          </div>

          <div style={isMobile || isTablet ? styles.whyChooseRightMobile : styles.whyChooseRight}>
            <div
              id="testimonial-1"
              data-animate="slide-right"
              style={{
                ...styles.testimonialCard,
                ...(visibleSections['testimonial-1'] ? styles.slideInRight : styles.slideOutRight),
              }}
            >
              <p style={styles.testimonialText}>
                "ElderEase transformed our family's approach to senior care. The professionalism and compassion of their team is unmatched."
              </p>
              <p style={styles.testimonialAuthor}>— Family caregiver</p>
            </div>

            <div
              id="testimonial-2"
              data-animate="slide-right"
              style={{
                ...styles.testimonialCard,
                ...(visibleSections['testimonial-2'] ? styles.slideInRight : styles.slideOutRight),
                transitionDelay: '0.2s',
              }}
            >
              <p style={styles.testimonialText}>
                "The coordination between medical staff and caregivers ensures my mother receives comprehensive, quality care."
              </p>
              <p style={styles.testimonialAuthor}>— Adult child</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.cta}>
        <h2 style={isMobile ? styles.ctaTitleMobile : styles.ctaTitle}>Ready to Get Started?</h2>
        <p style={isMobile ? styles.ctaSubtitleMobile : styles.ctaSubtitle}>
          Schedule a free consultation with our care coordinators to discuss your needs and find the right solution.
        </p>
        <div style={isMobile ? styles.ctaButtonsMobile : styles.ctaButtons}>
          <button onClick={() => scrollToSection('contact')} style={styles.ctaPrimaryBtn}>Schedule Consultation</button>
          <button onClick={() => scrollToSection('contact')} style={styles.ctaSecondaryBtn}>📞 Call Now</button>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" style={styles.contact}>
        <div style={isMobile || isTablet ? styles.contactContentMobile : styles.contactContent}>
          <div style={styles.contactLeft}>
            <h2 style={isMobile ? styles.contactTitleMobile : styles.contactTitle}>Get in Touch</h2>
            
            <div style={styles.contactInfo}>
              <h3 style={styles.contactInfoTitle}>Phone</h3>
              <p style={styles.contactInfoText}>(555) 123-4567</p>
            </div>

            <div style={styles.contactInfo}>
              <h3 style={styles.contactInfoTitle}>Email</h3>
              <p style={styles.contactInfoText}>info@elderease.com</p>
            </div>

            <div style={styles.contactInfo}>
              <h3 style={styles.contactInfoTitle}>Address</h3>
              <p style={styles.contactInfoText}>
                456 Healthcare Blvd<br />
                Suite 200<br />
                New York, NY 10001
              </p>
            </div>

            <div style={styles.contactInfo}>
              <h3 style={styles.contactInfoTitle}>Hours</h3>
              <p style={styles.contactInfoText}>
                Monday - Friday: 8:00 AM - 8:00 PM<br />
                Saturday: 9:00 AM - 5:00 PM<br />
                Sunday: 10:00 AM - 4:00 PM
              </p>
            </div>
          </div>

          <div style={isMobile || isTablet ? styles.contactRightMobile : styles.contactRight}>
            <form style={isMobile ? styles.contactFormMobile : styles.contactForm}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Full Name</label>
                <input type="text" placeholder="Your name" style={styles.formInput} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Email Address</label>
                <input type="email" placeholder="your@email.com" style={styles.formInput} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Phone Number</label>
                <input type="tel" placeholder="(555) 123-4567" style={styles.formInput} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Message</label>
                <textarea placeholder="Tell us about your care needs..." style={styles.formTextarea} rows="4"></textarea>
              </div>
              <button type="submit" style={styles.formSubmitBtn}>Send Message</button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={isMobile ? styles.footerContentMobile : isTablet ? styles.footerContentTablet : styles.footerContent}>
          <div style={styles.footerColumn}>
            <div style={styles.footerLogo}>
              <div style={styles.footerLogoIcon}>E</div>
              <span style={styles.footerLogoText}>ElderEase</span>
            </div>
            <p style={styles.footerDesc}>
              Professional elderly care services connecting families with trusted caregivers.
            </p>
          </div>

          <div style={styles.footerColumn}>
            <h4 style={styles.footerTitle}>Services</h4>
            <a href="#services" style={styles.footerLink}>Personal Care</a>
            <a href="#services" style={styles.footerLink}>Medical Nursing</a>
            <a href="#services" style={styles.footerLink}>Specialized Care</a>
            <a href="#services" style={styles.footerLink}>Respite Care</a>
          </div>

          <div style={styles.footerColumn}>
            <h4 style={styles.footerTitle}>Company</h4>
            <a href="#about" style={styles.footerLink}>About Us</a>
            <button onClick={() => navigate('/caregiver/register')} style={styles.footerLink}>Careers</button>
            <a href="#services" style={styles.footerLink}>Blog</a>
            <a href="#contact" style={styles.footerLink}>Contact</a>
          </div>

          <div style={styles.footerColumn}>
            <h4 style={styles.footerTitle}>Legal</h4>
            <button style={styles.footerLink}>Privacy Policy</button>
            <button style={styles.footerLink}>Terms of Service</button>
            <button style={styles.footerLink}>Compliance</button>
          </div>
        </div>

        <div style={styles.footerBottom}>
          <p style={styles.footerCopyright}>© 2024 ElderEase. All rights reserved. Licensed and insured.</p>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#ffffff',
    minHeight: '100vh',
  },
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e0e0e0',
    zIndex: 1000,
    padding: '16px 0',
  },
  navContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoIcon: {
    width: '40px',
    height: '40px',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    fontSize: '20px',
    fontWeight: '700',
  },
  logoText: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1a1a1a',
  },
  logoTextMobile: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1a1a1a',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
  },
  navLink: {
    fontSize: '16px',
    color: '#666',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'color 0.2s',
  },
  hamburger: {
    fontSize: '28px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#1a1a1a',
    padding: '8px',
  },
  mobileMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e0e0e0',
    display: 'flex',
    flexDirection: 'column',
    padding: '16px 20px',
    gap: '12px',
  },
  mobileNavLink: {
    fontSize: '16px',
    color: '#666',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '12px 0',
    textAlign: 'left',
  },
  mobileGetStartedBtn: {
    padding: '12px 28px',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    border: 'none',
    marginTop: '8px',
  },
  getStartedBtn: {
    padding: '12px 28px',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    border: 'none',
  },
  hero: {
    paddingTop: '120px',
    paddingBottom: '80px',
    backgroundColor: '#fafafa',
  },
  heroContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    gap: '60px',
    alignItems: 'center',
  },
  heroContentMobile: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '40px',
    textAlign: 'center',
  },
  heroLeft: {
    flex: 1,
  },
  heroTitle: {
    fontSize: '64px',
    fontWeight: '700',
    color: '#1a1a1a',
    lineHeight: '1.1',
    marginBottom: '24px',
  },
  heroTitleMobile: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#1a1a1a',
    lineHeight: '1.1',
    marginBottom: '20px',
  },
  heroSubtitle: {
    fontSize: '18px',
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '40px',
  },
  heroSubtitleMobile: {
    fontSize: '16px',
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '32px',
  },
  heroButtons: {
    display: 'flex',
    gap: '16px',
  },
  heroButtonsMobile: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    width: '100%',
  },
  primaryBtn: {
    padding: '16px 32px',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    border: 'none',
    width: '100%',
  },
  secondaryBtn: {
    padding: '16px 32px',
    backgroundColor: 'transparent',
    color: '#1a1a1a',
    border: '2px solid #1a1a1a',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
  },
  heroRight: {
    flex: '0 0 450px',
  },
  heroRightMobile: {
    width: '100%',
  },
  featuresBox: {
    backgroundColor: '#ffffff',
    border: '1px solid #e0e0e0',
    borderRadius: '12px',
    padding: '40px',
  },
  featuresTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '24px',
  },
  featuresList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  featureItem: {
    fontSize: '16px',
    color: '#333',
    display: 'flex',
    alignItems: 'center',
  },
  stats: {
    padding: '60px 0',
    borderTop: '1px solid #e0e0e0',
    borderBottom: '1px solid #e0e0e0',
  },
  statsGrid: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '40px',
  },
  statsGridTablet: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '30px',
  },
  statsGridMobile: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
  },
  statItem: {
    textAlign: 'center',
  },
  statNumber: {
    fontSize: '48px',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '8px',
  },
  statNumberMobile: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '8px',
  },
  statLabel: {
    fontSize: '16px',
    color: '#666',
  },
  services: {
    padding: '100px 0',
    backgroundColor: '#fafafa',
  },
  sectionTitle: {
    fontSize: '48px',
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: '16px',
    '@media (max-width: 768px)': {
      fontSize: '32px',
    },
  },
  sectionSubtitle: {
    fontSize: '18px',
    color: '#666',
    textAlign: 'center',
    marginBottom: '60px',
  },
  servicesGrid: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '24px',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
  serviceCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e0e0e0',
    borderRadius: '12px',
    padding: '40px',
    transition: 'all 0.6s ease-out',
  },
  slideOutLeft: {
    opacity: 0,
    transform: 'translateX(-100px)',
  },
  slideInLeft: {
    opacity: 1,
    transform: 'translateX(0)',
  },
  slideOutRight: {
    opacity: 0,
    transform: 'translateX(100px)',
  },
  slideInRight: {
    opacity: 1,
    transform: 'translateX(0)',
  },
  serviceTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '16px',
  },
  serviceDesc: {
    fontSize: '16px',
    color: '#666',
    lineHeight: '1.6',
  },
  whyChoose: {
    padding: '100px 0',
    backgroundColor: '#ffffff',
  },
  whyChooseContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    gap: '80px',
    '@media (max-width: 968px)': {
      flexDirection: 'column',
      gap: '40px',
    },
  },
  whyChooseLeft: {
    flex: 1,
  },
  whyChooseTitle: {
    fontSize: '48px',
    fontWeight: '700',
    color: '#1a1a1a',
    lineHeight: '1.1',
    marginBottom: '40px',
    '@media (max-width: 768px)': {
      fontSize: '32px',
      marginBottom: '24px',
    },
  },
  whyChooseItem: {
    marginBottom: '32px',
  },
  whyChooseItemTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '8px',
  },
  whyChooseItemDesc: {
    fontSize: '16px',
    color: '#666',
    lineHeight: '1.6',
  },
  whyChooseRight: {
    flex: '0 0 450px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    '@media (max-width: 968px)': {
      flex: '1 1 auto',
    },
  },
  testimonialCard: {
    backgroundColor: '#fafafa',
    border: '1px solid #e0e0e0',
    borderRadius: '12px',
    padding: '32px',
    transition: 'all 0.6s ease-out',
  },
  testimonialText: {
    fontSize: '16px',
    color: '#333',
    lineHeight: '1.6',
    marginBottom: '16px',
    fontStyle: 'italic',
  },
  testimonialAuthor: {
    fontSize: '14px',
    color: '#999',
  },
  cta: {
    padding: '100px 0',
    backgroundColor: '#1a1a1a',
    textAlign: 'center',
  },
  ctaTitle: {
    fontSize: '48px',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '16px',
    '@media (max-width: 768px)': {
      fontSize: '32px',
    },
  },
  ctaSubtitle: {
    fontSize: '18px',
    color: '#cccccc',
    marginBottom: '40px',
  },
  ctaButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      padding: '0 20px',
    },
  },
  ctaPrimaryBtn: {
    padding: '16px 32px',
    backgroundColor: '#ffffff',
    color: '#1a1a1a',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  ctaSecondaryBtn: {
    padding: '16px 32px',
    backgroundColor: 'transparent',
    color: '#ffffff',
    border: '2px solid #ffffff',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  contact: {
    padding: '100px 0',
    backgroundColor: '#fafafa',
  },
  contactContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    gap: '80px',
    '@media (max-width: 968px)': {
      flexDirection: 'column',
      gap: '40px',
    },
  },
  contactLeft: {
    flex: 1,
  },
  contactTitle: {
    fontSize: '48px',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '40px',
    '@media (max-width: 768px)': {
      fontSize: '32px',
      marginBottom: '24px',
    },
  },
  contactInfo: {
    marginBottom: '32px',
  },
  contactInfoTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '8px',
  },
  contactInfoText: {
    fontSize: '16px',
    color: '#666',
    lineHeight: '1.6',
  },
  contactRight: {
    flex: '0 0 500px',
    '@media (max-width: 968px)': {
      flex: '1 1 auto',
    },
  },
  contactForm: {
    backgroundColor: '#ffffff',
    border: '1px solid #e0e0e0',
    borderRadius: '12px',
    padding: '40px',
  },
  formGroup: {
    marginBottom: '24px',
  },
  formLabel: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '8px',
  },
  formInput: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '15px',
  },
  formTextarea: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '15px',
    resize: 'vertical',
  },
  formSubmitBtn: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  footer: {
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e0e0e0',
    padding: '60px 0 30px',
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '40px',
    marginBottom: '40px',
    '@media (max-width: 968px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '30px',
    },
    '@media (max-width: 480px)': {
      gridTemplateColumns: '1fr',
    },
  },
  footerColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  footerLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px',
  },
  footerLogoIcon: {
    width: '32px',
    height: '32px',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '700',
  },
  footerLogoText: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1a1a1a',
  },
  footerDesc: {
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.6',
  },
  footerTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a1a1a',
  },
  footerLink: {
    fontSize: '14px',
    color: '#666',
    textDecoration: 'none',
    background: 'none',
    border: 'none',
    padding: 0,
    textAlign: 'left',
    cursor: 'pointer',
  },
  footerBottom: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '30px 20px 0',
    borderTop: '1px solid #e0e0e0',
  },
  footerCopyright: {
    fontSize: '14px',
    color: '#999',
    textAlign: 'center',
  },
};

export default LandingPage;
