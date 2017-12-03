function resizableColumns(col1, hit) {
	var startX, startWidth;

	hit.addEventListener('mousedown', initDrag);

	function initDrag(e) {
		startX = e.clientX;
		startWidth = parseInt(document.defaultView.getComputedStyle(col1).width, 10);
		document.addEventListener('mousemove', doDrag);
		document.addEventListener('mouseup', stopDrag);
		document.getElementById('control').style.pointerEvents = 'none';
	}

	function doDrag(e) {
		col1.style.width = (startWidth + e.clientX - startX) + 'px';
	}

	function stopDrag(e) {
		document.removeEventListener('mousemove', doDrag);
		document.removeEventListener('mouseup', stopDrag);
		document.getElementById('control').style.pointerEvents = 'auto';
	}  
}

