import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useEateryContext } from "../../hooks/useEateryContext";
import "../../styles/Voucher.css";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import { useVoucher } from "../../hooks/useVoucher";

const ScannedVouchers: React.FC = () => {
  const navigate = useNavigate();
  const { token: checkToken, id: eateryId, role: userRole } = localStorage;
  const { id: customerId } = useParams();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search); // Get customer detail from query params
  const customerName = queryParams.get("cm");
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [addPoints, setAddPoints] = useState(1);
  const [showDeductPopup, setShowDeductPopup] = useState(false);
  const [deductPoints, setDeductPoints] = useState(1);

  const { customerVouchers, fetchVouchers, deleteCustomerVoucher } = useVoucher();

  const vouchers = customerVouchers.filter(
    (voucher) => voucher.eatery_id == eateryId
  );

  const { updateLoyaltyPoints, addCustomerToLoyalty } = useEateryContext();

  // useEffects
  // Add Customer to Loyalty program
  useEffect(() => {
    if (eateryId && customerId) {
      addCustomerToLoyalty(eateryId, customerId);
    }
  }, [eateryId, customerId, addCustomerToLoyalty]);

  // Initialize loyaltyPoints when component mounts
  useEffect(() => {
    if (vouchers.length > 0) {
      setLoyaltyPoints(vouchers[0].loyalty_points || 0);
    }
  }, [vouchers]);
  useEffect(() => {
    // Check if the vouchers array is not empty and loyaltyPoints is 0
    if (vouchers.length > 0 && loyaltyPoints === 0) {
      setLoyaltyPoints(vouchers[0].loyalty_points || 0);
    }
  }, [vouchers, loyaltyPoints]);

  useEffect(() => {
    if (customerId) {
      fetchVouchers(customerId.toString());
    }
  }, [fetchVouchers, customerId]);

  if (userRole !== "eatery") {
    navigate("/auth/login");
  }

  useEffect(() => {
    if (!checkToken) {
      navigate("/");
    }
  }, [checkToken, navigate]);

  // Page Handlers
  const handlePointsSubmit = async (action: string) => {
    let points = 0;

    if (action === "add") {
      points = addPoints;
    } else if (action === "deduct") {
      points = deductPoints;
    }

    if (points && points > 0) {
      const formData = {
        customer_id: customerId,
        eatery_id: eateryId,
        action: action,
        points: points,
      };

      const success = await updateLoyaltyPoints(formData);
      if (success) {
        if (customerId) {
          fetchVouchers(customerId.toString());
        }
        if (action === "add") {
          setShowAddPopup(!setShowAddPopup);
        } else {
          setShowDeductPopup(!showDeductPopup);
        }
      } else {
        console.error(`Failed to ${action} points`);
      }
    }
  };

  const handleAddPoints = async () => {
    await handlePointsSubmit("add");
  };

  const handleDeductPoints = async () => {
    await handlePointsSubmit("deduct");
  };

  const handleDeleteCustomerVoucher = async (voucherId: string) => {
    if (customerId && voucherId) {
      const success = await deleteCustomerVoucher(voucherId, customerId);
      if (success) {
        fetchVouchers(customerId.toString());
      }
    }
  };

  return (
    <>
      <Header>
        <h3>Customer Vouchers</h3>
      </Header>
      <div className="customer-vouchers">
        <h4>{customerName}</h4>
        <div className="voucher-controls">
          <Button
            variant="secondary"
            onClick={() => setShowDeductPopup(!showDeductPopup)}
          >
            -
          </Button>
          <input
            type="number"
            value={loyaltyPoints}
            onChange={(e) => setLoyaltyPoints(parseInt(e.target.value))}
          />{" "}
          <span>pts</span>
          <Button
            variant="secondary"
            onClick={() => setShowAddPopup(!showAddPopup)}
          >
            +
          </Button>
        </div>
        <h5>Vouchers:</h5>
        <div className="vouchers-container">
          {vouchers.map((voucher, index) => (
            <Card key={index} className="voucher-card">
              {userRole === "eatery" && (
                <i
                  onClick={() => handleDeleteCustomerVoucher(voucher.id)}
                  className="bi bi-trash gl"
                  style={{ padding: "2px", marginLeft: "85%" }}
                ></i>
              )}
              <Card.Body>
                <Card.Text>{voucher.description}</Card.Text>
              </Card.Body>
            </Card>
          ))}
        </div>
        {/* Add Points Popup */}
        {showAddPopup && (
          <div className="add-voucher-points popup">
            <h6>Enter Points To Add</h6>
            <input
              className="text-center form-control"
              type="number"
              value={addPoints}
              onChange={(e) => setAddPoints(parseInt(e.target.value))}
            />
            <Button variant="primary" onClick={handleAddPoints}>
              Add Points
            </Button>
            <Button
              variant="cancel"
              onClick={() => setShowAddPopup(!showAddPopup)}
            >
              Cancel
            </Button>
          </div>
        )}
        {showDeductPopup && (
          <div className="add-voucher-points popup">
            <h6>Enter Points To Deduct</h6>
            <input
              className="text-center form-control"
              type="number"
              value={deductPoints}
              onChange={(e) => setDeductPoints(parseInt(e.target.value))}
            />
            <Button variant="primary" onClick={handleDeductPoints}>
              Deduct
            </Button>
            <Button
              variant="cancel"
              onClick={() => setShowDeductPopup(!showDeductPopup)}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default ScannedVouchers;