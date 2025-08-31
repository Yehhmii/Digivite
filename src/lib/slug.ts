import { nanoid } from 'nanoid';

export function generateGuestSlug(eventSlug?: string) {
  // short 8-char id, e.g. 'royal-9a3b2c4d'
  const id = nanoid(8);
  return eventSlug ? `${eventSlug}-${id}` : id;
}