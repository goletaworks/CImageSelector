/*
 * Javascript for CImageSelector widget.
 * author: Paul Monk <paul@goletaworks.com> 
 */

var ImageSelector = function(initObj){
	var images = []; // array of image paths	
	var defaultSrc = ''; // default image path (must be in images collection)
	var fieldId = ''; // ID of the form field to update with the path or a value (per attributeValuePattern)
	var attributeValuePattern = ''; // regular expression whose first submatch (result[1]) is the value to put in the field
	
	var onChange = null; // a jQuery effect to use transition in to a new image. (A function taking an imageHolder object)
	
	return {
		initialize : function(initObject){
			images = initObject.images;			
			defaultSrc = initObject.defaultSrc;
			fieldId = initObject.fieldId;
			attributeValuePattern = initObject.attributeValuePattern;
			onChange = initObject.onChange;
			
			var parentElement = jQuery('#' + fieldId + '_imageSelector');
			var buttonHolder = jQuery('#' + fieldId + '_buttonHolder');
			
			parentElement.append('<div><image class="image-selector-holder" ' +
					'src="' + defaultSrc + '"/></div>');
			var imageHolder = parentElement.find('.image-selector-holder');
			
			var me = this;
			buttonHolder.find('.previous-image, .next-image').on('click', function(ev){
				me.switchImage(me, jQuery(this), imageHolder);
				return false;
			});
		},
		
		switchImage : function(me, trigger, image){
			var newSrc = '';
			var currentSrc = image.attr('src');
			var newIndex = false;
			var currentIndex = this.getIndex(currentSrc);
			
			if(currentIndex === false){
				return false;
			}
			
			if(trigger.hasClass('previous-image') && currentIndex > 0){
				newIndex = currentIndex - 1;				
			}
			else if(trigger.hasClass('next-image') && currentIndex + 1 < images.length){
				newIndex = currentIndex + 1;
			}
			else{
				return false;
			}
			newSrc = images[newIndex];
			
			me.updateField(newSrc);
			if(!onChange){
				image.attr('src', newSrc);
			}
			else{
				eval(onChange);
			}
			return true;
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