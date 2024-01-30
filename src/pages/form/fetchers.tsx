// import { useMemo } from "react";
import {
  useFetcher,
  useLoaderData,
  useFetchers,
  redirect,
  type ActionFunctionArgs,
} from "react-router-dom";
import DeleteButton from "./formAction";

type Task = {
  projectId: number;
  id: number;
  complete: boolean;
};

type Project = {
  id: number;
  name: string;
  tasks: Task[];
};

const tasks: Task[] = [
  {
    projectId: 1,
    id: 2,
    complete: false,
  },
  {
    projectId: 2,
    id: 3,
    complete: false,
  },
  {
    projectId: 3,
    id: 4,
    complete: false,
  },
  {
    projectId: 4,
    id: 5,
    complete: true,
  },
];
async function getTasks(): Promise<Task[]> {
  return tasks;
}

export async function loader() {
  const tasks = await getTasks();
  return { tasks };
}

export async function action({
  request,
  params,
}: ActionFunctionArgs<{ projectId: string }>) {
  console.log(request, params);
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  // console.log(updates);
  // console.log(tasks);
  tasks.some((t) => {
    if (t.id === +updates.id) {
      t.complete = updates.complete === "on";
      return true;
    }
  });
  return redirect(`/tasks`);
}

function Task({ task }: { task: Task }) {
  const { projectId, id } = task;
  const toggle = useFetcher();
  const checked = toggle.formData
  ? toggle.formData.get("complete") === "on"
  : task.complete

  // console.log(checked)

  return (
    <toggle.Form method="put" action={`/projects/${projectId}/tasks/${id}`}>
      <input name="id" type="hidden" defaultValue={id} />
      <label>
        <input
          name="complete"
          type="checkbox"
          checked={checked}
          onChange={(e) =>toggle.submit(e.target.form)}
        />
      </label>
      <DeleteButton />

    </toggle.Form>
  );
}
function ProjectTaskCount({ project }: { project: Project }) {
  let completedTasks = 0;
  const fetchers = useFetchers();

  // Find this project's fetchers
  const relevantFetchers = fetchers.filter((fetcher) => {
    return fetcher.formAction?.startsWith(`/projects/${project.id}/tasks/`);
  });

  // Store in a map for easy lookup
  const myFetchers = new Map(
    relevantFetchers.map(({ formData }) => [
      formData?.get("id"),
      formData?.get("complete") === "on",
    ])
  );

  // Increment the count
  for (const task of project.tasks) {
    if (myFetchers.has(`${task.id}`)) {
      if (myFetchers.get(`${task.id}`)) {
        // if it's being submitted, increment optimistically
        completedTasks++;
      }
    } else if (task.complete) {
      // otherwise use the real task's data
      completedTasks++;
    }
  }

  return (
    <small>
      {completedTasks}/{project.tasks.length}
    </small>
  );
}

export default function Tasks() {
  const project = useLoaderData() as Project;
  return (
    <>
      <ProjectTaskCount project={project} />
      <ul>
        {project.tasks.map((task) => (
          <li key={task.id}>
            <Task task={task} />
          </li>
        ))}
      </ul>
    </>
  );
}
