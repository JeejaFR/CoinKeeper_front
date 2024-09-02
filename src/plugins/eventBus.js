import { ref } from 'vue';

export const eventBus = ref(new Map());

export function emitBus(event, payload) {
  const callbacks = eventBus.value.get(event) || [];
  callbacks.forEach(callback => callback(payload));
}

export function on(event, callback) {
  if (!eventBus.value.has(event)) {
    eventBus.value.set(event, []);
  }
  eventBus.value.get(event).push(callback);
}
