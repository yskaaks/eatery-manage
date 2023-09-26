import Footer from "../../components/Footer/Footer";
import { useNavigate, useParams } from "react-router-dom";
import { useEateryContext } from "../../hooks/useEateryContext";
import { useAuth } from "../../hooks/useAuth";
import { FunctionComponent, useEffect, useState } from "react";
import "../../styles/EateryProfile.css";
import { getCuisines, getRating } from "../../utils/rating";
import InfoTab from "./InfoTab";
import PhotosTab from "./PhotosTab";
import ReviewsTab from "./ReviewsTab";
import VouchersTab from "./VouchersTab";
import { Eatery, User, UserRole } from "../../interface";

type TabType = 'INFO' | 'PHOTOS' | 'REVIEWS' | 'VOUCHERS';

interface TabComponentProps {
  user: User;
  eatery: Eatery;
}

const TabComponents: Record<TabType, FunctionComponent<TabComponentProps>> = {
  'INFO': InfoTab,
  'PHOTOS': PhotosTab,
  'REVIEWS': ReviewsTab,
  'VOUCHERS': VouchersTab,
};

const EateryDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { fetchEatery, eatery } = useEateryContext();
  const { user, fetchUser } = useAuth();
  const [currentTab, setCurrentTab] = useState<"INFO" | "PHOTOS" | "REVIEWS" | "VOUCHERS">("INFO");
  const [coverImage, setcoverImage] = useState<string>("");
  const { getEateryImage } = useEateryContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchEatery(id);
    }
    fetchUser();
  }, [fetchEatery, fetchUser]);

  // load cover image
  useEffect(() => {
    const fetchCoverImage = async () => {
      let coverImageUrl = "";
      if (eatery && eatery.eatery_image && eatery.eatery_image.length > 0) {
        const coverImageId = eatery.eatery_image[0];
        try {
          const url = await getEateryImage(coverImageId);
          if (url) {
            coverImageUrl = url;
          }
        } catch (error) {
          console.error(
            `Failed to fetch cover image with ID ${coverImageId}: `,
            error
          );
        }
      }
      setcoverImage(coverImageUrl);
    };
    fetchCoverImage();
  }, [getEateryImage, eatery]);

  const openCuisine = () => {
    // Pass current selected cuisinesIds
    navigate(
      `/eatery/cuisines?q=${
        eatery &&
        eatery.cuisines.map((cuisine) => cuisine.cuisine?.id).join(",")
      }`
    );
  };

  // Render one of the four tabs 
  const CurrentTabComponent = TabComponents[currentTab as TabType];
  const renderCurrentTabComponent = (
    CurrentTabComponent: FunctionComponent<TabComponentProps> | undefined,
    user: User | null,
    eatery: Eatery | null
  ) => {
    if (eatery && user && CurrentTabComponent) {
      return <CurrentTabComponent user={user} eatery={eatery} />;
    }
    return <div>No data available</div>;
  };

  return (
    <>
      <div className="profile-wrapper">
        <div className="image-header">
          {coverImage ? (
            // Used a div rather than img to set object-fit:cover at a specific height (180px)
            <div
              className="cover-image"
              style={{ backgroundImage: `url(${coverImage})` }}
            />
          ) : (
            <i
              className="glyphicon glyphicon-picture"
              style={{ opacity: "40%" }}
            />
          )}
        </div>

        <div className="eatery-content">
          <div className="title-rating-container">
            <h3>{eatery?.restaurant_name}</h3>
            <p className="rating">
              {eatery && eatery.reviews ? getRating(eatery.reviews) : ""}
            </p>
          </div>
          <p>
            Cuisine(s): {eatery ? getCuisines(eatery): ""}
            
            {user && user.role === UserRole.EATERY && (
              <button 
                className="edit-button" 
                title="Add/Remove Cuisines" 
                onClick={openCuisine}
              >
                <i className="glyphicon glyphicon-edit" />
              </button>
            )}
            
          </p>
          {/* <p>price in $$$$</p> */}
          {eatery?.is_open_now ? (
            <p style={{ color: "green" }}>Open now</p>
          ) : (
            <p style={{ color: "red" }}>Closed</p>
          )}

          <div className="info-photos-reviews-button-container">
            <button
              className="content-button"
              onClick={() => setCurrentTab("INFO")}
            >
              <i className={`glyphicon glyphicon-info-sign gl ${currentTab === "INFO" ? "glyphicon-selected" : ""}`} />
              <p>info</p>
            </button>
            <button
              className="content-button"
              onClick={() => setCurrentTab("PHOTOS")}
            >
              <i className={`glyphicon glyphicon-picture gl ${currentTab === "PHOTOS" ? "glyphicon-selected" : ""}`} />
              <p>photos</p>
            </button>
            <button
              className="content-button"
              onClick={() => setCurrentTab("REVIEWS")}
            >
              <i className={`glyphicon glyphicon-comment gl ${currentTab === "REVIEWS" ? "glyphicon-selected" : ""}`} />
              <p>reviews</p>
            </button>
            <button
              className="content-button"
              onClick={() => setCurrentTab("VOUCHERS")}
            >
              <i className={`glyphicon glyphicon-credit-card gl ${currentTab === "VOUCHERS" ? "glyphicon-selected" : ""}`}></i>
              <p>vouchers</p>
            </button>
          </div>
          
          {renderCurrentTabComponent(CurrentTabComponent, user, eatery)}
        
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EateryDetails;
