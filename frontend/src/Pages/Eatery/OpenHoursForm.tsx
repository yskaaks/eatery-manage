import React, { useState } from "react";
import { CreateOpeningHours } from "../../interface";

interface OpeningHoursFormProps {
  initialValues: CreateOpeningHours[];
  onSubmit: (data: CreateOpeningHours[]) => void;
}

const daysOfWeek: string[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const OpeningHoursForm: React.FC<OpeningHoursFormProps> = ({
  initialValues,
  onSubmit,
}) => {
  const [openingHours, setOpeningHours] =
    useState<CreateOpeningHours[]>(initialValues);

  const handleChange = (
    day: string,
    key: keyof CreateOpeningHours,
    value: string | boolean
  ) => {
    setOpeningHours((prev) =>
      prev.map((item) =>
        item.day_of_week === day ? { ...item, [key]: value } : item
      )
    );
  };

  const handleSubmit = () => {
    onSubmit(openingHours);
  };

  return (
    <form className="add-open-hours-form">
      <table className="opening-hours-table">
        <thead>
          <tr>
            <th>Day</th>
            <th>Opening</th>
            <th>Closing</th>
            <th>Closed</th>
          </tr>
        </thead>
        <tbody>
          {daysOfWeek.map((day) => (
            <tr key={day}>
              <td>{day}</td>
              <td>
                <input
                  className="form-control"
                  type="time"
                  value={
                    openingHours.find((item) => item.day_of_week === day)
                      ?.opening_time || ""
                  }
                  onChange={(e) =>
                    handleChange(day, "opening_time", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="time"
                  step="1800"
                  className="form-control"
                  value={
                    openingHours.find((item) => item.day_of_week === day)
                      ?.closing_time || ""
                  }
                  onChange={(e) =>
                    handleChange(day, "closing_time", e.target.value)
                  }
                />
              </td>
              <td>
                <label>
                  <input
                    type="checkbox"
                    checked={
                      openingHours.find((item) => item.day_of_week === day)
                        ?.is_closed || false
                    }
                    onChange={(e) =>
                      handleChange(day, "is_closed", e.target.checked)
                    }
                  />
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" className="btn btn-primary" onClick={handleSubmit}>
        Submit 
      </button>
    </form>
  );
};

export default OpeningHoursForm;
