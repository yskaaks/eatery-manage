// InfoTab.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { CreateOpeningHours, TabProps, UserRole } from "../../interface";
import { useEateryContext } from "../../hooks/useEateryContext";
import OpeningHoursForm from "../Eatery/OpenHoursForm";

const daysOfWeek: string[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const defaultOpeningTime = "09:00";
const defaultClosingTime = "18:00";

const InfoTab: React.FC<TabProps> = ({eatery, user}) => {
  const navigate = useNavigate();
  const { fetchEatery, addOpenHours } = useEateryContext();
  const [hoursEditable, setHoursEditable] = useState(false);

  const initialOpeningHours: CreateOpeningHours[] =
    eatery?.opening_hours && eatery?.opening_hours.length > 0
      ? eatery?.opening_hours
      : daysOfWeek.map((day) => ({
          eatery_id: Number(eatery.id) ?? 0,
          day_of_week: day,
          opening_time: defaultOpeningTime,
          closing_time: defaultClosingTime,
          is_closed: false,
    }));

  const handleHoursFormSubmit = async (data: CreateOpeningHours[]) => {
    if (eatery.id) {
      const success = await addOpenHours(data);
      if (success) {
        fetchEatery(eatery.id);
        setHoursEditable(!hoursEditable);
      } else {
        console.error("Failed to add voucher");
      }
    }
  };
  console.log(eatery.opening_hours)

  return (
    <div className="info">
      <hr />

      <h4>
        <strong>Address</strong>
      </h4>
      <p>{eatery.location}</p>
      <button
        className="show-eatery"
        onClick={() => navigate("/restaurant/map", { state: { eatery } })}
      >
        Show Eatery on Map
      </button>

      <hr />

      <h4>
        <strong>Opening Hours</strong>

        {user.role === UserRole.EATERY && (<i
          className="glyphicon glyphicon-edit"
          style={{ cursor: "pointer", marginLeft: 10 }}
          title="Edit Opining Hours"
          onClick={() => setHoursEditable(!hoursEditable)}
        />)}
        
      </h4>
      <div 
        className="opening-hours"
        style={hoursEditable ? {"marginLeft": "-7px"} : {}}>
        
        {hoursEditable ? (
          <OpeningHoursForm
            initialValues={initialOpeningHours}
            onSubmit={handleHoursFormSubmit}
          />
        ) :
          eatery.opening_hours.map((obj, index) => (
            <div className="hour-div" key={index}>
              <p>
                <strong>{obj.day_of_week}:</strong>{" "}
                <span className={obj.is_closed ? "closed" : ""}>
                  {obj.is_closed
                    ? "Closed"
                    : `${obj.opening_time} - ${obj.closing_time}`}
                </span>
              </p>
            </div>
          ))}

      </div>
    </div>
  );
};

export default InfoTab;