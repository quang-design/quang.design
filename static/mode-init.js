(function () {
	var modeKey = 'mode-watcher-mode';
	var lockKey = 'qd-user-mode';
	var root = document.documentElement;
	var stored = localStorage.getItem(modeKey);
	var locked = localStorage.getItem(lockKey) === '1';
	var light;

	if (locked && (stored === 'light' || stored === 'dark')) {
		light = stored === 'light';
	} else {
		var hour = new Date().getHours();
		light = hour >= 6 && hour < 18;
	}

	root.classList.toggle('dark', !light);
	root.style.colorScheme = light ? 'light' : 'dark';

	var meta = document.querySelector('meta[name="theme-color"]');
	if (meta) {
		meta.setAttribute('content', light ? '#d5cbb5' : '#120b00');
	}
})();
