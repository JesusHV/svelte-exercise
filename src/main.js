import App from './App.html';

const app = new App({
	target: document.body,
	data: {
		word: ''
	}
});

window.app = app;

export default app;
