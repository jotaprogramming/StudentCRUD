function ChangeTableActive() {
	let hash;
	const TR = document.querySelectorAll('tr');
	TR.forEach((element) => element.classList.remove('table-active'));
	if (window.location.hash) {
		hash = window.location.hash.replace('#', '');
		const GET_HASH_TAG = document.getElementById(hash);
		GET_HASH_TAG.classList.add('table-active');
	}
}

window.addEventListener('load', () => {
	ChangeTableActive();
});

window.addEventListener('popstate', () => {
	ChangeTableActive();
});

const INVALID = (element) => {
	element.classList.remove('is-valid');
	element.classList.add('is-invalid');
};

const VALID = (element) => {
	element.classList.remove('is-invalid');
	element.classList.add('is-valid');
};

const INPUTS = document.querySelectorAll('input');
INPUTS.forEach((element) => {
	element.addEventListener('keyup', () => {
		if (!element.value) {
			INVALID(element);
		} else {
			if (element.getAttribute('type') == 'number') {
				if (element.value <= 0) {
					INVALID(element);
				} else {
					VALID(element);
				}
			} else {
				VALID(element);
			}
		}
	});
});

const ALERT = document.getElementById('alert');
const SEG = document.getElementById('seg');
if (ALERT) {
	let n = 1;
	SEG.innerHTML = `${n}seg`;
	let intervalID = setInterval(function () {
		n++;
		SEG.innerHTML = `${n}seg`;
	}, 1000);
	setTimeout(() => {
		clearInterval(intervalID);
		ALERT.remove();
	}, 5000);
}
