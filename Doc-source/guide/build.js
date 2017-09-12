'use strict';

var Metalsmith = require('metalsmith');
var watch = require('metalsmith-watch');
var navigation = require('metalsmith-navigation');
var collections = require('metalsmith-collections');
var markdown = require('metalsmith-markdown');
var helpers = require('metalsmith-register-helpers');
var layouts = require('metalsmith-layouts');


var metalsmith = Metalsmith(__dirname)
	.source('content')
	.destination('../../docs/Guide')
	.metadata({
		'title': 'Brixy User Guide',
		'version': '1.0.0'
	})
	.use(watch({
		'paths': {
			'${source}/**/*.md': '**/*',
			'${source}/{css,js}/**/*': true,
			'layouts/**/*': '**/*'
		}
	}))
	.use(collections({
		'latests': {
			'pattern': '**/*.md',
			'sortBy': 'edited',
			'reverse': true,
			'limit': 5,
			'refer': false
		}
	}))
	.use(markdown({
		'langPrefix': 'language-'
	}))
	.use(navigation({
		'guides': {
			'sortBy': 'order',
			'filterProperty': false,
			'pathProperty': 'navPath',
			'childrenProperty': 'navChildren',
			'breadcrumbProperty': 'breadcrumbPath'
		}
	}, {
		'navListProperty': 'navs'
	}))
	.use(helpers({
		'directory': 'lib/handlebars-helpers'
	}))
	.use(layouts({
		'pattern': '**/*.html',
		'engine': 'handlebars',
		'default': 'page.html',
		'directory': 'layouts',
		'partials': 'layouts/partials'
	}))
	.build(function(err) {
		if (err) throw err;
	});