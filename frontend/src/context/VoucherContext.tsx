// VoucherContext.tsx
import React, { createContext, useState, useCallback } from "react";
import axios from "axios";
import { Voucher, VoucherContextProps, Props, AddVoucher } from "../interface"; // Define these types according to your needs
import { useAuth } from "../hooks/useAuth";

export const VoucherContext = createContext<VoucherContextProps | undefined>(
  undefined
);

interface ErrorResponse {
  response?: {
    data?: {
      vouchers?: string;
    };
  };
}

export const VoucherProvider: React.FC<Props> = ({ children }) => {
  const [customerVouchers, setCustomerVouchers] = useState<Array<Voucher>>([]);
  const [eateryVouchers, setEateryVouchers] = useState<Array<Voucher>>([]);
  const { token } = useAuth();

  const api = axios.create({
    baseURL: "http://127.0.0.1:5000",
  });

  const fetchQRCode = useCallback(async () => {
    try {
      const response = await api.get("api/get_short_code", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }, [token]);

  const verifyQRCode = useCallback(async (customerId: string, code:string) => {
    try {
      const response = await api.get(`api/verify_qrcode/${customerId}/${code}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.success;
    } catch (error) {
      console.error(error);
      return false
    }
  }, [token, api]);

  const fetchVouchers = useCallback(
    async (customerId: string) => {
      try {
        const response = await api.get(
          `/api/get_vouchers_customer/${customerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCustomerVouchers(response.data.vouchers);
      } catch (error) {
        console.error(error);
      }
    },
    [token]
  );

  const claimVoucher = useCallback(
    async (voucherId: string, customerId: string) => {
      try {
        const response = await api.post(
          `/api/claim_voucher`,
          {
            voucher_id: voucherId,
            customer_id: customerId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Refresh vouchers after a successful claim
        fetchVouchers(customerId);
        return response.data;
      } catch (err) {
        const error = err as ErrorResponse;
        if (error.response && error.response.data) {
          alert(error.response.data.vouchers);
        } else {
          alert("An error occurred while claiming voucher.");
        }
        throw error;
      }
    },
    [token, fetchVouchers]
  );

  const fetchVouchersForEatery = useCallback(
    async (eateryId: string) => {
      try {
        const response = await api.get(`/api/get_vouchers_eatery/${eateryId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEateryVouchers(response.data.vouchers);
      } catch (error) {
        console.error(error);
      }
    },
    [token]
  );

  const addVoucher = useCallback(
    async (formData: AddVoucher) => {
      try {
        const response = await api.post(`/api/create_voucher`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        return response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    [token]
  );

  const deleteVoucher = useCallback(
    async (voucherId: string) => {
      try {
        await api.delete(`/api/delete_voucher/${voucherId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return true; // return the success status
      } catch (error) {
        console.error(error + " ASSS");
      }
    },
    [token]
  );

  const deleteCustomerVoucher = useCallback(
    async (voucherId: string, customerId: string) => {
      try {
        await api.delete(`/api/delete_customer_voucher/${voucherId}/${customerId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return true; // return the success status
      } catch (error) {
        console.error(error);
      }
    },
    [token, api]
  );

  return (
    <VoucherContext.Provider
      value={{
        customerVouchers,
        fetchVouchers,
        claimVoucher,
        fetchVouchersForEatery,
        eateryVouchers,
        fetchQRCode,
        addVoucher,
        deleteVoucher,
        verifyQRCode,
        deleteCustomerVoucher
      }}
    >
      {children}
    </VoucherContext.Provider>
  );
};