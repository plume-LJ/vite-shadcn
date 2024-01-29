import React from "react";
import {
  useBlocker,
  Form,
  redirect,
  type ActionFunctionArgs,
} from "react-router-dom";

export async function action({
  request,
  params,
}: ActionFunctionArgs) {
  console.log(request, params);
  const formData = await request.formData();
  console.log(formData);
  return redirect(`/about`);
}

function ImportantForm() {
  const [value, setValue] = React.useState("");

  // Block navigating elsewhere when data has been entered into the input
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      value !== "" && currentLocation.pathname !== nextLocation.pathname
  );

  return (
    <Form method="post">
      <label>
        Enter some important data:
        <input
          name="data"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </label>
      <button type="submit">Save</button>

      {blocker.state === "blocked" ? (
        <div>
          <p>Are you sure you want to leave?</p>
          <button onClick={() => blocker.proceed()}>Proceed</button>
          <button onClick={() => blocker.reset()}>Cancel</button>
        </div>
      ) : null}
    </Form>
  );
}

export default ImportantForm;
