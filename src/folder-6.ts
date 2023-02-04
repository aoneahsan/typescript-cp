const userinputEle = document.querySelector('#userinput');

if (userinputEle) {
	(userinputEle as HTMLInputElement).value = 'Working';
}

interface ErrorContainer {
	[key: string]: string;
}
const errBag: ErrorContainer = {
	email: 'invalid email',
};

class working {
	ok = 'okas';
}
