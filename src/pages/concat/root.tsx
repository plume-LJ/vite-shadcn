import { useEffect } from "react";
import {
  Outlet,
  NavLink,
  useLoaderData,
  redirect,
  Form,
  useNavigation,
  LoaderFunctionArgs,
  useSubmit,
  Link
} from "react-router-dom";

import { getContacts, createContact, type Contact } from "@/contacts";

export async function action() {
  const contact = await createContact();
  console.log(contact);
  return redirect(`/contacts/${contact.id}/edit`);
}

export async function loader({ request }: LoaderFunctionArgs<{q: string}>) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q!);
  return { contacts, q };
}

export default function Root() {
  const { contacts, q } = useLoaderData() as { contacts: Contact[], q: string };
  const navigation = useNavigation();
  const submit =useSubmit()

  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has(
      "q"
    );

  useEffect(() => {
    const dom: HTMLInputElement | null = document.getElementById("q") as HTMLInputElement
    if (dom) {
      dom.value = q
    }
    // document.getElementById("q").value = q;
  }, [q]);

  useEffect(() => {
    const style = document.body.style;
    const display = style.display;
    style.display = "block";
    return () => {
      style.display = display;
    };
  }, []);
  return (
    <div className="flex ">
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div className="flex gap-10">
          <Form id="search-form" role="search">
            <input
              id="q"
              className={searching ? "loading" : ""}
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
              defaultValue={q}
              onChange={(event) => {
                const isFirstSearch = q == null;
                submit(event.currentTarget.form, {
                  replace: !isFirstSearch,
                });
              }}
            />
            <div id="search-spinner" aria-hidden hidden={!searching} />
            <div className="sr-only" aria-live="polite"></div>
          </Form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <NavLink
                    to={`/contacts/${contact.id}`}
                    className={({ isActive, isPending }) =>
                      isActive ? "active" : isPending ? "pending" : ""
                    }
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {contact.favorite && <span>★</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div
        id="detail"
        className={`relative flex-auto ${navigation.state === "loading" ? "loading" : ""}`}
      >
        <Outlet />
      </div>
      <Link to='/'>Index</Link>
    </div>
  );
}
