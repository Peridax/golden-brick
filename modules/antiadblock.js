if ($('[class="adsbygoogle"]').first().children().length == 0 && forceAdblock) {

	alert(["Disable Adblock on Brick-Hill.com to use the Golden Brick extension!",
	      "To disable Adblock on Brick-Hill, navigate to https://www.brick-hill.com and click on the adblock icon - Click on \"Don't run on pages on this domain.\"",
   	      "Once you've disabled Adblock on Brick-Hill, you can go to the Google Chrome store, or http://peridax.com/golden-brick to reinstall Golden Brick."].join("\n\n"));

	chrome.runtime.sendMessage({uninstall: true}, function(response) {
  		console.log('Uninstall request sent');
	});
};
