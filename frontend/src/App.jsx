import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';
import * as sessionActions from './store/session';
import LandingPage from './components/LandingPage/LandingPage';
import SpotDetailsPage from './components/SpotDetailsPage';
import CreateSpotPage from './components/CreateSpotPage/CreateSpot';
import ManageSpots from './components/ManageSpots';
import UpdateSpotPage from "./components/UpdateSpotPage/UpdateSpotPage"

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>

      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <LandingPage />
      },
      {
        // *fix this
        path: '/spots/:spotId/update',
        element: <UpdateSpotPage />
      },
      {
        path: '/spots/:spotId',
        element: <SpotDetailsPage />
      },
      {
        path: '/spots/new',
        element: <CreateSpotPage />
      },
      {
        path: '/spots/current',
        element: <ManageSpots />
      },

    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
