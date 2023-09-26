import Header from "../../components/Header/Header";
import { useEateryContext } from "../../hooks/useEateryContext";
import { useEffect, useState } from "react";
import "../../styles/RestaurantList.css";
import Footer from "../../components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import { Eatery } from "../../interface";

interface UserPosition {
  lat: number;
  lon: number;
}

const initialUserPosition: UserPosition = {
  lat: 0,
  lon: 0,
};

const RestaurantList = () => {
  const {
    eateries,
    fetchEateries,
    fetchRecommendedEateries,
    recommendedEateries,
  } = useEateryContext();
  const navigate = useNavigate();
  const [userPosition, setUserPosition] =
    useState<UserPosition>(initialUserPosition);

  const checkToken = localStorage.getItem("token");
  const [activeTab, setActiveTab] = useState<"all" | "recommended">("all");
  const [recommendedEateriesList, setRecommendedEateriesList] = useState<
    Eatery[]
  >([]);

  useEffect(() => {
    // Filter the eateries based on the keys present in recommendedEateries
    const filteredEateries = eateries.filter(
      (eatery) => recommendedEateries[eatery.id]
    );

    // Sort the filtered eateries by recommendedEateries values in descending order
    const sortedRecommendedEateries = filteredEateries.sort(
      (a, b) => recommendedEateries[b.id] - recommendedEateries[a.id]
    );

    setRecommendedEateriesList(sortedRecommendedEateries);
  }, [eateries, recommendedEateries]);

  if (!checkToken) {
    navigate("/");
  }
  useEffect(() => {
    fetchEateries();
  }, [fetchEateries]);

  // fetch Recommended Eateries
  useEffect(() => {
    if (userPosition.lat && userPosition.lon) {
      fetchRecommendedEateries(userPosition.lat, userPosition.lon);
    }
  }, [userPosition]);

  useEffect(() => {
    // Check if the browser supports geolocation
    if (navigator.geolocation) {
      // Get the user's position
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported in this browser.");
    }
  }, []);

  useEffect(() => {
    if (!checkToken) {
      navigate("/");
    }
  }, [checkToken, navigate]);

  if (!checkToken) {
    return null;
  }

  const getAverageRating = (eatery: Eatery) => {
    const totalRatings = eatery.reviews?.reduce(
      (prev, current) => prev + current.rating,
      0
    );
    const averageRating = totalRatings
      ? Math.round((totalRatings / eatery.reviews!.length) * 10) / 10
      : 0;
    return averageRating;
  };
  const renderEateries =
    activeTab === "all" ? eateries : recommendedEateriesList;

  return (
    <>
      <Header>
        <h3>Lunch near you</h3>
      </Header>
      <div className="tabs-container">
        <div
          className={`tab ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          All
        </div>
        <div
          className={`tab ${activeTab === "recommended" ? "active" : ""}`}
          onClick={() => setActiveTab("recommended")}
        >
          Recommended
        </div>
      </div>
      <div className="list-container">
        {renderEateries && renderEateries.length > 0 ? (
          renderEateries.map((eatery) => (
            <div
              key={eatery.id}
              className="list-item"
              onClick={() => {
                navigate(`/restaurant/${eatery.id}`);
              }}
              style={{ cursor: "pointer" }}
            >
              <div className="title-rating-container">
                <h3>{eatery.restaurant_name}</h3>
                <div className="rating">{getAverageRating(eatery)}</div>
              </div>

              <p>
                Cuisines:{" "}
                {eatery.cuisines
                  .map((cuisine) => cuisine?.cuisine.cuisine_name)
                  .join(", ")}
              </p>
              <p>Email: {eatery.email}</p>
              {/* <img src={eatery.image} alt={eatery.name}/> */}
              <p>Address: {eatery.location}</p>
            </div>
          ))
        ) : (
          <div className="text-center">
            {activeTab === "all"
              ? "No Eatery Found"
              : "No Recommended Eatery Found Or check if browser location is enabled to see better Recommendations."}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default RestaurantList;