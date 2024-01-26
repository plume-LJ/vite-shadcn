import { useLoaderData } from "react-router-dom";

export async function loader() {
  await new Promise((r) => setTimeout(r, 5500));
  return "I came from the A.tsx loader function!";
}

export function Component() {
  const data = useLoaderData() as string;

  return (
    <div>
      <h2>About</h2>
      <p>{data}</p>
    </div>
  );
}

Component.displayName = "APage";