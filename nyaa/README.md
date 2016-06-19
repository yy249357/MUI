nyaaJS
======

A light weight javascript framework.

Install
-------

* <del>[Download the latest release](http://nyaajs.org/download).</del>
* Clone the repo: `git clone https://github.com/nyaaJS/nyaaJS.git`.

Get started
-----------

Here is a simple example.

**/modules/test.js**
```js
$nyaa.register(
    // this module's name is 'test'
    'test',
    // require system module in nyaa.request.js which is in the same path as nyaa.js
    ['request'],
    {
        onLoad: function(){
            // display the value which key is 'test' in query string
            alert(this.nyaa.request.query('test'));
        }
    }
);
```

**/index.html**
```html        
<script src="/path/to/nyaa.js"></script>

<script>
    $nyaa.set_config({
        // load custom module in /modules/test.js
        'modules': ['test'],
        'base': '/modules'
    });
    
    $nyaa.init();
</script>
```

Then, when you visit `http://your.domain/index.html?test=hello`. The page will show an alert dialog with the string 'hello'.

Document
--------

**(not finished yet)**

Example
-------

<del>Visit our [example site](http://nyaajs.org/example/hello) to understand how it works.</del>