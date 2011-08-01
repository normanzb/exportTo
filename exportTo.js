/*!require: */
!function($){
    'use strict';

    // an reference to console or noop
    var control = {
        log: window.console?window.console.log:$.noop
    };

    /**
     * @function setCss
     * set css in a safer way
     */
    function setCss(el, realKey, value){

        try{
            el.style[realKey] = value;
        }
        catch(ex){
            control.log('jQuery.fn.exportTo: warnning: fail to set css ' +
                realKey + ' , value ' + value + ', inner exception: ' + ex.message)
        }
    };

    function embedCSS(i, el){

        var styles = el.currentStyle || el.ownerDocument.defaultView.getComputedStyle(el);

        var value, realKey, key, len,
            // on modern browser, we can only iterate numeric keys and
            // by accessing numeric keys, we can get the real css attribute name
            // but in ie, we will iterate css attribute name directly
            // and on ie9 , it has length but cannot iterate indexes by for ( .. in ..)
            numericKey = styles.length == null? false: true;

        if (numericKey){
            for(len = styles.length; len--;){
                realKey = styles[len];

                value = styles[realKey];

                if (value == null){
                    continue;
                }

                setCss(el, realKey, value);
            }
        }
        else{
            for(realKey in styles){
                if (styles.hasOwnProerty && !styles.hasOwnProperty(realKey)){
                    continue;
                }

                value = styles[realKey];

                if (value == null){
                    continue;
                }

                setCss(el, realKey, value);
            }
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
                            console.log('exportTo plugin failed to copy css: ' + key);
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
