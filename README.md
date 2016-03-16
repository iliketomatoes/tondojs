# tondojs

This is a vanilla javascript plugin for creating SVG curved text to wrap HTML elements.
It makes sense only when you are applying this plugin on rounded HTML elements.

##INSTALL

You can either clone it, download it or get it through Bower.

```
bower install tondojs
```

##USAGE

Include the css into your page:
```html
<link rel="stylesheet" href="path/to/dist/tondo.css">
```

Include the script into your page:
```html
<script src="path/to/dist/tondo.js"></script>
```

### Initializing Tondo with *data-attributes*

```html
<div class="some-round-class" data-tondo data-tondo-up="text:'Hello!!!'" data-tondo-down="text:'It\'s meee!'">
	<span>Sample text</span>
</div>        
```

Then initialize the plugin:

```javascript
var dataBadges = new Tondo();
```

### Initializing Tondo with *data-attributes* specifing the selector

```html
<div class="some-round-class-i-want-to-target" data-custom-class="svg-custom-class" data-tondo-up="text:'Hello again'" data-tondo-down="text:'From the other side';gap:-5;textClass:'text-element-extra-class';letterSpacing:1">
	<span>Sample text</span>
</div>        
```
For demonstration purposes I also added some options with the data attributes.
Then initialize the plugin:

```javascript
var targetBadges = new Tondo('.some-round-class-i-want-to-target');
```

### Initializing Tondo programmatically

```html
<div id="sample-target"><span>Sample text</span></div>        
```
Then initialize the plugin:

```javascript
var circle = new Tondo('#sample-target', {
    tondoUp: {
        text: 'Isn\'t it cool?'
    },
    tondoDown: {
        text: 'Yes, I think it is :-)'
    }
});
```

### AMD USAGE

Since it doesn't have dependencies,if you are using Requirejs just write something like this:
```javascript
require(['tondo'], function(Tondo){
    //Put here the same thing as shown above
})      
```

##OPTIONS

Available options:

| Property         | Description                                                      | Type        | DEFAULT |
| ---------------- |----------------------------------------------------------------  | ----------- | ------- |
| defaultClass	   | The class added to the SVG element by default                    | string      | 'tondo' |
| customClass      | A string containing custom classes to be added to the SVG element| string      | ''      |
| tondoUp          | An object describing the curved text that goes on top of the SVG element   | object      | see description below|
| tondoDown        | An object describing the curved text that goes to the bottom of the SVG element   | object      | see description below|

#### tondoUp and tondoDown available options:

| Property         | Description                                                      | Type        | DEFAULT |
| ---------------- |----------------------------------------------------------------  | ----------- | ------- |
| text	           | The text that goes inside the textPath element                   | string      | ''      |
| gap              | The distance of the circle from the edge of the HTML target element | number      | 5 for tondoUp, 0 for tondoDown |
| startOffset      | textPath's text starting offset                                  | string      | '50%'   |
| textAnchor       | [textPath's text alignment](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/text-anchor) | string | 'middle' |
| textClass        | A string containing custom classes to be added to the text element | string    | ''      |

##BROWSER SUPPORT

Not tested yet, but working on all modern browser, IE11+.

##ROADMAP

+ Better API
+ Better Tests
+ Compatibility for older browsers?

##LICENSE

MIT License