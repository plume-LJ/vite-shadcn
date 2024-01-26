export type Contact = {
  id: number;
  first: string;
  last: string;
  avatar: string;
  twitter?: string;
  notes: string;
  favorite: boolean;
};

const contacts: Contact[] = [];

export function getContacts() {
  return contacts;
}

export const c = {
  first: "Your",
  last: "Name",
  avatar: "https://placekitten.com/g/200/200",
  twitter: "your_handle",
  notes: "Some notes",
  favorite: true,
};

export function getContact(id: number) {
  return contacts.find((c) => c.id === id) ?? {};
}

export function createContact() {
  const id = Math.random();
  contacts.push({
    id,
    first: "",
    last: "",
    avatar: "",
    twitter: "",
    notes: "",
    favorite: false,
  });
  return contacts[id];
}

export function updateContact(id: number, updates: Partial<Contact>) {
  const contact = contacts.find((c) => c.id === id);
  if (!contact) return;
  Object.assign(contact, updates);
}