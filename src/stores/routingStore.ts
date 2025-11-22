import { writable } from 'svelte/store';

export const routingState = writable({
    isVisible: false,
    destination: ''
});