var states = {
	WAITING: 0,
	LOADING: 1,
	DONE: 2,
	ERROR: 3
}

function FileRow(date, name, state, progress) {
	this.date = date;
	this.name = name;
	this.state = state;
	this.progress = null;
	if (this.state === states.LOADING) {
		this.progress = progress;
	} else if (this.state !== states.WAITING) {
		this.progress = 100;
	}
}

$(function() {
	const $passwd = $('#passwd');
	const $file = $('#file');
	const $fileName = $('#fileName');
	const $upload = $('#upload');
	const $fileList = $('#fileList');
	const $template = $('#template');
	let fileSelected = false;

	function checkEnable() {
		if ($passwd.val()) {
			$upload[0].disabled = !fileSelected;
		} else {
			$upload[0].disabled = true;
		}
	}

	$passwd.keyup(function() {
		$passwd.toggleClass('error', !$passwd.val());
		checkEnable();
	});

	function fileSize(files) {
		if (files.length === 1 && files[0].size === undefined) {
			return '';
		}


		let size = 0;
		for (let i = 0, l = files.length; i < l; i++) {
			size += files[i].size;
		}

		let output = '; ' + size + ' bytes.';
		for (let units = ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"], i = 0, approx = size / 1024; approx > 1; approx /= 1024, i++) {
			output = '; ' + approx.toFixed(1) + " " + units[i] + " (" + size + " bytes)";
		}
		return output;
	}

	$file.change(function() {
		const files = $file[0].files || [{ name: $file[0].value.split('\\').pop() }];
		fileSelected = !!(files.length && files[0]);
		$fileName.val(
			files.length
				? files.length === 1
					? files[0].name + fileSize(files)
					: files.length + ' files selected' + fileSize(files)
				: ''
		);
		checkEnable();
	});

	//TODO: get from API:
	const files = [
		new FileRow(moment(), 'Wug.txt', states.WAITING),
		new FileRow(moment(), 'Wug.txt', states.LOADING, 33),
		new FileRow(moment(), 'Wug.txt', states.DONE),
		new FileRow(moment(), 'Wug.txt', states.ERROR),
	];

	function renderFiles() {
		for (let i = 0, l = files.length; i < l; i++) {
			const file = files[i];
			const $content = $template.clone();
			$content.html(
				$content.html()
					.replace(/@date/, file.date.format('DD/MM/YYYY'))
					.replace(/@fileName/, file.name)
			);
			const $progressCell = $content.find('.c3');
			if (file.state === states.ERROR) {
				$progressCell.addClass('error');
			}
			if (file.progress !== null) {
				$progressCell.find('progress').attr('value', file.progress);
			}

			$content.find('>*')
				.css({ 'grid-row': (2 + i) + '' })
				.appendTo($fileList);
		}
	}

	renderFiles();
});
