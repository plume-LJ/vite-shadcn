import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Link,
  Outlet,
} from "react-router-dom";
import React, { Suspense } from "react";
// import ContactForm from "./pages/concat";
import { action as destroyAction } from "./pages/concat/destory";
import ContactRoot, {
  loader as rootLoader,
  action as rootAction,
} from "@/pages/concat/root";
import Contact, {
  loader as contactLoader,
  action as contactAction,
} from "./pages/concat";
import ErrorPage from "./pages/error-page";
import EditContact, { action as editAction } from "./pages/concat/edit";
import ContactHome from "./pages/concat/home";
import "@/pages/concat/index.css";

const HomeRute = React.lazy(() => import("./App"));

const Layout = () => {
  return <Outlet />;
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
        loader={rootLoader}
        action={rootAction}
      >
        <Route errorElement={<ErrorPage />}>
          <Route index element={<ContactHome />} />
          <Route
            path=":contactId"
            element={<Contact />}
            loader={contactLoader}
            action={contactAction}
          />
          <Route
            path=":contactId/edit"
            element={<EditContact />}
            loader={contactLoader}
            action={editAction}
          />
          <Route
            path=":contactId/destroy"
            action={destroyAction}
            errorElement={<div>Oops! There was an error.</div>}
          />
        </Route>
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
