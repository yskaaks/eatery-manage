import React, { useState, useEffect } from "react";
import QrScanner from "react-qr-scanner";
import { useNavigate } from "react-router-dom";
import "../../styles/QR.css";
import { useVoucher } from "../../hooks/useVoucher";

interface ScannerPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const App: React.FC<ScannerPopupProps> = ({ isOpen, onClose }) => {
  const { role } = localStorage;
  const userRole = role || "";
  const navigate = useNavigate();
  const [scanError, setScanError] = useState<string | null>(null);
  const [deviceNotFound, setDeviceNotFound] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(
    null
  );

  const { verifyQRCode } = useVoucher();

  const handleScan = (data: {text?: string} | null) => {
    if (data) {
      try {
        const actualData = data?.text;

        if (actualData) {
          const jsonData = actualData.replace(/'/g, '"');
          const parsedData = JSON.parse(jsonData);
          const customerId = parsedData.customerId;
          const customerName = parsedData.customerName;
          const code = parsedData.code;
          // Verify QR Code
          if (customerId && code) {
            verifyQRCode(customerId, code)
              .then((isVerified) => {
                if (isVerified === true) {
                  onClose();
                  navigate(
                    `/customer/${customerId}/scanned/vouchers?cm=${customerName}`
                  );
                } else {
                  setScanError("QR code verification failed.");
                }
              })
              .catch((error) => {
                setScanError(
                  "Error in Verify QR CODE-" + JSON.stringify(error)
                );
              });
          }
        } else {
          setScanError(
            "Invalid QR code format. 'text' key not found in the scanned data."
          );
        }
      } catch (error) {
        setScanError("Error while parsing scanned data:" + error);
      }
    }
  };

  const handleScanError = (error: any) => {
    console.error("Error while scanning QR code:", error);
    setScanError("Camera not found or access denied.");
  };

  useEffect(() => {
    // Check if camera permission is granted or denied
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => setCameraPermission(true))
      .catch((error) => {
        if (error.name === "NotFoundError") {
          // Camera device not found
          setDeviceNotFound(true);
        } else {
          // Other errors, camera permission denied, etc.
          setCameraPermission(false);
        }
      });
  }, []);

  // Handle Device Checks on load
  let errorMessage = null;
  if (userRole !== "eatery") {
    errorMessage = "Access Denied!";
  } else if (deviceNotFound) {
    errorMessage = "Camera device not found.";
  } else if (cameraPermission === null) {
    errorMessage = "Checking Camera Permission...";
  } else if (!cameraPermission) {
    errorMessage =
      "Camera access denied or an error occurred. Please enable camera access in your browser settings to scan QR codes.";
  }

  return isOpen ? (
    <div className="scan-qr-popup">
      <div className="popup-content">
        <div className="close-icon" onClick={onClose}>
          <span className="glyphicon glyphicon-remove"></span>
        </div>
        {cameraPermission === true && (
          <QrScanner
            onScan={handleScan}
            onError={handleScanError}
            key="environment"
            constraints={{
              audio: false,
              video: { facingMode: { exact: "environment" } },
            }}
            style={{ width: "100%" }}
          />
        )}
        {/* Display scan error */}
        {scanError && <div className="error">{scanError}</div>}
        {/* Display device error message */}
        {errorMessage && <div className="error">{errorMessage}</div>}
      </div>
    </div>
  ) : null;
};

export default App;