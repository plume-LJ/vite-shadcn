import { useFormAction } from "react-router-dom";

export async function action() {
  // const contact = await createTag();
  console.log('contact');
  return null
  // return redirect(`/contacts/${contact.id}/edit`);
}


function DeleteButton() {
  return (
    <button
      formAction={useFormAction("destroy")}
      formMethod="post"
    >
      Delete
    </button>
  );
}

export default DeleteButton