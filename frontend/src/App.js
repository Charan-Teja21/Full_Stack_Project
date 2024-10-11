import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from './Components/Authentication/Login/Login';
import UserRegister from './Components/Authentication/Register/Register';
import Cart from './Components/Cart/Cart';
import Payment from './Components/Payment/Payment';
import RootLayout from './Components/RootLayout/RootLayout';
import Home from './Components/Home/Home';
import Explore from './Components/Explore/Explore';
import UserDashBoard from './Components/UserDashboard/UserDashboard';
import Fooditem from './Components/Fooditem/Fooditem';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  let router = createBrowserRouter([
    {
      path: "",
      element: <RootLayout />,
      children: [
        { path: "", element: <Home /> },
        { path: "register", element: <UserRegister /> },
        { path: "login", element: <Login /> },
        { path: "explore", element: <Explore /> },
        { path: "userdashboard", element: <UserDashBoard /> },
        { path: "fooditem/:foodid", element: <Fooditem /> },
        { path: "cart", element: <Cart /> },
        { path: "payment", element: <Payment /> },
      ],
    },
  ]);

  return (
    <div className="App">
      <ToastContainer 
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
