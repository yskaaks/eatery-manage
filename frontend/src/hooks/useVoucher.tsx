import { useContext } from 'react';
import { VoucherContext } from '../context/VoucherContext';

export const useVoucher = () => {
    const context = useContext(VoucherContext);
    if (!context) {
      throw new Error('useVoucher must be used within a voucherProvider');
    }
    return context;
  };