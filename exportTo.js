/*!require: */
!function($){
    'use strict';
    function embedCSS(i, el){
        var styles = el.currentStyle || el.ownerDocument.defaultView.getComputedStyle(el);
        var value, realKey,
            // on modern browser, we can only iterate numeric keys and
            // by accessing numeric keys, we can get the real css attribute name
            // but in ie, we will iterate css attribute name directly
            numericKey = styles.length == null? false: true;

        for(var key in styles){
            // style does not has hasOwnProoperty on ie < 9
            if (styles.hasOwnProperty && !styles.hasOwnProperty(key)){
                continue;
            }

            // do not copy over the entire cssText
            if (key === 'cssText' || key === 'length'){
                continue;
            }

            realKey = numericKey?styles[key]:key;
            value = styles[realKey];

            if (value == null){
                continue;
            }

            el.style[realKey] = value;
        }
    };
    function importNode(externalNode, deep){
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
                                window.console.log('exportTo plugin failed to copy css: ' + key);
                            }
                        }
                    }
                }
                else{
                    adopted.setAttribute(attr.name, attr.value);
                }
            }
        }

        if (deep){
            // copy the entire contents of the source element
            adopted.innerHTML = externalNode.innerHTML;
        }

        return adopted
    };
    function exportTo(doc, i, el, deep){
        var adopted;
        if (doc.importNode){
            adopted = doc.importNode(el, deep);
        }
        else{
            adopted = importNode.call(doc, el, deep)
        }
        this.push(adopted);
    };
    $.fn.extend({
        embedCSS: function(){
            return this.each(embedCSS);
        },
        exportTo: function(winOrDoc, deep){
            var retArray = [], doc, ret;

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
                exportTo.call(retArray, doc, i, el, deep);
            });

            ret = $(retArray);
            ret.prevObject = this;
            return ret;
        }
    });
}(jQuery);
