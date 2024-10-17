import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import SetPassword from './setPassword';
import HomePage from './homepage'
import reportWebVitals from './reportWebVitals';
import TakeLoanForm from './loanappform'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import SignUp from './SignUp'
import VerifierLogin from './verifierlogin'
import VerifierHomePage from './verifierhome'
import AdminLogin from './adminlogin'
import AdminHomePage from './adminhomepage'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path:"/signup",
    element: <SignUp />
  },
  {
    path:"/setPassword",
    element: <SetPassword/>
  },
  {
    path:"/homepage",
    element:<HomePage />
  },
  {
    path:"/loanappform",
    element:<TakeLoanForm />
  },
  {
    path:"/verifiersignin",
    element:<VerifierLogin />
  },
  {
    path:"/verifierhomepage",
    element:<VerifierHomePage />
  },
  {
    path:"/adminsignin",
    element:<AdminLogin/>
  },
  {
    path:"/adminhomepage",
    element:<AdminHomePage />
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </RouterProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
