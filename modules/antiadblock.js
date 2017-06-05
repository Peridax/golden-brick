if ($('[class="adsbygoogle"]').first().children().length == 0 && forceAdblock) {
	alert('Disable adblock on brick-hill.com to use the Golden Brick extension!\n\nTo disable adblock on brick-hill navigate to https://www.brick-hill.com and left click the adblock icon in the top right and click "Don\'t run on pages on this domain.".\n\nOnce you\'ve disabled adblock on brick-hill you can navigate to the chrome extension store or go to http://peridax.com/golden-brick to reinstall Golden Brick.');

	chrome.runtime.sendMessage({uninstall: true}, function(response) {
  		console.log('Uninstall request sent');
	});
};