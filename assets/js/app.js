function doDownload(url) {
	window.location.pathname = url;
}

$(document).ready(function() {

	var viewModel = function() {
		var self = this;
		
		self.downloadFormText = ko.observable("Enter Download Code Here");
		self.downloadCode = ko.observable("");
		self.focusDownloadBox = function() {
			$("#downloadCode").focus();
		};
		self.checkDownloadCode = function() {
			var downloadCode = self.downloadCode().replace(/\W/g, '').toLowerCase();
			var hash = md5(downloadCode);
			$.get('/downloads/' + hash + '.json', {}, function(data, ts, jqXHR) {
				if (typeof data.valid !== 'undefined' && data.valid) {
					self.downloadFormText("Starting download!");
					setTimeout(function() {
						doDownload(data.download);
					}, 1000);
				}
				else {
					self.downloadFormText("Sorry, that download code is expired.");
				}
			}).fail(function(data) {
				self.downloadFormText("Sorry, that code wasn't valid.");
			});
		};
	};

	// get everything running
	$(document).foundation();
	ko.applyBindings(new viewModel());
	$("#downloadCode").focus();
});
