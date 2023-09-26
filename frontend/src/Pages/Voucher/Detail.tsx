import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';

// import API method for fetching voucher details
// Update the import based on your actual method
// import { getVoucherDetails } from '../api';  
import { Voucher } from '../../interface';
// import { useVoucher } from '../hooks/useVoucher';

const VoucherDetails: React.FC = () => {
  const { id } = useParams();
  const [voucher, setVoucher] = useState<Voucher | null>(null);
  
 
  // const {fetchVouchers, vouchers} = useVoucher() 

  // useEffect(() => {
  //   // Fetch voucher details on component mount
  //   getVoucherDetails(id)
  //     .then((voucher: Voucher) => setVoucher(voucher))
  //     .catch((error: Error) => console.error(error));
  // }, [id]);

  return (
    <>
      <Header>
        <h1>Voucher Details</h1>
      </Header>
      <div className="voucher-details-page">
        {voucher ? (
          <>
            <h3>{voucher.description}</h3>
            {/* Display other voucher details here */}
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default VoucherDetails;
