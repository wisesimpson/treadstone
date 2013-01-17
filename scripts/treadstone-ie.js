(function($){
	$(function(){
		$('ul.tabs>li.active>a').each(function(){
			$(this.getAttribute('href')).classList.add('shown');
		});
		$('body').on('click','.close,.close-btn,.overlay-inner',function(e){
			e.preventDefault();
			$('.overlay').removeClass('shown');
		}).on('click','[data-toggle=modal]',function(e){
			e.preventDefault();
			$($(this).data('target')).addClass('shown');
		}).on('click','[data-toggle=dropdown',function(e){
			e.preventDefault();
			var offset=$(this).offset();
			var dropdown=$($(this).data('target'));
			var dropdownParentOffset=dropdown.parent().offset();
			dropdown.css({
				display:'block',
				visibility:'hidden',
				left:offset.left+(element.offsetWidth-dropdown.offsetWidth)/2-dropdownParentOffset.left,
				top:offset.top+element.offsetHeight-dropdownParentOffset.top+10
			});
			dropdown.css({visibility:''});
		}).on('click','a[data-toggle=tab]',function(e){
			e.preventDefault();
			if(!$(this).parent().hasClass('active')){
				$(this).parent().addClass('active').siblings().removeClass('active');
				$($(this).getAttr('href')).addClass('shown');
			}
		});
	});
})(jQuery);
