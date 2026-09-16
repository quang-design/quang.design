export const USER_MODE_KEY = 'qd-user-mode';

export function lockUserMode() {
	localStorage.setItem(USER_MODE_KEY, '1');
}

export function userLockedMode() {
	return localStorage.getItem(USER_MODE_KEY) === '1';
}
