/*
 * Javascript for CImageSelector widget.
 * author: Paul Monk <paul@goletaworks.com> 
 */

var ImageSelector = function(initObj){
	var images = []; // array of image paths	
	var defaultSrc = ''; // path of the image in the array to display on first load
	var fieldId = ''; // ID of the form field to update with the path or a value (per attributeValuePattern)
	var attributeValuePattern = ''; // regular expression whose first submatch (result[1]) is the value to put in the field
	
	var onChange = null; // function to call when the widget image changes, e.g., a jQuery effect to use transition to a new image.
	var onImagesUploaded = null; // function to call if you want to update the images array, e.g. checks a global and returns an array of image filenames.  
	
	return {
		initialize : function(initObject){
			images = initObject.images;			
			defaultSrc = initObject.defaultSrc;
			fieldId = initObject.fieldId;
			attributeValuePattern = initObject.attributeValuePattern;
			onChange = initObject.onChange;
			onImagesUploaded = initObject.onImagesUploaded; 
			
			var parentElement = jQuery('#' + fieldId + '_imageSelector');
			var buttonHolder = jQuery('#' + fieldId + '_buttonHolder');
			
			parentElement.append('<div><image class="image-selector-holder"/></div>');
			var image = parentElement.find('.image-selector-holder');
			
			var me = this;
			buttonHolder.find('.previous-image, .next-image').on('click', function(ev){
				// this is the only good time to check for new uploads
				me.checkForUploadedImages();
				
				me.switchImage(me, jQuery(this), image);
				return false;
			});
			
			var defaultIndex = me.getIndex(defaultSrc);
			me.setImage(me, image, defaultIndex, null);
		},
		
		
		checkForUploadedImages : function(){
			if(!onImagesUploaded){
				return;
			}
			
			var newImages = eval(onImagesUploaded);
			if(!newImages || newImages.length == 0){
				return;
			}
						
			var ndx;
			for(ndx in newImages){
				// if the file matches the pattern, add it to the images array otherwise do nothing
				var newImage = newImages[ndx];
				var result = newImage.match(new RegExp(attributeValuePattern));
				if(result != null && result.length > 1){
					images.push(newImage);
				}
			}
		},
		
		
		switchImage : function(me, trigger, image){
			var newIndex = false;
			var currentIndex = this.getIndex(image.attr('src'));
			
			if(currentIndex === false){
				return false;
			}
			
			if(trigger.hasClass('previous-image')){
				if(currentIndex > 0){
					newIndex = currentIndex - 1;
				}
				else{
					newIndex = images.length - 1;
				}
			}
			else if(trigger.hasClass('next-image')){
				if(currentIndex + 1 < images.length){
					newIndex = currentIndex + 1;
				}
				else{
					newIndex = 0;
				}
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
			var matchedValue = null;
			
			matchedValue = me.updateField(newSrc);
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
			var matchedValue = null;
			
			if(!attributeValuePattern){
				field.val(imagePath);
			}
			else{
				var result = imagePath.match(new RegExp(attributeValuePattern));
				if(result == null){
					field.val('(Invalid)');
				}
				else if(result.length > 1){
					matchedValue = result[1];
					field.val(matchedValue);
				}
				else{
					field.val('(Invalid)');
				}
			}
			return matchedValue;
		}
	};	
};