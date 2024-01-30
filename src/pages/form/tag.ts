import localforage from "localforage";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";

export type Tag = {
  id: string;
  label: string
};

export async function getTags(query?: string ): Promise<Partial<Tag>[]> {
  await fakeNetwork(`getTags:${query}`);
  let tags = await localforage.getItem("tags") as Tag[];
  if (!tags) {
    tags = []
    await set(tags);
  }
  if (query) {
    tags = matchSorter(tags, query, { keys: ["first", "last"] });
  }
  return tags.sort(sortBy("last", "createdAt"));
}

export async function createTag() {
  await fakeNetwork();
  const id = Math.random().toString(36).substring(2, 9);
  const tag = { id, createdAt: Date.now() };
  const tags = await getTags();
  tags.unshift(tag);
  await set(tags);
  return tag;
}

export async function getTag(id: string) {
  await fakeNetwork(`tag:${id}`);
  const tags = await localforage.getItem("tags") as Tag[];
  const tag = tags.find(tag => tag.id === id);
  return tag ?? null;
}

export async function updateTag(id: string, updates: Partial<Tag>) {
  await fakeNetwork();
  const tags = await localforage.getItem("tags") as Tag[];
  const tag = tags.find(tag => tag.id === id);
  if (!tag) throw new Error("No tag found for "+id);
  Object.assign(tag, updates);
  await set(tags);
  return tag;
}

export async function deleteTag(id: string) {
  const tags = await localforage.getItem("tags") as Tag[];
  const index = tags.findIndex(tag => tag.id === id);
  if (index > -1) {
    tags.splice(index, 1);
    await set(tags);
    return true;
  }
  return false;
}

function set(tags: Partial<Tag>[]) {
  return localforage.setItem("tags", tags);
}

// fake a cache so we don't slow down stuff we've already seen
let fakeCache: Record<string, boolean> = {};

async function fakeNetwork(key='') {
  if (!key) {
    fakeCache = {};
  }

  if (fakeCache[key]) {
    return;
  }

  fakeCache[key] = true;
  return new Promise(res => {
    setTimeout(res, Math.random() * 800);
  });
}