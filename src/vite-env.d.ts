/// <reference types="vite/client" />
type LoaderAction<T> = Awaited<ReturnType<T>>;

