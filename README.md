CImageSelector
==============
 * Developer: GoletaWorks Solutions, Inc. (http://www.goletaworks.com)
 * License: BSD (http://opensource.org/licenses/bsd-license.php)
 * Questions/Support: paul@goletaworks.com
 * Repo: https://github.com/goletaworks/CImageSelector

A very simple Yii extension (model-bound widget) for displaying and selecting images and mapping the filepath (or a portion of it) to a model attribute.

For example, you have a directory on the web server containing GIF images (image01.gif, image02.gif, etc.). When a user creates or edits a record, you want them to browse the images and select one and you want to store a part of the image filename (just the number: 01, 02, etc.) in the model's image_id attribute.

Add the following code to the view:

   		Yii::import('application.extensions.CImageSelector.CImageSelector');
 			$this->widget('CImageSelector',array(
 					'model' => $model,
 					'attribute' => 'image_id',
 					'options' => array(
 						'images' => glob('images/*.gif'),
 						'defaultSrc' => "images/image01.gif",
 						'attributeValuePattern' => 'images\\/image([0-9]+)\\.gif',
 
 						'onChange' => 
 								'(function(){ 
 									image.fadeOut("fast", function(){
 										image.attr("src", newSrc);
 										image.fadeIn("fast");
 									});
 								})();'
 					)
 			));	

The _options_ array supports the following:
 * images - (required) an array containing the image paths
 * attributeValuePattern - (required) empty, or a regular expression containing a submatch that will be used to populate the attribute mapped to this field.
 * defaultSrc - (required) the path to the image that is displayed if the field doesn't contain a valid value. (Must exist in the images array.)
 * onChange - (optional) a string containing Javascript executed after the field value is changed and before the image is changed. It can be used to create a transition effect when changing images. (See http://api.jquery.com/category/effects/). Be sure to include:
_image.attr("src", newSrc);_
to switch to the new image.
    In addition to the values in the _options_ array, the callback has access to the following:
     * me - the ImageSelector javascript object 
     * trigger - the jQuery object that triggered the transition (.next-image or .previous-image)
     * image - the jQuery object containing the image element 
     * newSrc - the path of the image transitioning into
     * currentSrc - the current image
     * newIndex - the index of the image in the array transitioning into
     * currentIndex - the index of the current image 