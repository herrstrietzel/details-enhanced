# details-enhanced
JS script to progressively enhance HTML details elements with animations, jump anchors etc.

## Features
* flexible styling: unopinionated multiple icon and style options
* customization via: data-attributes, CSS class names or JS options
* support for nested `<details>`
* automatic enhancement: no manual nesting by additional wrapping divs etc. required
* no-script fallback: `<details>`
* auto anchor ID creation

## 1. Usage 
Load CSS and JS

```
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/herrstrietzel/details-enhanced@main/v1/details-enhanced.css">
<script src="https://cdn.jsdelivr.net/gh/herrstrietzel/details-enhanced@main/v1/details-enhanced.js" defer></script>
```


### 1.2 Initialize:
#### 1.2.1 via CSS classnames
Add  classname `details-wrap` and `details-enhanced` to an ancestor HTMl element – all `<details>` are enhanced.

Default class names:
* `details-wrap` => hides default summary markers via CSS – prevents layout shifts on initialization
* `details-enhanced` => converts all `<details>` elements within this element
* `details-right` => aligns summary marker to the right
* `details-plus` => changes default "chevron" style to plus/minus marker style
* `details-round` => displays summary marker in circle

```
<!-- apply default styles; add round markers; align right; plus/minus style -->
<main class="details-wrap details-enhanced details-round details-right details-plus">
  <details open>
    <summary> Summary 1</summary>
    <p>A path is defined by including a ‘path’ element on which the d property specifies the path data. The path
      data contains the moveto, lineto, curveto (both cubic and quadratic Béziers), arc and closepath
      instructions.</p>
    <details>
</main>
```



#### 1.2.2 via JavaScript options
```
// optional: define custom svg icon
summaryIcons['arrow-right'] = `<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>`;

let options = {
    target: 'main',
    icon: summaryIcons['arrow-right'],
    round: true,
    right: true
}

enhanceDetails(options);
```

```
<main class="details-wrap">
  <details open>
    <summary> Summary 1</summary>
    <p>A path is defined by including a ‘path’ element on which the d property specifies the path data. The path
      data contains the moveto, lineto, curveto (both cubic and quadratic Béziers), arc and closepath
      instructions.</p>
   </details>
</main>
```


#### 1.2.3 via data-attributes
Same as the JS example but with the options defined in the `data-details` attribute.
```
<main class="details-wrap">
  <details data-details='{"round":false, "right":false}' open>
    <summary> Summary 1</summary>
    <p>A path is defined by including a ‘path’ element on which the d property specifies the path data. The path
      data contains the moveto, lineto, curveto (both cubic and quadratic Béziers), arc and closepath
      instructions.</p>
   </details>
</main>
```
#### 1.3 Demos
1. [Simple: CSS initialization ](https://codepen.io/herrstrietzel/pen/ExBbpPX)



### Limitations
* transition currently not supported in iOS safari 

