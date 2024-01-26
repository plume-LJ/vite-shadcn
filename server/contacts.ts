type Conntact = {
  first: string;
  last: string;
  avatar: string;
  twitter?: string;
  notes: string;
  favorite: boolean;
};

const contacts: Conntact[] = [];


export function getContacts() {
  return contacts;
}