import { Form } from "react-router-dom";

const ContactForm = <Form
  method="post"
  action="destroy"
  onSubmit={(event) => {
    if (!confirm("Please confirm you want to delete this record.")) {
      event.preventDefault();
    }
  }}
>
  <button type="submit">Delete</button>
</Form>;

export default ContactForm
