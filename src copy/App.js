import Login from "./AppHome/LoginRegister/Login/Login";
import Register from "./AppHome/LoginRegister/Register/Register";
import ResetPassword from "./AppHome/LoginRegister/ResetPassword/ResetPassword";
import SendOTP from "./AppHome/LoginRegister/SendOTPToMail/SendOtp";
import AppHome from "./AppHome/Home/Home";
import AppAbout from "./AppHome/About/About";
import CustomerHome from "./Users/Customer/CustomerHome/CustomerHome";
import CustomerCreateOrder from "./Users/Customer/CustomerCreateOrder/CustomerNewOrder";
import CustomerProfile from "./Users/Customer/CustomerProfile/CustomerProfile";
import CustomerAllOrder from "./Users/Customer/CustomerAllOrder/CustomerAllOrder";
import CustomerViewSingleOrder from "./Users/Customer/CustomerViewSingleOrder/CustomerViewSingleOrder";
import AdminLogin from "./Users/Admin/AdminLogin/AdminLogin";
import AdminHome from "./Users/Admin/AdminHome/AdminHome";
import AdminViewAllCustomers from "./Users/Admin/AdminViewAllCustomers/AdminViewAllCustomers";
import AdminViewAllOrders from "./Users/Admin/AdminViewAllOrders/AdminViewAllOrders";
import AdminViewAllDrafters from "./Users/Admin/AdminViewAllDrafters/AdminViewAllDrafters";
import AdminViewSingleOrder from "./Users/Admin/AdminViewSingleOrder/AdminViewSingleOrder";
import AdminCreateDrafter from "./Users/Admin/AdminAddDrafter/AdminAddDrafter";
import DrafterLogin from "./Users/Drafter/DrafterLogin/DrafterLogin";
import DrafterHome from "./Users/Drafter/DrafterHome/DrafterHome";
import DrafterProfile from "./Users/Drafter/DrafterProfile/DrafterProfile";
import DrafterShowAllAssigments from "./Users/Drafter/DrafterShowAllAssigments/DrafterShowAllAssigments";
import DrafterViewSingleOrder from "./Users/Drafter/DrafterViewSingleOrder/DrafterViewSingleOrder";

import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import AppFooter from "./AppFooter/AppFooter";
function App() {
  return (
    <>
      <div>
        <Router>
          <Switch>
            <Route exact path="/" component={AppHome} />
            <Route exact path="/about-us" component={AppAbout} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/reset-password" component={ResetPassword} />
            <Route exact path="/sendOTP" component={SendOTP} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/customer/home" component={CustomerHome} />
            <Route path="/customer/neworder" component={CustomerCreateOrder} />
            <Route path="/customer/allorders" component={CustomerAllOrder} />
            <Route
              path="/customer/order/:id"
              component={CustomerViewSingleOrder}
            />
            <Route path="/customer/profile" component={CustomerProfile} />
            <Route path="/admin/login" component={AdminLogin} />
            <Route path="/admin/home" component={AdminHome} />
            <Route path="/admin/viewallorders" component={AdminViewAllOrders} />
            <Route
              path="/admin/viewallcustomers"
              component={AdminViewAllCustomers}
            />
            <Route
              path="/admin/viewalldrafters"
              component={AdminViewAllDrafters}
            />
            <Route path="/admin/order/:id" component={AdminViewSingleOrder} />
            <Route path="/admin/adddrafter" component={AdminCreateDrafter} />
            <Route path="/drafter/login" component={DrafterLogin} />
            <Route path="/drafter/home" component={DrafterHome} />
            <Route path="/drafter/profile" component={DrafterProfile} />
            <Route
              path="/drafter/allAssignments"
              component={DrafterShowAllAssigments}
            />
            <Route
              path="/drafter/order/:id"
              component={DrafterViewSingleOrder}
            />
          </Switch>
        </Router>
      </div>
      <AppFooter />
    </>
  );
}

export default App;
