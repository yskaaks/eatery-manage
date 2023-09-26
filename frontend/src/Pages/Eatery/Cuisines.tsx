import React, { useState, FormEvent, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/CuisineForm.css";
import { useEateryContext } from "../../hooks/useEateryContext";
import Header from "../../components/Header/Header";

// Select 5

const MenuCuisines: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const q = queryParams.get("q")?.split(",").map(Number);

  const [selectedCuisines, setSelectedCuisines] = useState<number[]>(q ?? []);

  const navigate = useNavigate();
  const { getAllCuisines, allCuisines, addMenuCuisines } = useEateryContext();

  const handleButtonClick = (value: number) => {
    setSelectedCuisines((prevCuisines) =>
      prevCuisines.includes(value)
        ? prevCuisines.filter((cuisine) => cuisine !== value)
        : prevCuisines.length < 5
        ? [...prevCuisines, value]
        : prevCuisines
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // After updating 'selectedCuisines' with the initial values, remove 0s
    const filteredSelectedCuisines = selectedCuisines.filter(
      (cuisineId) => cuisineId !== 0
    );

    if (filteredSelectedCuisines) {
      const success = await addMenuCuisines(filteredSelectedCuisines || []);
      if (success) {
        navigate(-1);
      } else {
        console.error("Failed to add review");
      }
    }
  };

  useEffect(() => {
    getAllCuisines();
  }, [getAllCuisines]);

  return (
    <>
      <Header>
        <h3>Select Upto 5 Menu Cuisines</h3>
      </Header>
      <div>
        <form onSubmit={handleSubmit} className="cuisine-form">
          {allCuisines?.map((cuisine) => (
            <button
              key={cuisine.id}
              type="button"
              className={
                selectedCuisines.includes(cuisine.id)
                  ? "cuisine-item selected"
                  : "cuisine-item"
              }
              onClick={() => handleButtonClick(cuisine.id)}
            >
              {cuisine.cuisine_name}
            </button>
          ))}
          <button
            type="submit"
            className="submit-button"
            style={{ gridColumn: "1/3", marginTop: "5px" }}
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default MenuCuisines;
