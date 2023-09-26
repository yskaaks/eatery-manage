import { useContext } from 'react';
import { EateryContext } from '../context/EateryContext';

export const useEateryContext = () => {
    const context = useContext(EateryContext);
    if (!context) {
      throw new Error('useEateryContext must be used within a RestaurantProvider');
    }
    return context;
  };