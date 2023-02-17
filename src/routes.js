import { Navigate, useRoutes } from "react-router-dom";
import { MainLayout, SimpleLayout } from "./layouts";
import {
//  Account,
  Home,
  Login,
  Page404,
  Register,
  Settings,
  News,
  Crosshairs,
} from "./pages";

export default function Router() {
  const routes = useRoutes([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        { element: <Home />, index: true },
        { path: "news", element: <News /> },
        { path: "settings", element: <Settings /> },
        { path: "crosshairs", element: <Crosshairs /> },
        // { path: 'account', element: <Account /> },
        //   { path: 'drivers', element: <UserPage /> },
        //   { path: 'config', element: <ConfigPage /> },
      ],
    },
    {
      path: "login",
      element: <Login />,
    },
    {
      path: "register",
      element: <Register />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Home />, index: true },
        { path: "404", element: <Page404 /> },
        { path: "*", element: <Navigate to="/404" /> },
      ],
    },
    {
      path: "*",
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
