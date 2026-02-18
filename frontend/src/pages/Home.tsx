import React from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import './Home.css';

const Home: React.FC = () => {
  // Get the current URL for the form
  const formUrl = `${window.location.origin}/register`;

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Because She Can</h1>
        <p className="tagline">Empowering Women in Tech</p>
        
        <div className="qr-section">
          <h2>Scan to Register</h2>
          <div className="qr-code-wrapper">
            <QRCodeSVG 
              value={formUrl} 
              size={256}
              level="H"
              includeMargin={true}
            />
          </div>
          <p className="qr-url">{formUrl}</p>
        </div>

        <div className="actions">
          <Link to="/register" className="btn btn-primary">
            Register Now
          </Link>
          <Link to="/admin" className="btn btn-secondary">
            Admin Dashboard
          </Link>
        </div>

        <div className="info-section">
          <h3>Join our Initiative</h3>
          <p>Register for the Because She Can opening program and:</p>
          <ul>
            <li>✨ Get your unique avatar</li>
            <li>🎁 Enter the raffle to win amazing prizes</li>
            <li>🚀 Be part of a community empowering women in tech</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
