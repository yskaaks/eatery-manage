import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../../styles/Wallet.css";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import { useVoucher } from "../../hooks/useVoucher";
import { useAuth } from "../../hooks/useAuth";
import { Eatery, Voucher } from "../../interface";
import { useEateryContext } from "../../hooks/useEateryContext";
import QRCodeComponent from "../QR/Generator";

type VoucherWithEatery = {
  voucher: Voucher[];
  open: boolean;
  eatery: Eatery | null;
  loyaltyPoints: number | null;
};

const Wallet: React.FC = () => {
  const navigate = useNavigate();
  const checkToken = localStorage.getItem("token");

  const { customerVouchers, fetchVouchers, fetchQRCode } = useVoucher();
  const { user, fetchUser } = useAuth();
  const { fetchEatery } = useEateryContext();
  const [qrCode, setQrCode] = useState({});

  const [vouchersState, setVouchersState] = useState<VoucherWithEatery[]>([]);

  // Fetch the QR code when the component is mounted
  const getQRCode = async () => {
    const response = await fetchQRCode();
    setQrCode(response);
  };
  useEffect(() => {
    getQRCode();
  }, []);
  // Effect to generate random data for the QR code every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      getQRCode();
    }, 30000); // 30 seconds in milliseconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (user) {
      fetchVouchers(user.id);
    }
  }, [fetchVouchers, user]);

  useEffect(() => {
    if (user) {
      fetchVouchers(user.id);
      const vouchersWithEatery = customerVouchers.map((voucher) => ({
        voucher: [voucher],
        open: false,
        eatery: null,
        loyaltyPoints: null,
      }));
      setVouchersState(vouchersWithEatery);
    }
  }, [fetchVouchers, user]);

  useEffect(() => {
    const updateVouchersWithEateries = async () => {
      // Step 1: Create a map to group vouchers by eatery_id
      const vouchersMap: Record<string, VoucherWithEatery> = {};

      // Step 2: Fetch eatery data for each voucher and group them by eatery_id
      await Promise.all(
        customerVouchers.map(async (voucher) => {
          const eatery = await fetchEatery(voucher.eatery_id);
          if (!vouchersMap[voucher.eatery_id]) {
            vouchersMap[voucher.eatery_id] = {
              voucher: [voucher],
              open: false,
              eatery,
              loyaltyPoints: voucher?.loyalty_points,
            };
          } else {
            // If an eatery entry already exists in the map, merge the vouchers
            vouchersMap[voucher.eatery_id].voucher.push(voucher);
            vouchersMap[voucher.eatery_id].loyaltyPoints = voucher?.loyalty_points;
          }
        })
      );

      // Step 3: Convert the map values into an array of VoucherWithEatery
      const vouchersWithEateries = Object.values(vouchersMap);

      // Step 4: Update the state
      setVouchersState(vouchersWithEateries);
    };
    updateVouchersWithEateries();
  }, [customerVouchers, fetchEatery]);

  useEffect(() => {
    if (!checkToken) {
      navigate("/");
    }
  }, [checkToken, navigate]);

  if (!checkToken) {
    return null;
  }

  return (
    <>
      <Header>
        <h3>My Wallet</h3>
      </Header>
      <div className="wallet">
        <div className="qr-code-img text-center">
          {/* Display the QR code */}
          {user && <QRCodeComponent value={JSON.stringify(qrCode)} />}
        </div>
        <div className="wallet-accordian">
          {vouchersState.map((eatery, index) => (
            <Card
              key={index}
              className="eatery-card"
              onClick={() =>
                navigate(
                  `/wallet/vouchers/${eatery.eatery?.id}?nm=${eatery.eatery?.restaurant_name}&pts=${eatery?.loyaltyPoints}`
                )
              }
            >
              <Card.Body>
                <div className="eatery-header">
                  <span className="eatery-name">
                    {eatery?.eatery?.restaurant_name}
                  </span>
                  <span className="eatery-points">
                    {eatery?.loyaltyPoints} Points
                  </span>
                </div>
                <div className="vouchers-container">
                  {eatery &&
                    eatery.voucher &&
                    eatery.voucher.length > 0 &&
                    eatery.voucher.map((voucher, vIndex) => (
                      <span key={`_v-${vIndex}`} className="voucher-span">
                        {voucher.description}
                      </span>
                    ))}
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Wallet;