import { Navigate, useRoutes } from "react-router-dom";
import { MainLayout, SimpleLayout } from "./layouts";
import { Account, Home, Login, Page404, Register, Settings } from "./pages";

export default function Router() {
  const routes = useRoutes([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        { element: <Home />, index: true },
        { path: "settings", element: <Settings /> },
        { path: 'account', element: <Account /> },
        //   { path: 'drivers', element: <UserPage /> },
        //   { path: 'config', element: <ConfigPage /> },
      ],
    },
    {
      path: 'login',
      element: <Login />,
    },
    {
      path: 'register',
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