import { Suspense } from "react";
import {
  useLoaderData,
  Link,
  Await,
  useAsyncValue,
  useAsyncError,
  useNavigation,
  defer,
} from "react-router-dom";
import { Skeleton } from "./components/ui/skeleton";

export async function loader() {
  // await new Promise((r) => setTimeout(r, 5500));
  const data = new Promise((r) => setTimeout(() =>r("I came from the A.tsx loader function!"), 5500));
  return defer({
    data,
  });
}

export function Component() {
  const { data } = useLoaderData() as { data: Promise<string> };
  const navigation = useNavigation();
  console.log(navigation)
  console.log(data)
  return (
    <div>
      <h2>About</h2>
      <Suspense fallback={<Skeleton className="h-10 w-40" />}>
        <Await resolve={data} errorElement={<ReviewsError />}>
          <Reviews />
        </Await>
        {/* <Await
          resolve={data}
          errorElement={<div>Could not load reviews 😬</div>}
          children={(data) => <p>{data}</p>}
        /> */}
      </Suspense>
      <Link to="/about">About</Link>
    </div>
  );
}

function ReviewsError() {
  const error = useAsyncError() as { message: string };
  return <div>{error.message}</div>;
}

function Reviews() {
  const data = useAsyncValue() as string;
  return <div>{data}</div>;
}
Component.displayName = "APage";
