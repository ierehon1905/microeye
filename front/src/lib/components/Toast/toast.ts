import { writable } from 'svelte/store';

type ToastMessage = {
	text: string;
	title: string;
	id: string;
	type: 'success' | 'error' | 'warning' | 'info';
	timeout: number;
};

const defaultToast: ToastMessage = {
	text: '',
	title: '',
	id: '',
	type: 'info',
	timeout: 5000
};

export const toasts = writable<ToastMessage[]>([]);

const timeoutCache: { [key: string]: number } = {};

export function addToast(message: Partial<ToastMessage>) {
	const fullMessage = {
		...defaultToast,
		...message
	};

	if (!('id' in message)) {
		fullMessage.id = Math.random().toString();
	}

	let found = false;
	toasts.update((messages) =>
		messages
			.filter((m) => {
				const eq = m.id === fullMessage.id;
				if (eq) {
					found = true;
				}
				return !eq;
			})
			.concat(fullMessage)
	);

	if (found) {
		clearTimeout(timeoutCache[fullMessage.id]);
	}

	timeoutCache[fullMessage.id] = setTimeout(() => {
		closeToast(fullMessage.id);
	}, fullMessage.timeout);
}

export function closeToast(id: string) {
	toasts.update((messages) => messages.filter((m) => m.id !== id));
}
