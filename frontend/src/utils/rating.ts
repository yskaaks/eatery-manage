import { Eatery, Review } from "../interface";

export const getStarRating = (reviews: Review[]) =>  {
    let totalRating = 0;
    let averageRating = 0;
    if (reviews) { 
      totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      averageRating = (totalRating / reviews.length) / 2;
      averageRating = Math.round(averageRating * 10) / 10;
    }
    let stars = '';
    const fullStars = Math.floor(averageRating);
    const halfStar = (averageRating % 1) >= 0.5 ? true : false;
  
    // Append full stars
    for(let i = 0; i < fullStars; i++) {
      stars += '<i class="bi bi-star-fill"></i>'; 
    }
    
    // Append half star if needed
    if (halfStar) {
      stars += '<i class="bi bi-star-half"></i>';
    }

    // Append empty stars
    for(let i = fullStars + (halfStar ? 1 : 0); i < 5; i++) {
      stars += '<i class="bi bi-star"></i>';
    }
    
    return stars;
  };

export const getRating = (reviews: Review[]) => { 
  let totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  let averageRating = (totalRating / reviews.length);
  averageRating = Math.round(averageRating * 10) / 10;

  return averageRating;
}

export const getCuisines = (eatery: Eatery) => { 
  return eatery.cuisines.map(cuisine => cuisine.cuisine.cuisine_name).join(", "); 
}