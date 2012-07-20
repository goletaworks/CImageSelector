/*
 * Javascript for CImageSelector widget.
 * author: Paul Monk <paul@goletaworks.com> 
 */

var ImageSelector = function(initObj){
	var id = ''; // id to assign to the image element
	var images = []; // array of image paths	
	var defaultSrc = ''; // default image path (must be in images collection)
	var fieldId = ''; // ID of the form field to update with the path or a value (per attributeValuePattern)
	var attributeValuePattern = ''; // regular expression whose first submatch (result[1]) is the value to put in the field
	
	var transitionEffect = null; // a jQuery effect to use transition in to a new image. (A function taking an imageHolder object)
	
	return {
		initialize : function(initObject){
			images = initObject.images;			
			defaultSrc = initObject.defaultSrc;
			fieldId = initObject.fieldId;
			attributeValuePattern = initObject.attributeValuePattern;
			transitionEffect = initObject.transitionEffect;
			
			var parentElement = jQuery('#' + fieldId + '_imageSelector');
			var buttonHolder = jQuery('#' + fieldId + '_buttonHolder');
			
			parentElement.append('<div><image class="image-selector-holder" ' +
					'src="' + defaultSrc + '"/></div>');
			var imageHolder = parentElement.find('.image-selector-holder');
			
			var me = this;
			buttonHolder.find('.previous-image').on('click', function(ev){
				var currentPath = imageHolder.attr('src');
				var ndx = me.getIndex(currentPath);
				if(ndx !== false && ndx > 0){
					var newSrc = images[ndx - 1];
					me.updateField(newSrc);
					if(!transitionEffect){
						imageHolder.attr('src', newSrc);
					}
					else{
						eval(transitionEffect);
					}					
				}
				return false;
			});
			
			buttonHolder.find('.next-image').on('click', function(ev){
				var currentPath = imageHolder.attr('src');
				var ndx = me.getIndex(currentPath);
				if(ndx !== false && ndx + 1 < images.length){
					var newSrc = images[ndx + 1];
					me.updateField(newSrc);
					if(!transitionEffect){
						imageHolder.attr('src', newSrc);
					}
					else{
						eval(transitionEffect);
					}
				}				
				return false;
			});
		},
		
		getIndex : function(imagePath){
			for(ndx in images){
				if(images[ndx]==imagePath){
					return parseInt(ndx);
				}
			}
			return false;
		},
		
		updateField : function(imagePath){
			var field = jQuery('#' + fieldId);
			if(!attributeValuePattern){
				field.val(imagePath);
			}
			else{
				var result = imagePath.match(new RegExp(attributeValuePattern));
				if(result == null){
					field.val('(Invalid)');
				}
				else if(result.length > 1){
					field.val(result[1]);
				}
				else{
					field.val('(Invalid)');
				}
			}
		}
	};	
};