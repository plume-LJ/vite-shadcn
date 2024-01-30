import { ReactNode } from "react";
import {
  useMatches,
  UIMatch,
  useRouteLoaderData,
  // useActionData,
  // useLoaderData,
  // useFetchers,
  // redirect,
  // type ActionFunctionArgs,
} from "react-router-dom";

function Breadcrumbs() {
  const matches = useMatches() as UIMatch<unknown, {crumb: (data: unknown) => ReactNode}>[];
  console.log(matches)

  const data = useRouteLoaderData("contacts")
  console.log(data)
  const crumbs = matches
    // first get rid of any matches that don't have handle and crumb
    .filter((match) => Boolean(match.handle?.crumb))
    // now map them into an array of elements, passing the loader
    // data to each one
    .map((match) => match.handle.crumb(match.data));

  return (
    <ol>
      {crumbs.map((crumb, index) => (
        <li key={index}>{crumb}</li>
      ))}
    </ol>
  );
}

export default Breadcrumbs