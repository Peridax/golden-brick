// messy but very useful file :)))) -peridax
// what if i just change the admins var and hack the extension :))))) -jefemy
// well admin don't even work and ya the socket server checks it -peridax
var str, newstr;
var server = "http://peridax.com";
var manifest = chrome.runtime.getManifest();
var forceAdblock = false;
var admins = ["peridax", "jefemy", "isaiah", "plastic bag"];

if (localStorage.getItem('connected') == undefined) {
	localStorage.setItem('connected', 'false');
};

const parse = JSON.parse;
const version = 0.2;

const uninstall = (message) => {
	message ? alert(message) : undefined;
	chrome.management.uninstallSelf();
};

const random = (min, max) => {
	if (min > max) {
		var temp = max;
		max = min;
		min = max;
	};

	return Math.round(Math.random() * (max - min) + min);
};

String.prototype.format = function(a, b, c) {
	if (a === undefined || b === undefined || c === undefined) {
		throw new Error('Bad arguments while calling format.');
	};

	str = "";
	newstr = this.split(a);

	for (i in newstr) {
	   if (i % 2 == 1) {
	      if (newstr[i].length > 0) {
	         newstr[i] = b + newstr[i] + c;
	      } else {
	         newstr[i] = a;
	      };
	   };

	   str += newstr[i];
	};

	return str;
};