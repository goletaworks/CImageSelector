<?php 

/**
 * CImageSelector widget class. Example:
 * 
 *			Yii::import('application.extensions.CImageSelector.CImageSelector');
 *			$this->widget('CImageSelector',array(
 *					'model' => $model,
 *					'attribute' => 'image_id',
 *					'options' => array(
 *						'images' => glob('images/*.gif'),
 *						'defaultSrc' => "images/image01.gif",
 *						'attributeValuePattern' => 'images\\/image([0-9]+)\\.gif',
 *						'onChange' => 
 *								'(function(){ 
 *									image.fadeOut("fast", function(){
 *										image.attr("src", newSrc);
 *										image.fadeIn("fast");
 *									});
 *								})();'
 *					)
 *			));	
 * 
 * @author Paul Monk <paul@goletaworks.com>
 *
 */
class CImageSelector extends CInputWidget {
	
	const DEFAULT_CSS = 'image-selector.css';
	const DEFAULT_JS = 'image-selector.js';	
	
	/**
	 * @var array The options to be passed to the ImageSelector javascript object.
	 * The following options are required by CImageSelector:
	 *  * images - an array containing the image paths
	 *  * attributeValuePattern - empty, or a regular expression containing a submatch that
	 * 	  will be used to populate the attribute mapped to this field.
	 *  * defaultIndex - the index of the image in the images collection that is displayed if the field doesn't 
	 * 	  contain a valid value.
	 *  * onChange - (optional) a string containing Javascript executed after the field value is changed
	 *    and before the image is changed. It can be used to create a transition effect when changing images. 
	 *    (See http://api.jquery.com/category/effects/). Be sure to include:
	 *         image.attr("src", newSrc);
	 *    to switch to the new image.
	 *  * onImagesUploaded - (optional) a string of Javascript executed to fetch new images as from an AJAX
	 *    file uploader. It must return an array containing the images to be added.
	 *    
	 *    In addition to the values in the options array, the callback has access to the following:
	 *     * me - the ImageSelector javascript object 
	 *     * trigger - the jQuery object that triggered the transition (.next-image or .previous-image)
	 *     * image - the jQuery object containing the image element 
	 *     * newSrc - the path of the image transitioning into
	 *	   * currentSrc - the current image
	 *	   * newIndex - the index of the image in the array transitioning into
	 *	   * currentIndex - the index of the current image 
	 *	   * matchedValue - the part of the new image's filename that is stored in the form field 
	 */
	public $options;
	
	/**
	 * Initializes the widget.
	 * This method registers the client scripts and renders
	 * the input field, image holder, and image browser buttons.
	 */
	public function init() {

		list($name, $id) = $this->resolveNameID();
		if(isset($this->htmlOptions['id'])){
			$id = $this->htmlOptions['id'];
		}
		else {
			$this->htmlOptions['id'] = $id;
		}
		if(isset($this->htmlOptions['name'])){
			$name = $this->htmlOptions['name'];
		}
			
		if($this->hasModel()) {
			$this->htmlOptions['readonly']=true;
			echo CHtml::activeTextField($this->model, $this->attribute, $this->htmlOptions);
		}
		else {
			echo CHtml::$textField($name, $this->value, $this->htmlOptions);
		}
		$this->registerClientScripts();
				
		echo '<span id="' . $id . '_buttonHolder" class="image-selector-button-holder">' .
			'<a href="#" class="previous-image">&lt;</a>&nbsp;' .
			'<a href="#" class="next-image">&gt;</a></span>' .
			'<div id="' . $id . '_imageSelector" class="image-selector"/>';
		
		parent::init();
	}
	
	/**
	 * Registers the needed CSS and JavaScript.
	 */
	public function registerClientScripts() {
		$options = $this->options;
		list($name, $id) = $this->resolveNameID();
		$options['fieldId'] = $id;
		$options = CJavaScript::encode($options);
		
		$cs = Yii::app()->getClientScript();
		$cs->registerCoreScript('jquery');
		$cs->registerCssFile(self::getAssetPath(self::DEFAULT_CSS));
		$cs->registerScriptFile(self::getAssetPath(self::DEFAULT_JS), CClientScript::POS_END);		
		$cs->registerScript('imageSelectorConstructor', 
				"(function(){var selector = new ImageSelector(); selector.initialize({$options});})();");
	}
	
	/**
	 * Returns the full path to an asset in the widget's assets directory.
	 */
	private function getAssetPath($assetPartialPath) {
		$assets = Yii::app()->getAssetManager()->publish(dirname(__FILE__) . 
				DIRECTORY_SEPARATOR . 'assets');
		return  $assets . '/' . $assetPartialPath; 
	}	
}