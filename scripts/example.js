document.querySelector('.content-aware-resize form').addEventListener('submit',function(e){
	e.preventDefault();
	this.insertAdjacentHTML('beforebegin','<p>'+this.querySelector('input[type=text]').value+'</p>');
});
