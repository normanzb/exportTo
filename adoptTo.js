/*!require: */
!function($){
	'use strict';
	function cssIndie(i, el){
		var styles = el.currentStyle || el.ownerDocument.defaultView.getComputedStyle(el);
		for(var key in styles){
			el.style[key] = styles[key];
		}
	};
	function adoptNode(externalNode){
		var attr, style, key, value;
		var adopted = this.createElement(externalNode.nodeName);
        // copy the attributes of the source element
		for(var l = externalNode.attributes.length; l--; ){
			attr = externalNode.attributes[l];
			if (attr.specified){
				if (attr.name === 'style'){
					style = externalNode.style;
					for(key in style){
						try{
							value = style[key];
							if (value != null && value != false){
								adopted.style[key] = value;
							}
						}
						catch(ex){
							if (window.console){
								window.console.log('adoptTo plugin failed to copy css: ' + key);
							}
						}
					}
				}
				else{
					adopted.setAttribute(attr.name, attr.value);
				}
			}
		}
		
        // copy the entire contents of the source element
        adopted.innerHTML = externalNode.innerHTML;

        // delete the source element
        externalNode.parentNode.removeChild (externalNode);

		return adopted
	};
	function adoptTo(doc, i, el){
		var adopted;
		if (doc.adoptNode){
			adopted = doc.adoptNode(el);
		}
		else{
			adopted = adoptNode.call(doc, el)
		}
		this.push(adopted);
	};
	$.fn.extend({
		cssIndie: function(){
			return this.each(cssIndie);
		},
		adoptTo: function(winOrDoc){
			var ret = [], doc;

			if (winOrDoc.createElement){
				doc = winOrDoc;
			}
			else if(winOrDoc.document && winOrDoc.document.createElement){
				doc = winOrDoc.document;
			}
			else{
				throw new window.TypeError();
			}
			
			this.each(function(i, el){
				adoptTo.call(ret, doc, i, el);
			});
			
			return $(ret);
		}
	});
}(jQuery);