$(function() {
	function setupBox(i) {
		var $box = $('#box' + i);
		function phase1() {
			$box.animate({ left: 450 }, 2000, 'swing', phase2);
		}
		function phase2() {
			$box.animate({ left: 0 }, 2000, 'swing', phase1);
		}
		$box.hover(function() {
			$box.pause();
		}, function() {
			$box.resume();
		});
		phase1();
	}
	setupBox(1);
	setupBox(2);
	setupBox(3);
});
