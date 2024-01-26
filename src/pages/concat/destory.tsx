import { redirect, type ActionFunctionArgs } from "react-router-dom";
import { deleteContact } from "@/contacts";

export async function action({
  params,
}: ActionFunctionArgs<{ contactId: string }>) {
  // throw new Error("oh dang!");
  await deleteContact(params.contactId!);
  return redirect("/contacts");
}
