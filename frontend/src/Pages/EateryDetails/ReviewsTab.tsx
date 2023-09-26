import { useNavigate } from "react-router-dom";
import { TabProps, UserRole } from "../../interface";
import { useEateryContext } from "../../hooks/useEateryContext";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";

const ReviewsTab: React.FC<TabProps> = ({ eatery, user }) => {
  const navigate = useNavigate();

  const { fetchEatery, deleteReview } = useEateryContext ();
  const [users, setUsers] = useState<{ [key: string]: any }>({});
  const { getUserById } = useAuth();

  // get user's name from review[].customer_id
  useEffect(() => {
    if (eatery?.reviews) {
      const userIds = eatery.reviews.map((r) => r.customer_id);
      const userPromises = userIds.map((id) => getUserById(id));
      Promise.all(userPromises).then((usersData) => {
        const usersObj = usersData.reduce(
          (acc, user) => (user ? { ...acc, [user.id]: user } : acc),
          {}
        );
        setUsers(usersObj);
      });
    }
  }, [eatery, getUserById]);

  const handleDeleteReview = async (reviewId: string) => {
    await deleteReview(reviewId);
    if (eatery.id) {
      fetchEatery(eatery.id);
    }
  };
  
  return (
    <div className="display-reviews">
      {eatery?.reviews.map((review, index) => (
        <div key={index} className="list-item">
          <div className="title-rating-container">
            <div>Rating: {review.rating}</div>
            {user?.id === review.customer_id && user.role === "customer" && (
              <button onClick={() => handleDeleteReview(review.id)}>
                <i
                  className="bi bi-trash gl"
                  style={{ padding: "10px" }}
                ></i>
              </button>
            )}
          </div>
          <div>Review: {review.review_text}</div>
          <div>User: {users[review.customer_id]?.name}</div>
        </div>
      ))}
      {user.role === UserRole.CUSTOMER && (<button
        className="add-review"
        onClick={() => navigate(`/add-review/${eatery.id}`)}
      >
        Add Review
      </button>)}
    </div>
  );
};

export default ReviewsTab;
