import { Form } from "react-router-dom";
import { getContact, updateContact, type Contact } from "@/contacts";
import {
  useLoaderData,
  LoaderFunctionArgs,
  useFetcher,
} from "react-router-dom";

export async function loader({
  params,
}: LoaderFunctionArgs<{ contactId: string }>) {
  const contact = await getContact(params.contactId!);
  if (!contact) {
    throw new Response("", {
      status: 404,
      statusText: "Not Found",
    });
  }
  return { contact };
}

export async function action({
  request,
  params,
}: LoaderFunctionArgs<{ contactId: string }>) {
  const formData = await request.formData();
  return updateContact(params.contactId!, {
    favorite: formData.get("favorite") === "true",
  });
}

export default function Contact() {
  const { contact } = useLoaderData() as { contact: Contact };

  return (
    <div id="contact" className="flex gap-10">
      <div>
        <img key={contact.avatar} src={contact.avatar || undefined} />
      </div>

      <div className="flex flex-col gap-4">
        <h1 className="flex gap-2">
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter && (
          <p>
            <a target="_blank" href={`https://twitter.com/${contact.twitter}`}>
              {contact.twitter}
            </a>
          </p>
        )}

        {contact.notes && <p>{contact.notes}</p>}

        <div className="flex gap-4">
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              if (!confirm("Please confirm you want to delete this record.")) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

function Favorite({ contact }: { contact: Contact }) {
  const fetcher = useFetcher();

  // yes, this is a `let` for later
  let favorite = contact.favorite;
  if (fetcher.formData) {
    favorite = fetcher.formData.get("favorite") === "true";
  }
  return (
    <fetcher.Form method="post">
      <button
        className="p-0 bg-background "
        name="favorite"
        value={favorite ? "false" : "true"}
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}
