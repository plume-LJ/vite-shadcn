import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Link,
  Outlet,
  useNavigation,
} from "react-router-dom";
import React, { Suspense } from "react";
// import ContactForm from "./pages/concat";
import { action as destroyAction } from "./pages/destory";
import ContactRoot from "@/pages/concat/root";
import Contact from "./pages/concat";
import ErrorPage from "./pages/error-page";

const HomeRute = React.lazy(() => import("./App"));

const Layout = () => {
  const navigation = useNavigation();
  return (
    <div className={`${navigation.state === "loading" ? "loading" : ""}`}>
      <Outlet />
    </div>
  );
};

// const NotFound = () => {
//   return <div className="text-red-500 text-3xl">404</div>;
// };

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<ErrorPage />}>
      <Route
        index
        element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <HomeRute />
          </Suspense>
        }
      ></Route>
      <Route
        path="about"
        element={
          <div className="flex gap-4">
            About<Link to="/">Index</Link>
            <Link to="/home">Home</Link>
            <Link to="/contacts">Concat</Link>
          </div>
        }
      ></Route>
      <Route path="home" lazy={() => import("./a")}></Route>
      <Route
        path="contacts"
        element={<ContactRoot />}
        errorElement={<ErrorPage />}
      >
        <Route path=":contactId" element={<Contact />} />
      </Route>
      {/* <Route path="*" element={<NotFound />} /> */}
    </Route>
  )
);
//   {
//     path: "about",
//     element: <div>About
//       <Link to="/">Index</Link>
//     </div>,
//   },
// ]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
