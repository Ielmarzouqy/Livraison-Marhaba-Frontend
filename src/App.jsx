import { Route, Routes } from "react-router";
import { RootLayout } from "./shared/layouts";
import { NotFoundPage } from "./shared/pages";
import AuthRoutes from "./features/auth/routes/AuthRoutes";
import MailRoutes from "./features/mail/routes/MailRoutes";
import DeliveryTrackingRoutes from "./features/deliveryTracking/routes/DeliveryTrackingRoutes";
import { AuthMiddleware } from "./features/auth/middlewares";

import MenuRoutes from "./features/menu/routes/menuRoutes";
import SearchMapRoutes from "./features/searchMap/routes/SearchMapRoutes";
import LandingPage from "./shared/pages/LandingPage"
import ProductRoutes from "./features/products/routes/ProductRoutes";
import AdminRoutes from "./features/adminDashboard/routes/AdminRoutes";
import DeliveryRoutes from "./features/delivery/routes/DeliveryRoute";





function App() {
  return (
    
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<LandingPage/>} />
        <Route path="/auth/*" element={<AuthRoutes />} />
        <Route path="/mail/*" element={<MailRoutes />} />
        <Route
          path="/delivery-tracking/*"
          element={
            <AuthMiddleware>
              <DeliveryTrackingRoutes />
            </AuthMiddleware>
          }
        />
        <Route path="/menu/*" element={<MenuRoutes />} />
        <Route path="/search/*" element={<SearchMapRoutes />} />
        <Route path="/products/*" element={<ProductRoutes />} />
        <Route path="/dashboard/*" element={<AdminRoutes />} />
        <Route path="/delivery/*" element={
          <AuthMiddleware>
            <DeliveryRoutes />
          </AuthMiddleware>
        }
         />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>

  );
}

export default App;
