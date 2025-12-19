import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Offers.css';

const Offers = () => {
  const [copiedCode, setCopiedCode] = useState('');
  const navigate = useNavigate();

  const offers = [
    {
      title: 'Cashback Offer',
      description: 'Get 10% cashback on recharges above ₹500',
      code: 'CASH10',
      discount: '10% OFF',
      validity: 'Valid till 31st Dec'
    },
    {
      title: 'First Recharge Bonus',
      description: '₹50 bonus on your first recharge of ₹200+',
      code: 'FIRST50',
      discount: '₹50 BONUS',
      validity: 'New users only'
    },
    {
      title: 'Weekend Special',
      description: 'Extra 5% off on weekend recharges',
      code: 'WEEKEND5',
      discount: '5% OFF',
      validity: 'Weekends only'
    },
    {
      title: 'Super Saver Deal',
      description: 'Flat 15% off on recharges above ₹1000',
      code: 'SUPER15',
      discount: '15% OFF',
      validity: 'Limited time'
    },
    {
      title: 'Student Special',
      description: 'Exclusive 20% discount for students',
      code: 'STUDENT20',
      discount: '20% OFF',
      validity: 'ID verification required'
    },
    {
      title: 'Refer & Earn',
      description: 'Get ₹100 for each successful referral',
      code: 'REFER100',
      discount: '₹100 REWARD',
      validity: 'Unlimited referrals'
    }
  ];

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  return (
    <div className="offers-container">
      <div className="offers-wrapper">
        <div className="offers-header">
          <h1 className="offers-title">EXCLUSIVE OFFERS</h1>
          <p className="offers-subtitle">
            Unlock incredible savings with our premium deals. Limited time offers designed for maximum value.
          </p>
          <div className="offers-badges">
            <div className="badge green">Save up to 20%</div>
            <div className="badge blue">Instant Activation</div>
            <div className="badge purple">Premium Support</div>
          </div>
        </div>
        
        <div className="offers-grid">
          {offers.map((offer, index) => (
            <div key={index} className="offer-card">
              <div className="discount-badge">{offer.discount}</div>
              
              <h3 className="offer-title">{offer.title}</h3>
              <p className="offer-description">{offer.description}</p>
              
              <div className="promo-section">
                <div className="promo-label">Promo Code</div>
                <div className="promo-code-container">
                  <div className="promo-code">{offer.code}</div>
                  <button
                    onClick={() => copyToClipboard(offer.code)}
                    className="copy-btn"
                  >
                    {copiedCode === offer.code ? 'COPIED' : 'COPY'}
                  </button>
                </div>
              </div>
              
              <div className="validity">{offer.validity}</div>
              
              <button 
                className="use-offer-btn"
                onClick={() => navigate('/recharge')}
              >
                Use This Offer
              </button>
            </div>
          ))}
        </div>
        
        <div className="cta-section">
          <h2 className="cta-title">Don't Miss Out!</h2>
          <p className="cta-description">
            These exclusive offers won't last forever. Start saving on your mobile recharges today!
          </p>
          <div className="cta-buttons">
            <button 
              className="cta-btn primary"
              onClick={() => navigate('/recharge')}
            >
              START RECHARGING
            </button>
            <button 
              className="cta-btn secondary"
              onClick={() => navigate('/plans')}
            >
              VIEW PLANS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Offers;