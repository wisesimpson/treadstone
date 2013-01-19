"use strict";

if(!('dataset' in document.createElement('a'))){
	Object.defineProperty(self.HTMLElement['prototype'],'dataset',{
		get:function(){
			var attributes=this.attributes;
			var dataset={};
			for(var i=0;i<attributes.length;i++){
				if(new RegExp('^data(-\\w+)+$').test(attributes.item(i).name)){
					var nameArray=attributes.item(i).name.substring(5).split('-');
					var name=nameArray[0];
					if(nameArray.length>1){
						for(var j=1;j<name.length;j++){
							name+=nameArray[j].substring(0,1).toUpperCase()+nameArray[j].substring(1);
						}
					}
					dataset[name]=attributes.item(i).value;
				}
			}
			return dataset;
		},
		enumerable:true,
		configurable:true
	});
}
		
(function(){
	var $=function(query){
		if(!query){
			var elements=[];
		}else if(typeof query == 'string'){
			var elements=document.querySelectorAll(query);
		}else if(typeof query == 'object'){
			if(query.length){
				var elements=query;
			}else{
				var elements=[query];
			}
		}
		elements.each=function(callback){
			var length=elements.length;
			for(var i=0;i<length;i++){
				if(callback.call(elements[i],i)===false)
					break;
			}
		};
		elements.offset=function(){
			if(elements.length){
				var left=0,top=0,e=elements[0];
				do{
					left+=e.offsetLeft;
					top+=e.offsetTop;
				}while(e=e.offsetParent);
				return {
					left:left,
					top:top
				};
			}else{
				return {left:0,top:0}
			}
		};
		elements.setPrefixStyle=function(key,value){
			elements.each(function(){
				if(typeof this.style[key]=='string'){
					this.style[key]=value;
				}else if(typeof this.style['Webkit'+key.substring(0,1).toUpperCase()+key.substring(1)]=='string'){
					this.style['Webkit'+key.substring(0,1).toUpperCase()+key.substring(1)]=value;
				}else if(typeof this.style['Moz'+key.substring(0,1).toUpperCase()+key.substring(1)]=='string'){
					this.style['Moz'+key.substring(0,1).toUpperCase()+key.substring(1)]=value;
				}else if(typeof this.style['Ms'+key.substring(0,1).toUpperCase()+key.substring(1)]=='string'){
					this.style['Ms'+key.substring(0,1).toUpperCase()+key.substring(1)]=value;
				}
			});
		};
		return elements;
	};

	$('ul.tabs>li.active>a').each(function(){
		document.querySelector(this.getAttribute('href')).classList.add('shown');
	});

	document.addEventListener('click',function(e){
		var dropdownToggles=new Array();
		var dropdowns=new Array();
		for(var element=e.target;element.parentNode;element=element.parentNode){
			if(e.target.classList.contains('close')||e.target.classList.contains('close-btn')||e.target.classList.contains('overlay-inner')){
				var overlay;
				for(var overlay=e.target.parentNode;overlay.parentNode;overlay=overlay.parentNode){
					if(overlay.classList.contains('overlay') && overlay.classList.contains('shown')){
						overlay.classList.remove('shown');
						break;
					}
				}
			}else if(element.dataset.toggle=='modal'){
				e.preventDefault();
				document.querySelector(element.dataset.target).classList.add('shown');
			}else if(element.dataset.toggle=='dropdown'){
				e.preventDefault();
				dropdownToggles.push(element);
				var offset=$(element).offset();
				var dropdown=document.querySelector(element.dataset.target);
				var dropdownParentOffset=$(dropdown.offsetParent).offset();
				dropdown.style.display='block';
				dropdown.style.visibility='hidden';
				dropdown.style.left=offset.left+(element.offsetWidth-dropdown.offsetWidth)/2-dropdownParentOffset.left+'px';
				dropdown.style.top=offset.top+element.offsetHeight-dropdownParentOffset.top+10+'px';
				dropdown.style.visibility='';
			}else if(element.classList.contains('dropdown')){
				dropdowns.push(element);
			}else if(element.tagName=='A' && element.dataset.toggle=='tab'){
				e.preventDefault();
				if(!element.parentNode.classList.contains('active')){
					$(element.parentNode.parentNode.children).each(function(){
						if(this.classList.contains('active')){
							this.classList.remove('active');
							document.querySelector(this.children[0].getAttribute('href')).classList.remove('shown');
						}
					});
					element.parentNode.classList.add('active');
					document.querySelector(element.getAttribute('href')).classList.add('shown');
				}
			}
		}
		$('.dropdown').each(function(){
			var d=dropdowns;
			dropdownToggles.forEach(function(e){
				d.push(document.querySelector(e.dataset.target));
			});
			if(d.indexOf(this)===-1){
				this.style.display='none';
			}
		});
	});

	var contentChanged=function(container){
		if(container.style.overflow!='hidden'){
			container.style.maxHeight=container.style.minHeight=window.getComputedStyle(container).height;
			container.style.maxWidth=container.style.minWidth=window.getComputedStyle(container).width;
			container.style.overflow='hidden';
		}
		if(container.scrollHeight>container.clientHeight){
			$(container).setPrefixStyle('transition','max-height 1s');
			container.style.maxHeight=container.scrollHeight+'px';
		}else{
			$(container).setPrefixStyle('transition','min-height 1s');
			container.style.minHeight=0;
		}
		if(container.scrollWidth>container.clientWidth){
			$(container).setPrefixStyle('transition','all 1s');
			container.style.maxWidth=container.scrollWidth+'px';
		}else{
			$(container).setPrefixStyle('transition','all 1s');
			container.style.minWidth=0;
		}
	};
	
	
	var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
	
	var addContentChangeObserver=function(target){
		var observer = new MutationObserver(function(mutations) {
		  contentChanged(mutations[0].target);
		});
		
		var config = { attributes: false, childList: true, characterData: true }
		  
		observer.observe(target, config);
	}
	
	$('.content-aware-resize').each(function(){
		if(MutationObserver){
			addContentChangeObserver(this);
		}else{
			this.addEventListener('DOMNodeInserted',function(){
				contentChanged(this.target);
			});
			this.addEventListener('DOMNodeRemoved',function(){
				contentChanged(this.target);
			});
		}
	});
	
	var transitionend=function(e){
		console.log(e.propertyName);
		$(e.target).setPrefixStyle('transition','none');
		if(e.target.classList.contains('content-aware-resize')){
			if(e.propertyName=='min-height'||e.propertyName=='max-height'){
				e.target.style.minHeight=e.target.style.maxHeight=window.getComputedStyle(e.target).height;
			}else if(e.propertyName=='min-width'||e.propertyName=='max-width'){
				e.target.style.minWidth=e.target.style.maxWidth=window.getComputedStyle(e.target).width;
			}
		}
	};
	document.addEventListener('transitionend',transitionend);
	document.addEventListener('webkitTransitionEnd',transitionend);
})();
