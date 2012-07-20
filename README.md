CImageSelector
==============
 * Developer: GoletaWorks Solutions, Inc. (http://www.goletaworks.com)
 * License: BSD (http://opensource.org/licenses/bsd-license.php)
 * Questions/Support: paul@goletaworks.com
 * Repo: https://github.com/goletaworks/CImageSelector

A very simple Yii extension (model-bound widget) for displaying and selecting images and 
mapping the filepath (or a portion of it) to a model attribute.

For example, a directory on the web server contains a set of GIF images (image01.gif, image02.gif, etc.). 
When creating or editing a particular record, A part of the image filename needs to be stored in the model. 
The widget enables the user to browse the images and select the desired one.

   		Yii::import('application.extensions.CImageSelector.CImageSelector');
 			$this->widget('CImageSelector',array(
 					'model' => $model,
 					'attribute' => 'image_id',
 					'options' => array(
 						'images' => glob('images/*.gif'),
 						'defaultSrc' => "images/image01.gif",
 						'attributeValuePattern' => 'images\\/image([0-9]+)\\.gif',
 
 						'transitionEffect' => 
 								'(function(imageHolder){ 
 									imageHolder.fadeOut("fast", function(){
 										imageHolder.attr("src", newSrc);
 										imageHolder.fadeIn("fast");
 									});
 								})(imageHolder);'
 					)
 			));	

The _options_ array supports the following:
 * images - (required) an array containing the image paths
 * attributeValuePattern - (required) empty, or a regular expression containing a submatch that will be used to populate the attribute mapped to this field.
 * defaultSrc - (required) the path to the image that is displayed if the field doesn't contain a valid value. (Must exist in the images array.)
 * transitionEffect - (optional) a string containing Javascript that creates a transition effect when changing images. (See http://api.jquery.com/category/effects/)