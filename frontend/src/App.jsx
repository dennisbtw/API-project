import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, createBrowserRouter, RouterProvider } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation-bonus';
import * as sessionActions from './store/session';
import SpotsList from './components/Spots/Spots';
import SpotDetail from './components/SpotDetail/SpotDetail';
import CreateSpot from './components/CreateSpot/CreateSpot';
import ManageSpots from './components/ManageSpots/ManageSpots';
import UpdateSpot from './components/UpdateSpot/UpdateSpot';
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
        element: <SpotsList />
      },
      {
        path: '/spots/:spotId/edit',
        element: <UpdateSpot />
      },
      {
        path: '/spots/:spotId',
        element: <SpotDetail />
      },
      {
        path: '/spots/new',
        element: <CreateSpot />
      },
      {
        path: '/spots/current',
        element: <ManageSpots />
      }, 
      {
        path: '*',
        element: <h2>Page Not Found</h2>
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
