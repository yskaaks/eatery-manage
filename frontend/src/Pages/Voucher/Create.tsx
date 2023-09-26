import { FormEvent, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/Voucher.css";
import { useVoucher } from "../../hooks/useVoucher";
import { AddVoucher } from "../../interface";
import moment from "moment";

const App: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<AddVoucher>({
    description: "",
    eatery_id: id, // Assuming 'id' is a string representing the initial value for eatery_id
    quantity: 0,
    start: "",
    expiry: "",
  });
  const { addVoucher } = useVoucher();
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (id) {
      const success = await addVoucher(formData);
      if (success) {
        navigate(-1);
      } else {
        console.error("Failed to add voucher");
      }
    }
  };
  const [startDate, setStartDate] = useState(null);
  const [expiryDate, setExpiryDate] = useState(null);
  // Function to update the formData start property when the date is selected
  const handleStartDateChange = (date: DatePicker, feild: string) => {
    if (feild === "start") {
      setStartDate(date);
    } else {
      setExpiryDate(date);
    }
    // Convert the selected date to a string format (as api needed)
    const dateString = date ? moment(date).format("HH:mm:ss DD/MM/yyyy") : "";

    setFormData({
      ...formData,
      [feild]: dateString, // Update the formData with the selected date
    });
  };

  return (
    <>
      <div className="add-voucher-container">
        <button className="voucher-back-step" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left"></i>
          <h2 className="voucher-title">Add Voucher</h2>
        </button>

        <form onSubmit={handleSubmit} className="add-voucher-form">
          <label className="voucher-text-container">
            <label className="mt-2">Quantity</label>
            <input
              type="number"
              value={formData.quantity}
              name="quantity"
              className="form-control"
              onChange={handleChange}
            />
          </label>
          <label className="voucher-text-container">
            <label className="mt-4">Start</label>
            <DatePicker
              selected={startDate}
              onChange={(date: DatePicker) => handleStartDateChange(date, "start")}
              showTimeSelect
              className="form-control"
              dateFormat="MMM dd,yyyy HH:mm"
              minDate={new Date()} // This will disable previous dates
             
            />
          </label>
          <label className="voucher-text-container">
            <label>Expiry</label>
            <DatePicker
              selected={expiryDate}
              onChange={(date: DatePicker) => handleStartDateChange(date, "expiry")}
              showTimeSelect
              className="form-control"
              dateFormat="MMM dd,yyyy HH:mm"
              minDate={new Date()} // This will disable previous dates
            />
          </label>
          <label className="voucher-text-container">
            <label className="mt-4">Description</label>
            <textarea
              rows={2}
              value={formData.description}
              name="description"
              className="form-control"
              onChange={handleChange}
            />
          </label>
          <button type="submit" className="submit-button mt-4">
            Add Voucher
          </button>
        </form>
      </div>
    </>
  );
};

export default App;
