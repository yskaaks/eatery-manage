// File to Show Vouchers By Selected Eatery from Wallet page
import React, { useEffect } from "react";
import { Card } from "react-bootstrap";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "../../styles/Voucher.css";
import { useVoucher } from "../../hooks/useVoucher";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";

const App: React.FC = () => {
  const navigate = useNavigate();
  const { token: checkToken, id: customerId } = localStorage;

  const { id: eateryId } = useParams();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search); // Get eatry detail from query params

  const eateryName = queryParams.get("nm");
  const totalPoints = queryParams.get("pts");
  const { customerVouchers, fetchVouchers } = useVoucher();

  useEffect(() => {
    if (customerId) {
      fetchVouchers(customerId);
    }
  }, [fetchVouchers, customerId, eateryId]);

  useEffect(() => {
    if (!checkToken) {
      navigate("/");
    }
  }, [checkToken, navigate]);

  if (!checkToken) {
    return null;
  }
  const vouchers = customerVouchers.filter(
    (voucher) => voucher.eatery_id == eateryId
  );

  return (
    <>
      <Header>
        <i
          className="bi bi-arrow-left back-to-wallet"
          onClick={() => navigate(-1)}
        ></i>
      </Header>
      <div className="customer-vouchers">
        <h4>{eateryName}</h4>
        <div className="voucher-controls">
          <span>{totalPoints} points</span>
        </div>
        <h5>My Vouchers:</h5>
        <div className="vouchers-container">
          {vouchers?.map((voucher, index) => (
            <Card key={index} className="voucher-card">
              <Card.Body>
                <Card.Text>{voucher.description}</Card.Text>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default App;
