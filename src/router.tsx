import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Link,
  Outlet,
  redirect,
  useNavigate,
  ScrollRestoration,
  type RouteObject,
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
  return (
    <>
      <Outlet />
      <ScrollRestoration getKey={(location) => location.key} />
    </>
  );
};

// const NotFound = () => {
//   return <div className="text-red-500 text-3xl">404</div>;
// };

const Login = () => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => {
        sessionStorage.setItem("isLogin", "true");
        navigate("/home");
      }}
    >
      login
    </div>
  );
};

const AppRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <HomeRute />
          </Suspense>
        ),
      },
      {
        path: "about",
        element: (
          <div className="flex gap-4">
            <Link to="/">Index</Link>
            <Link to="/home">Home</Link>
            <Link to="/contacts">Concat</Link>
          </div>
        ),
      },
      {
        path: "home",
        // lazy: () => import("./a"),
        async lazy() {
          const { Component, loader } = await import("./a");
          return {
            loader,
            Component,
          };
        },
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        loader: async (args) => {
          const isLogin = sessionStorage.getItem("isLogin");
          console.log(args, isLogin);
          if (!isLogin) {
            return redirect(`/login`);
          }
          return null;
        },
        children: [
          {
            path: "contacts",
            element: <ContactRoot />,
            errorElement: <ErrorPage />,
            loader: rootLoader,
            action: rootAction,
            children: [
              {
                errorElement: <ErrorPage />,
                children: [
                  {
                    index: true,
                    element: <ContactHome />,
                  },
                  {
                    path: ":contactId",
                    element: <Contact />,
                    loader: contactLoader,
                    action: contactAction,
                  },
                  {
                    path: ":contactId/edit",
                    element: <EditContact />,
                    loader: contactLoader,
                    action: editAction,
                  },
                  {
                    path: ":contactId/destroy",
                    action: destroyAction,
                    errorElement: <div>Oops! There was an error.</div>,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
const router = createBrowserRouter(AppRoutes);

// @ts-expect-error ts(2322)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = createRoutesFromElements(
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
);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
