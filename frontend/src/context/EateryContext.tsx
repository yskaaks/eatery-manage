// EateryContext.tsx

import axios from "axios";
import React, { createContext, useState, useCallback } from "react";
import {
  Eatery,
  EateryContextProps,
  Images,
  Props,
  Review,
  Cuisine,
  CreateOpeningHours,
  UpdateLoyaltyPoints,
} from "../interface";
import { useAuth } from "../hooks/useAuth";

export const EateryContext = createContext<EateryContextProps | undefined>(
  undefined
);

export const EateryProvider: React.FC<Props> = ({ children }) => {
  const [eateries, setEateries] = useState<Array<Eatery>>([]);
  const [recommendedEateries, setRecEateries] = useState({});
  const [eatery, setEatery] = useState<Eatery | null>(null);
  const [review, setReview] = useState<Review | null>(null);
  const [allReviews, setallReviews] = useState<Array<Review>>([]);
  const [allCuisines, setAllCuisines] = useState<Array<Cuisine>>([]);
  const [eateryImages, setEateryImages] = useState<Images | null>(null);
  const { token } = useAuth();

  const api = axios.create({
    baseURL: "http://127.0.0.1:5000",
  });

  const addImage = useCallback(
    async (imageFile: File) => {
      try {
        const formData = new FormData();
        formData.append("file", imageFile);
        const config = {
          headers: {
            "content-type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await api.post("/api/add_image", formData, config);
        return response.data.success; // return the success status
      } catch (error) {
        console.error(error);
      }
    },
    [token]
  );

  const deleteImage = useCallback(
    async (imageId: string) => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { image_id: imageId },
        };
        const response = await api.delete("/api/delete_image", config);
        return response.data.success; // return the success status
      } catch (error) {
        console.error(error);
      }
    },
    [token]
  );

  const getEateryImage = useCallback(async (imageId: string) => {
    try {
      const response = await api.get(`/api/get_image/${imageId}`, {
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "image/jpeg" });
      const imageUrl = window.URL.createObjectURL(blob);
      return imageUrl;
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fetchEateries = useCallback(async () => {
    try {
      const response = await api.get("/api/eatery", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEateries(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [token]);

  const fetchEatery = useCallback(
    async (id: string) => {
      try {
        const response = await api.get(`/api/eatery/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEatery(response.data);
        return response.data;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    [token]
  );

  const fetchEateryImages = useCallback(
    async (eateryId: string) => {
      try {
        const response = await api.post(
          "/api/get_images",
          { eatery_id: eateryId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEateryImages(response.data);
      } catch (error) {
        console.error(error);
      }
    },
    [token]
  );

  const getReview = useCallback(
    async (eateryId: string) => {
      try {
        const response = await api.post(
          "/api/get_review",
          { eatery_id: eateryId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setReview(response.data);
        return response.data;
      } catch (error) {
        console.error(error);
      }
    },
    [token]
  );

  const getAllReviews = useCallback(
    async (eateryId: string) => {
      try {
        const response = await api.post(
          "/api/get_all_reviews",
          { eatery_id: eateryId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setallReviews(response.data.reviews);
        return response.data.reviews;
      } catch (error) {
        console.error(error);
      }
    },
    [token]
  );

  const addReview = useCallback(
    async (eateryId: string, rating: string, reviewText: string) => {
      try {
        const response = await api.post(
          "/api/add_review",
          {
            eatery_id: eateryId,
            rating,
            review_text: reviewText,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data; // return the success status
      } catch (error) {
        console.error(error);
      }
    },
    [token]
  );

  const deleteReview = useCallback(
    async (reviewId: string) => {
      try {
        const response = await api.delete(`/api/delete_review/${reviewId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data.success; // return the success status
      } catch (error) {
        console.error(error + " ASSS");
      }
    },
    [token]
  );

  const getAllCuisines = useCallback(async () => {
    try {
      const response = await api.get("/api/cuisines", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAllCuisines(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }, [token]);

  // Add or Update Menu Cuisines
  const addMenuCuisines = useCallback(
    async (cuisineIds: number[]) => {
      try {
        const response = await api.post(
          "/api/cuisines",
          { cuisineIds },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data; // return the success status
      } catch (error) {
        console.error(error);
      }
    },
    [token]
  );

  // Update Eatery Open Hours
  const addOpenHours = useCallback(
    async (formData: CreateOpeningHours[]) => {
      try {
        const response = await api.post(`/api/eatery/opening_hours`, formData, {
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
  // Add or Deduct Customer loyality points from scanned screen
  const updateLoyaltyPoints = useCallback(
    async (formData: UpdateLoyaltyPoints) => {
      try {
        const response = await api.post(`/api/loyalty/points`, formData, {
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

  // Add Scaaned Customer to loyalty program
  const addCustomerToLoyalty = useCallback(async (eateryId: string, customerId: string) => {
    try {
      await api.get(`/api/loyalty/program/${eateryId}/${customerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return true;
    } catch (error) {
      console.error(error);
      return false
    }
  }, [token, api]);

  // Get Recommended Eateries
  const fetchRecommendedEateries = useCallback(
    async (lat: number, lon: number) => {
      try {
        const response = await api.get(`/api/get_eatery_preferences?lat=${lat}&lon=${lon}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRecEateries(response.data);
        return response.data;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    [token, api]
  );
  return (
    <EateryContext.Provider
      value={{
        fetchEateryImages,
        fetchEateries,
        eateries,
        fetchEatery,
        eatery,
        eateryImages,
        token,
        review,
        allReviews,
        getReview,
        getAllReviews,
        addReview,
        deleteReview,
        addImage,
        getEateryImage,
        deleteImage,
        getAllCuisines,
        allCuisines,
        addMenuCuisines,
        addOpenHours,
        updateLoyaltyPoints,
        addCustomerToLoyalty,
        recommendedEateries,
        fetchRecommendedEateries,
      }}
    >
      {children}
    </EateryContext.Provider>
  );
};