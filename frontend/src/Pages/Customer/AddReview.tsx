import { FormEvent, useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { useEateryContext } from "../../hooks/useEateryContext";
import "../../styles/addReview.css"
import { useAuth } from "../../hooks/useAuth";
const AddReview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addReview } = useEateryContext();
  const navigate = useNavigate();
  const {fetchUser, user} = useAuth()
  
  useEffect(() => { 
    fetchUser()
  },[fetchUser])

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (id) { 
      const success = await addReview(id, String(rating), reviewText);
      if (success) {
        navigate(`/restaurant/${id}`);
      } else {
        console.error("Failed to add review");
      }
    }
  };

  const handleStarClick = (i: number) => {
    setRating(i);
  };

  return (
    <>
      <div className="add-review-container">
        <button className="review-back-step" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left"></i>
          <h2 className="review-title">Write Review</h2>
        </button>

        <div className="display-user">
          <i className="bi bi-person-circle"></i>
          <h2>{user?.name}</h2>
        </div>

        <form onSubmit={handleSubmit} className="add-review-form">

          <label className="review-text-container">
            <textarea value={reviewText} className="review-text" onChange={e => setReviewText(e.target.value)} />
          </label>

          <label>
            Rating:
            {[...Array(5)].map((star, i) => {
              const ratingValue = i + 1;
              return (
                <i 
                  key={i} 
                  className={`bi ${ratingValue <= rating ? "bi-star-fill" : "bi-star"}`} 
                  onClick={() => handleStarClick(ratingValue)}
                >
                </i>
              );
            })}
          </label>


          <button type="submit" className="submit-button">Submit Review</button>
        </form>
      </div>
    </>    
  );
};

export default AddReview;
