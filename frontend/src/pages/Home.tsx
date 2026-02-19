import React from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import './Home.css';
import BSCHorizontal from '../assets/BSCHorizontal.png';

const Home: React.FC = () => {
  // Get the current URL for the form
  const formUrl = `${window.location.origin}/register`;

  return (
    <div className="home-container">
      <div className="home-content">
        <img src={BSCHorizontal} alt="" />
        <p className="tagline">Empowering Women in Tech</p>
        
        <div className="qr-section">
          <h2>Scan to Register</h2>
          <div className="qr-code-wrapper">
            <QRCodeSVG
              value={formUrl}
              size={256}
              className="qr-code-svg"
              fgColor="#4f0944"
              level="H"
              includeMargin={true}
            />
          </div>
        </div>

        <div className="actions">
          <Link to="/register" className="btn btn-primary">
            Register Now
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
