let mapLoaded = false;
if (window.history && window.history.pushState) {
	const _hostname = location.hostname;
	window.history.replaceState(_hostname, null, location.pathname);
	const init = () => {
		const height = window.getComputedStyle($('main')[0], '::before').getPropertyValue('height');
		$('head').append(`<style>main::before{height:${height};}`);
		const current = $('#currentPage').text();
		$('nav a').each((i, e) => {
			const target = $(e);
			if (current === target.attr('title')) {
				target.addClass('current');
			} else {
				target.removeClass('current');
			}
		});
		if (current === 'index') {
			$.getScript('index.js', () => {
				if (mapLoaded) {
					initMap();
				} else {
					$.getScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyCG6yw4tPrjC4MmYVXXNXYqh5KbYGscBrU&callback=initMap');
					mapLoaded = true;
				}
			});
		}
	};
	const loadContents = url => {
		$('main').load(url + ' main > *', () => {
			init();
		});
	};
	if ($('#currentPage').text() === '301') {
		loadContents('.');
		window.history.replaceState(_hostname, null, '/');
		$.getScript('https://cdnjs.cloudflare.com/ajax/libs/izitoast/1.2.0/js/iziToast.min.js', () => {
			iziToast.info({
				close: true,
				message: 'このページへは旧サイトからリダイレクトされて来ています。ブックマークは現在のURL (https://kubc.github.io) でお願いします。',
				position: 'bottomCenter',
				timeout: false
			});
		});
	} else {
		init();
	}
	$(document).on('click', 'nav a, .ps', e => {
		e.preventDefault();
		const url = $(e.currentTarget).attr('href');
		loadContents(url);
		window.history.pushState(_hostname, null, url);
	});
	$(window).on('popstate', e => {
		if (e.originalEvent.state != _hostname) return;
		loadContents(location.pathname);
	});
}