## Github Widget

![Github Widget Image](http://i.imgur.com/KfiQIXL.png)

#### How to use


##### Copy paste this code in your HTML, replacing data-username with your GitHub username

```html
<div class="github-widget" data-username="surbhioberoi"></div>
<script src="https://npmcdn.com/github-card@1.2.0/dist/widget.js"></script>
```

##### Via npm

`npm install github-card`

Then add this to your HTML, replacing data-username value with your own GitHub username

```html
<div class="github-widget" data-username="surbhioberoi"></div>
<script src="../node_modules/github-card/dist/widget.js"></script>
```

##### Via bower

`bower install github-widget`

Then add this to your HTML, replacing data-username value with your own GitHub username

```html
<div class="github-widget" data-username="surbhioberoi"></div>
<script src="/bower_components/github-card/dist/widget.js"></script>
```

#### Using multiple widgets in same page

```html
<div class="github-widget" data-username="github"></div>
<div class="github-widget" data-username="surbhioberoi"></div>
<script src="https://npmcdn.com/github-card@1.2.0/dist/widget.js"></script>
```
