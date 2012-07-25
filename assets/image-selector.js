/*
 * Javascript for CImageSelector widget.
 * author: Paul Monk <paul@goletaworks.com> 
 */

var ImageSelector = function(initObj){
	var images = []; // array of image paths	
	var defaultSrc = ''; // path of the image in the array to display on first load
	var fieldId = ''; // ID of the form field to update with the path or a value (per attributeValuePattern)
	var attributeValuePattern = ''; // regular expression whose first submatch (result[1]) is the value to put in the field
	
	var onChange = null; // js code to execute when the widget image changes, e.g., a jQuery effect to use transition to a new image.
	
	return {
		initialize : function(initObject){
			images = initObject.images;			
			defaultSrc = initObject.defaultSrc;
			fieldId = initObject.fieldId;
			attributeValuePattern = initObject.attributeValuePattern;
			onChange = initObject.onChange;
			
			var parentElement = jQuery('#' + fieldId + '_imageSelector');
			var buttonHolder = jQuery('#' + fieldId + '_buttonHolder');
			
			parentElement.append('<div><image class="image-selector-holder"/></div>');
			var image = parentElement.find('.image-selector-holder');
			
			var me = this;
			buttonHolder.find('.previous-image, .next-image').on('click', function(ev){
				me.switchImage(me, jQuery(this), image);
				return false;
			});
			
			var defaultIndex = me.getIndex(defaultSrc);
			me.setImage(me, image, defaultIndex, null);
		},
		
		switchImage : function(me, trigger, image){
			var newIndex = false;
			var currentIndex = this.getIndex(image.attr('src'));
			
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
				
			me.setImage(me, image, newIndex, trigger);
			return true;
		},
		
		setImage : function(me, image, newIndex, trigger){
			var currentSrc = image.attr('src');
			var currentIndex = this.getIndex(currentSrc);
			var newSrc = images[newIndex];
			
			me.updateField(newSrc);
			if(!onChange){
				image.attr('src', newSrc);
			}
			else{
				eval(onChange);
			}			
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