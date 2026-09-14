import { describe, expect, it } from 'vitest';
import { isInviteSlug, parseRsvpInput } from './rsvp-input';

describe('isInviteSlug', () => {
	it('accepts short unguessable slugs and rejects path injection', () => {
		expect(isInviteSlug('minh-anh')).toBe(true);
		expect(isInviteSlug('../etc/passwd')).toBe(false);
		expect(isInviteSlug('https://evil.example')).toBe(false);
		expect(isInviteSlug('')).toBe(false);
	});
});

describe('parseRsvpInput', () => {
	it('takes the slug from the route, not the form body', () => {
		const data = new FormData();
		data.set('slug', 'attacker');
		data.set('name', 'Minh');
		data.set('attending', 'yes');
		data.set('guests', '4');
		data.set('lang', 'vi');

		expect(parseRsvpInput(data, 'minh-anh')).toEqual({
			slug: 'minh-anh',
			name: 'Minh',
			attending: 'yes',
			guests: 4,
			lang: 'vi'
		});
	});

	it('ignores form slugs on the public invite page and clamps guests', () => {
		const data = new FormData();
		data.set('slug', 'attacker');
		data.set('name', '  Quang  ');
		data.set('attending', 'no');
		data.set('guests', '999');
		data.set('lang', 'en');

		expect(parseRsvpInput(data)).toEqual({
			slug: '',
			name: 'Quang',
			attending: 'no',
			guests: 20,
			lang: 'en'
		});
	});

	it('rejects a malformed route slug', () => {
		const data = new FormData();
		data.set('name', 'Minh');
		expect(parseRsvpInput(data, '../sheet')).toBeNull();
		expect(parseRsvpInput(data, '')).toBeNull();
	});

	it('rejects a missing name', () => {
		const data = new FormData();
		data.set('attending', 'yes');
		expect(parseRsvpInput(data)).toBeNull();
	});
});
