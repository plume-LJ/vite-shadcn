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
  useRouteError,
  redirectDocument,
  isRouteErrorResponse,
  type RouteObject,
  // type ErrorResponse,
} from "react-router-dom";
import React, { Suspense } from "react";
// import ContactForm from "./pages/concat";
import { action as destroyAction } from "./pages/concat/destory";
import ContactRoot, {
  loader as rootLoader,
  action as rootAction,
  RootLoaderData,
} from "@/pages/concat/root";
import Contact, {
  loader as contactLoader,
  action as contactAction,
} from "./pages/concat";
import ErrorPage from "./pages/error-page";
import EditContact, { action as editAction } from "./pages/concat/edit";
import ContactHome from "./pages/concat/home";
import "@/pages/concat/index.css";
import ImportantForm, {
  action as ImportantFormAction,
} from "./pages/form/important";
import CardTag, {
  action as tagAction,
  loader as tagLoader,
} from "./pages/form/fetcher";
import Tasks, {
  loader as taskLoader,
  action as taskAction,
} from "./pages/form/fetchers";
import DeleteButton, { action as formAction } from "./pages/form/formAction";
import Breadcrumbs from "./pages/form/breadcrumb";

const HomeRute = React.lazy(() => import("./App"));

const Layout = () => {
  return (
    <>
      <Outlet />
      <Breadcrumbs />

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

function ErrorBoundary() {
  const error = useRouteError();

  console.error(error);
  if (isRouteErrorResponse(error)) {
    return <div>{error.data}</div>;
  }
  return <div>Error</div>;
}

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
            <Link to="/form">Form</Link>
            <Link to="/tag">Tag</Link>
            <Link to="/tasks">Tasks</Link>
            <Link to="/error">Error</Link>
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
            return redirectDocument("/login");
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
            id: "contacts",
            handle: {
              crumb: (data: RootLoaderData) => (
                <Link to="/messages">Messages/{data.contacts.length}</Link>
              ),
            },
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
      { path: "form", element: <ImportantForm />, action: ImportantFormAction },
      {
        path: "tag",
        element: <CardTag />,
        action: tagAction,
        loader: tagLoader,
      },
      {
        path: "tasks",
        element: <Tasks />,
        loader: taskLoader,
        action: taskAction,
      },
      {
        path: "error",
        element: <div>Oops! There was an error.</div>,
        action: () => {
          throw new Response("Error", { status: 400 });
        },
        loader: () => {
          throw new Response("Error", { status: 400 });
        },
        errorElement: <ErrorBoundary />,
      },
      { path: "/projects/:projectId/tasks/:taskId", action: taskAction },
      { path: "/form/action", element: <DeleteButton />, action: formAction },
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
