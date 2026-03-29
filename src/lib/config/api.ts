/**
 * Centralized API endpoint paths. Components consume these instead of
 * hard-coding route strings, so swapping implementations (or contracting
 * features) only requires changes in one place.
 */
export const apiPaths = {
	microscopic: '/api/microscopic',
	telescopic: '/api/telescopic',
	subscribe: '/api/subscribe'
} as const;
