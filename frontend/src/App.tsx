import SignUp from "./Pages/Auth/SignUp";
import CustomerMap from "./Pages/Customer";
import CustomerProfile from "./Pages/Customer/Profile";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import SignIn from "./Pages/Auth/SignIn";
import Home from "./Pages/Home";
import { EateryProvider } from "./context/EateryContext";
import { VoucherProvider } from "./context/VoucherContext";
import RestaurantList from "./Pages/Customer/RestaurantList";
import ForgotPassword from "./Pages/Auth/ForgotPassword";
import ResetPassword from "./Pages/Auth/ResetPassword";
import AddReview from "./Pages/Customer/AddReview";
import Wallet from "./Pages/Customer/Wallet";
import VoucherDetail from "./Pages/Voucher/Detail";
import VoucherCreate from "./Pages/Voucher/Create";
import { CuisineForm } from "./Pages/Auth/CuisineForm";
import WalletVouchers from "./Pages/Customer/WalletVouchers";
import EateryCuisines from "./Pages/Eatery/Cuisines";
import EateryUserProfile from "./Pages/Eatery/UserProfile";
import EateryDetails from "./Pages/EateryDetails";
import ScannedCustomerVouchers from "./Pages/QR/CustomerVouchers";

const App = () => {
  return (
    <div className="app-outer">
      <div className="app-inner">
        <AuthProvider>
          <EateryProvider>
            <VoucherProvider>
              <Router>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/auth/register" element={<SignUp />} />
                  <Route path="/auth/login" element={<SignIn />} />
                  <Route path="/auth/cuisine-form" element={<CuisineForm />} />
                  <Route
                    path="/auth/forgot-password"
                    element={<ForgotPassword />}
                  />
                  <Route
                    path="/auth/reset-password"
                    element={<ResetPassword />}
                  />

                  <Route path="/restaurant/map" element={<CustomerMap />} />
                  <Route path="/profile" element={<CustomerProfile />} />
                  <Route path="/restaurants" element={<RestaurantList />} />
                  <Route path="/add-review/:id" element={<AddReview />} />

                  <Route path="/customer/wallet" element={<Wallet />} />
                  <Route path="/voucher/:id" element={<VoucherDetail />} />
                  <Route
                    path="/restaurant/:id/voucher/add"
                    element={<VoucherCreate />}
                  />

                  <Route path="/restaurant/:id" element={<EateryDetails />} />
                  <Route path="/eatery/cuisines" element={<EateryCuisines />} />
                  <Route
                    path="/eatery/user/profile"
                    element={<EateryUserProfile />}
                  />
                  <Route
                    path="/customer/:id/scanned/vouchers"
                    element={<ScannedCustomerVouchers />}
                  />
                  <Route
                    path="/wallet/vouchers/:id"
                    element={<WalletVouchers />}
                  />
                </Routes>
              </Router>
            </VoucherProvider>
          </EateryProvider>
        </AuthProvider>
      </div>
    </div>
  );
};

export default App;
