import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ScanQR from "../../Pages/QR/Scanner";
import "./Footer.css";

const Footer: React.FC = () => {
  const userRole = localStorage.getItem("role");
  const userId = localStorage.getItem("id");

  const [showScannerPopup, setShowScannerPopup] = useState(false);

  const togglePopup = () => {
    setShowScannerPopup((prevState) => !prevState);
  };

  // use the useLocation hook to get the current path
  const location = useLocation();

  // helper function to determine if the current path matches the given path
  const isActive = (path: string) => {
    return location.pathname.includes(path);
  };

  return (
    <div className="footer">
      {userRole === "eatery" ? (
        <>
          <button onClick={togglePopup} className="footer-button">
            <i className="glyphicon glyphicon-qrcode" />
            <span>Scan QR</span>
          </button>
          <Link to={`/restaurant/${userId}`} className={`footer-button ${isActive(`/restaurant/${userId}`) ? 'active' : ''}`}>
            <i className="glyphicon glyphicon-cutlery" />
            <span>Menu</span>
          </Link>
          <Link to="/eatery/user/profile" className={`footer-button ${isActive("/eatery/user/profile") ? 'active' : ''}`}>
            <i className="glyphicon glyphicon-user" />
            <span>Profile</span>
          </Link>
        </>
      ) : (
        <>
          <Link to="/restaurant/map" className={`footer-button ${isActive("/restaurant/map") ? 'active' : ''}`}>
            <i className="glyphicon glyphicon-home" />
            <span>Map</span>
          </Link>
          <Link to="/restaurants" className={`footer-button ${isActive("/restaurants") ? 'active' : ''}`}>
            <i className="glyphicon glyphicon-list" />
            <span>List</span>
          </Link>
          <Link to="/customer/wallet" className={`footer-button ${isActive("/customer/wallet") ? 'active' : ''}`}>
            <i className="glyphicon glyphicon-usd" />
            <span>Wallet</span>
          </Link>
          <Link to="/profile" className={`footer-button ${isActive("/profile") ? 'active' : ''}`}>
            <i className="glyphicon glyphicon-user" />
            <span>Profile</span>
          </Link>
        </>
      )}
      {/* Scanner Popup */}
      {showScannerPopup && (
        <ScanQR isOpen={showScannerPopup} onClose={togglePopup} />
      )}
    </div>
  );
};

export default Footer;
