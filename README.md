![ViosMaps](media/logo-viosmaps-complete.png)

# ViosMaps - Vector Interactive OpenSource Maps

## Synopsis

**ViosMaps** is a development aimed to help you create and render **vector maps divided into regions** (created in the **SVG format**), setting metadata and managing the interactions in an easy way. 

## Motivation

The project started as a humble attempt to render and manage interactions with each region or province for the maps of Italy and Argentina. 

The idea behind opensourcing **ViosMaps** is mainly to be able to teamwork with developers around the world to share ideas and knowledge, generalize the codebase (by better modularization) and to add many great functionalities we can discuss about. It would be very nice if we also write good documentation encouraging more developers to use this resource as a library for their own projects.

## Dependencies

ViosMaps depends upon:

* [Snap.SVG](http://snapsvg.io)
* [jQuery](http://jquery.org)
* [jQuery Browser Plugin 0.1.0](https://github.com/gabceb/jquery-browser-plugin)

## Real Examples

### [Interactive Map of Argentina (click to play video)](http://www.youtube.com/watch?v=prYIRGF3WjI)

[![Interactive Map of Argentina](http://img.youtube.com/vi/prYIRGF3WjI/0.jpg)](http://www.youtube.com/watch?v=prYIRGF3WjI "Interactive Map of Argentina")

### [Interactive Map of Italy (click to play video)](http://www.youtube.com/watch?v=CGg1kKw0Qnk)

[![Interactive Map of Italy](http://img.youtube.com/vi/CGg1kKw0Qnk/0.jpg)](http://www.youtube.com/watch?v=CGg1kKw0Qnk "Interactive Map of Italy")

## Static Test Maps

Start your local webserver and launch test maps from:

* http://{__your_host__}/viosmaps/tests/**argentina.html**
* http://{__your_host__}/viosmaps/tests/**italia.html**

## Browserify-based Development version:

Start your local webserver and launch test maps from:

* http://{__your_host__}/viosmaps/tests/**browserify-test.html**

## Notes and ToDo

* **2016-04-07**
    * Currently main ViosMaps code is mixed inside those examples. Next steps to take: extract and modularize main functionality transforming it into a library. 
+ **2016-04-09**
    * I'm using **Browserify** to build lib/js/static/viosmaps-bundle.js. You can build (**from the lib/js folder**) running:
        * `browserify viosmaps.js -o static/viosmaps-bundle.js`
        * Note: To install browserify: 
            * npm install -g browserify
    * You can also use **watchify** the same way:
        * `watchify viosmaps.js -o static/viosmaps-bundle.js`
        * Note: To install watchify:
            * npm install -g watchify

## Contributors

* [Gustavo Adrián Salvini](https://linkedin.com/in/gustavosalvini) - [@guspatagonico](http://twitter.com/guspatagonico)
* [Darío Ruellan](http://linkedin.com/in/darioruellan) - [@druellan](http://twitter.com/druellan)

## License

Available under an [Apache 2 license](https://github.com/adobe-webplatform/Snap.svg/blob/master/LICENSE) which means it’s completely open-source, and completely free.
