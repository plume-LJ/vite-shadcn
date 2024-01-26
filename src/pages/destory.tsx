import { redirect } from "react-router-dom";
// import { deleteContact } from "./contacts";

async function deleteContact(contactId: string) {
  // await fetch(`/api/contacts/${contactId}`, {
  //   method: "DELETE",
  // });
  console.log(contactId)
  await new Promise((r) => setTimeout(r, 500));
}
export async function action({
  params,
}: {
  params: { contactId: string };
}) {
  await deleteContact(params.contactId);
  return redirect("/");
}
