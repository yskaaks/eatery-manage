// SignUp.tsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import "../../styles/SignUp.css";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { RegisterFormInputs } from "../../interface";

const libraries: (
  | "places"
  | "drawing"
  | "geometry"
  | "localContext"
  | "visualization"
)[] = ["places"];

const SignUp: React.FC = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  // Create a ref to hold the autocomplete instance
  const autocompleteRef = React.useRef<google.maps.places.Autocomplete | null>(
    null
  );

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;

    // Customize the Autocomplete instance here
    autocomplete.setOptions({
      types: ["geocode"], // Types to search for, in this case, geocode to get address suggestions
      componentRestrictions: { country: "au" }, // Restrict results to Australia
      fields: ["formatted_address", "geometry"], // Only retrieve formatted_address and geometry data
    });
  };

  const handlePlaceChanged = () => {
    const autocomplete = autocompleteRef.current;
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place) {
        setValue("location", place.formatted_address);
        setValue("latitude", place.geometry.location.lat());
        setValue("longitude", place.geometry.location.lng());
      }
    }
  };

  const { register, handleSubmit, setValue } = useForm<RegisterFormInputs>();
  const [role, setRole] = useState<string>("");
  const { register: registerUser } = useAuth();
  // success or failure to signUp/signIn message shown to client
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const validateForm = (data: RegisterFormInputs) => {
    const { name, email, password, location, latitude, longitude } = data;
    if (!name) return "Please enter your name";
    if (!email) return "Please enter your email";
    if (!password) return "Please enter your password";
    if (!role) return "Please select a role";
    if (!location && role === "eatery") return "Please enter your location";
    if ((!latitude || !longitude) && role === "eatery") return "Please provide latitude and longitude";
    return null;
  };

  const onSubmit = async (data: RegisterFormInputs) => {
    // Update this to include userType from state, not from form
    const { name, email, password, location, latitude, longitude } = data;

    const validationError = validateForm(data);
    if (validationError) {
      setMessage(validationError);
      return;
    }

    try {
      const success = await registerUser(
        email,
        password,
        name,
        role,
        location,
        latitude,
        longitude
      );

      if (success) {
        setMessage("success");
        const userRole = localStorage.getItem("role");
        const id = localStorage.getItem("id");
        if (userRole === "eatery") {
          navigate(`/restaurant/${id}`);
        } else {
          navigate("/auth/cuisine-form");
        }
      } else {
        setMessage("email is already registered");
      }
    } catch {
      setMessage("email is already registered");
    }
  };  

  return (
    <div className="signup-container">
      <h2 className="signup-title">
        Create an account or&nbsp;
        <div onClick={() => navigate("/auth/login")} className="title-link">
          log in
        </div>
      </h2>
      <p className="signup-sub-title">Create a new account below or log in</p>
      <form onSubmit={handleSubmit(onSubmit)} className="signup-form">
        <input
          {...register("name")}
          placeholder="Name"
          className="input-field"
        />
        <input
          {...register("email")}
          placeholder="Email"
          type="email"
          className="input-field"
        />
        <input
          {...register("password")}
          placeholder="Password"
          type="password"
          className="input-field"
        />
        <div className="user-type-select">
          <button
            type="button"
            onClick={() => setRole("customer")}
            className={role === "customer" ? "selected" : ""}
          >
            I'm a Customer
          </button>
          <button
            type="button"
            onClick={() => setRole("eatery")}
            className={role === "eatery" ? "selected" : ""}
          >
            I'm a Restaurant Owner
          </button>
        </div>
        {role === "eatery" && isLoaded && (
          <Autocomplete
            onLoad={onLoad}
            onPlaceChanged={handlePlaceChanged}
            className="address-autocomplete"
          >
            <input
              {...register("location")}
              placeholder="Restaurant Address"
              className="input-field"
            />
          </Autocomplete>
        )}

        <button type="submit" className="submit-button">
          Sign Up
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SignUp;