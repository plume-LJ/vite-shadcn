import { useFetcher, LoaderFunctionArgs } from "react-router-dom";
import { createTag, getTags } from "./tag";

export async function loader({
  params,
}: LoaderFunctionArgs<{ contactId: string }>) {
  const contact = await getTags(params.contactId!);
  if (!contact) {
    throw new Response("", {
      status: 404,
      statusText: "Not Found",
    });
  }
  return contact.length;
}

export async function action() {
  const contact = await createTag();
  console.log(contact);
  return null
  // return redirect(`/contacts/${contact.id}/edit`);
}

export function AddToBagButton() {
  const fetcher = useFetcher({ key: "add-to-bag" });
  return <fetcher.Form method="post">
    <input name='quantity' defaultValue={1} />
    <button type="submit">submit</button>
  </fetcher.Form>;
}

const BagIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
      />
    </svg>
  );
};

// Then, up in the header...
export function CartCount({ count }: { count: number }) {
  const fetcher = useFetcher({ key: "add-to-bag" });
  console.log(fetcher)
  const inFlightCount = Number(fetcher.formData?.get("quantity") || 0);
  const optimisticCount = count + inFlightCount;
  return (
    <>
      <BagIcon />
      <span>{optimisticCount}</span>
    </>
  );
}


export default function Card () {
  return <div className="flex gap-4">
    <CartCount count={10} />
    <AddToBagButton />
  </div>
}