'use strict';

require('process-time');

var request = require('request')
var fs = require('fs')
var Transform = require('stream').Transform
var inherits = require('util').inherits
const minifyXML = require("minify-xml").minify;
var through2 = require('through2')
const zlib = require('zlib');
var figlet = require("figlet");

const Gzip = zlib.createGzip({
	level: 9
});

function ActualBears() {
    Transform.call(this)
}

inherits(ActualBears, Transform)

ActualBears.prototype._transform = function(chunk, enc, done) {

    chunk = minifyXML(chunk
        .toString()
        .replace(/ +/g, ' ')
        .replace(/ ;+/g, ';')
        .replace(/(<!DOCTYPE html)(.*\n)+^.+/gim, '')
    )

    this.push(chunk)
    done()
}

var download = request('https://api.21vek.by/feeds/115587.xml', 'utf8')
var write = fs.createWriteStream(__dirname + '/src/115587.min.xml.gz', 'utf8')

download
    .pipe(new ActualBears())
    .pipe(through2(
        (chunk, enc, cb) => cb(null, chunk), // transform is a noop
        function(cb) { // flush function

            this.push('</offer></offers></shop></yml_catalog>');
            cb();
        }
	 ))
	 .pipe(Gzip)
	 .pipe(write)
	 
    .on('finish', () => {

        figlet.text("XML end!", function(error, data) {
            if (error)
                console.error(error);
            else
                console.log(data);
            console.log('Обработка файла закончена.');
        });

	 })
	 

figlet.text("XML start!", function(error, data) {
    if (error)
        console.error(error);
    else
        console.log(data);
    console.log('Обработка файла началась.');
});