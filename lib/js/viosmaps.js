/**
 * ViosMaps - Visual Interactive OpenSource Maps
 * @author  Gustavo Adrián Salvini
 * @date 20160408
 */

function openURwithTarget( url, target ) {
    var win = window.open(url, target);
    win.focus();
}

window.onload = function () {

    var s           = Snap("#svgMap");
    // s.attr({ width: "100%", height: "100%" });

    var map_x_offset = 106, map_y_offset = 50;
    var isFullyCompatibleBrowser =  ! ( $.browser.msie || $.browser.msedge || $.browser["windows phone"] );

    var shadow      = s.filter(Snap.filter.shadow(0, 2, 3));
    var noShadow    = s.filter(Snap.filter.shadow(0,0,0));
    var invert      = s.filter(Snap.filter.invert(1.0));
    // var invertFilterChild = invert.node.firstChild;
    var noInvert    = s.filter(Snap.filter.invert(0));
    var saturate    = s.filter(Snap.filter.saturate(1.5));
    var saturateFilterChild = saturate.node.firstChild;

    var activeBounds = {};

    var defaultRegionURL = '#';
    var regionsMetadata =
        { 
            'antartida': { 'text': "Antártida (Arg.)", 'url': 'https://es.wikipedia.org/wiki/Ant%C3%A1rtida_Argentina', 'target': '_blank', 'label_offset_x': 50, 'label_offset_y': 0, 'label_hover_offset_x': 30, 'label_hover_offset_y': -10 },
            'malvinas': { 'text': "Islas Malvinas", 'label_offset_x': 0, 'label_offset_y': -20, 'label_hover_offset_x': 10, 'label_hover_offset_y': -10 },
            'buenos-aires': { 'text': "Buenos Aires", 'url': 'https://es.wikipedia.org/wiki/Provincia_de_Buenos_Aires', 'target': '_blank', 'label_offset_x': -2, 'label_offset_y': 0, 'label_hover_offset_x': -5, 'label_hover_offset_y': -20 },
            'caba': { 'text': "", 'url': 'https://es.wikipedia.org/wiki/Buenos_Aires', 'label_offset_x': 60, 'label_offset_y': 10 },
            'caba-big': { 'text': "Capital Federal", 'url': 'https://es.wikipedia.org/wiki/Buenos_Aires', 'target': '_blank', 'label_offset_x': 0, 'label_offset_y': 70, 'label_hover_offset_y': 55 },
            'catamarca': { 'text': "Catamarca", 'label_offset_x': 2, 'label_offset_y': 10, 'rotation': 45 },
            'chaco': { 'text': "Chaco", 'label_offset_x': 12, 'label_offset_y': 28, 'label_hover_offset_x': 7, 'label_hover_offset_y': 10 },
            'chubut': { 'text': "Chubut", 'label_offset_x': -10, 'label_offset_y': 10, 'rotation': -5 },
            'cordoba': { 'text': "Córdoba", 'label_offset_x': -2, 'label_offset_y': 0, 'rotation': 0 },
            'corrientes': { 'text': "Corrientes", 'url': 'https://es.wikipedia.org/wiki/Provincia_de_Corrientes', 'label_offset_x': 10, 'label_offset_y': 10, 'label_hover_offset_x': 95, 'label_hover_offset_y': 20 },
            'entre-rios': { 'text': "Entre Ríos", 'label_offset_x': 20, 'label_offset_y': 10, 'rotation': 0, 'label_hover_offset_x': 100, 'label_hover_offset_y': -20 },
            'formosa': { 'text': "Formosa", 'label_offset_x': 0, 'label_offset_y': 17, 'rotation': 28 },
            'jujuy': { 'text': "Jujuy", 'label_offset_x': 0, 'label_offset_y': 14, 'rotation': 40 },
            'la-pampa': { 'text': "La Pampa", 'label_offset_x': 0, 'label_offset_y': 15, 'rotation': 0 },
            'la-rioja': { 'text': "La Rioja", 'label_offset_x': 0, 'label_offset_y': 0, 'rotation': 45 },
            'mendoza': { 'text': "Mendoza", 'label_offset_x': -5, 'label_offset_y': 10, 'rotation': -50 },
            'misiones': { 'text': "Misiones", 'label_offset_x': 5, 'label_offset_y': 17, 'rotation': -45 },
            'tucuman': { 'text': "Tucumán", 'label_offset_x': 0, 'label_offset_y': 0, 'label_hover_offset_x': 10 , 'label_hover_offset_y': -40 },
            'neuquen': { 'text': "Neuquén", 'label_offset_x': 0, 'label_offset_y': 15, 'rotation': -50 },
            'rio-negro': { 'text': "Río Negro", 'label_offset_x': 0, 'label_offset_y': 25, 'rotation': -3, 'label_hover_offset_x': 20 },
            'salta': { 'text': "Salta", 'label_offset_x': 10, 'label_offset_y': 35, 'label_hover_offset_x': 0, 'label_hover_offset_y': 20 },
            'san-juan': { 'text': "San Juan", 'label_offset_x': -10, 'label_offset_y': 20, 'rotation': 0 },
            'san-luis': { 'text': "San Luis", 'label_offset_x': 8, 'label_offset_y': 10, 'rotation': -90, 'label_hover_offset_x': 0, 'label_hover_offset_y': 5 },
            'santa-cruz': { 'text': "Santa Cruz", 'label_offset_x': 5, 'label_offset_y': -20, 'rotation': -5, 'label_hover_offset_x': 5, 'label_hover_offset_y': -34 },
            'santa-fe': { 'text': "Santa Fe", 'label_offset_x': -4, 'label_offset_y': 10, 'rotation': -75 },
            'santiago-del-estero': { 'text': "Stgo. del Estero", 'label_offset_x': 0, 'label_offset_y': 5, 'rotation': -50 },
            'tierra-del-fuego': { 'text': "Tierra del Fuego", 'label_offset_x': 45, 'label_offset_y': 0, 'rotation': -7, 'label_hover_offset_x': 40, 'label_hover_offset_y': 0 },
    };

    Snap.plugin( function( Snap, Element, Paper, global ) {
        Element.prototype.addTransform = function( t ) {
            return this.transform( this.transform().localMatrix.toTransformString() + t );
        };
    });


    Snap.load("assets/argentina_map.svg", function (f) {

        /**
         * [drawBounds description]
         * @param  {[type]} targetObject [description]
         * @return {[type]}              [description]
         */
        function drawBounds(targetObject) {

            targetId = targetObject.attr('id');

            if ( typeof activeBounds[ targetId ] == 'undefined')  
                activeBounds[ targetId ] = [];

            var tmp_polyline, tmp_outer_disc, tmp_inner_disc, tmp_innermost_disc;

            var bbox = targetObject.getBBox();

            // calculate middle point
            var x_center = ( bbox.x2 + bbox.x ) / 2 + map_x_offset; 
            var y_center = ( bbox.y2 + bbox.y ) / 2 + map_y_offset;

            if (false) {


                tmp_polyline = s.polyline( bbox.x + map_x_offset, bbox.y + map_y_offset, 
                                            bbox.x2 + map_x_offset, bbox.y + map_y_offset,
                                            bbox.x2 + map_x_offset, bbox.y2 + map_y_offset,
                                            bbox.x + map_x_offset, bbox.y2 + map_y_offset,
                                            bbox.x + map_x_offset, bbox.y + map_y_offset
                                             )
                    .attr({
                        stroke: "rgb(206,43,55)",
                        strokeWidth: "2",
                        opacity: "0.3",
                        fill: "none"
                    });

                activeBounds[ targetId ].push( tmp_polyline );

                tmp_outer_disc = s.circle(x_center, y_center, bbox.r0 ).attr({
                    fill: "none",
                    stroke: "rgb(0, 146, 70)",
                    strokeWidth: "3",
                    opacity: "0.3",
                });

                activeBounds[ targetId ].push( tmp_outer_disc );

                tmp_inner_disc = s.circle(x_center, y_center, bbox.r1 ).attr({
                    fill: "none",
                    stroke: "rgb(206,43,55)",
                    strokeWidth: "3",
                    opacity: "0.3",
                });

                activeBounds[ targetId ].push( tmp_inner_disc );
                // console.log('activeBounds:', activeBounds);
            }


        }

        /**
         * [mouseOutSVG description]
         * @param  {[type]} event [description]
         * @return {[type]}       [description]
         */
        function mouseOutSVG(event) {
            // console.log('Out of SVG!!!!!');
            // console.log(event.target);
        }



        /**
         * [hoverRegion description]
         * @param  {[type]} event [description]
         * @return {[type]}       [description]
         */
        function hoverRegion(event) {

            if ( isFullyCompatibleBrowser ) {

                if (weakOverlays != null) weakOverlays.animate( { 'opacity': '0' }, 200, mina.easeout );

                // var lastChild = document.querySelectorAll('g#italia_regioni')[0].lastElementChild;
                // var $lastChild = $('#regions > path:last-child');
                var $lastChild = $('#regions').children().last();
                // var lastSnapObject = s.select( '#'+lastChild.id );
                var lastSnapObject = s.select( '#'+$lastChild.attr('id') );
                lastSnapObject.after(this);

                /* regions labels */
                var label_hover_x = 0,
                    label_hover_y = 0;

                if ( typeof regionsMetadata[ this.attr('id') ] != 'undefined') 
                {               

                    if ( typeof regionsMetadata[ this.attr('id') ]['label_hover_offset_x'] != 'undefined')
                        label_hover_x = regionsMetadata[ this.attr('id') ]['label_hover_offset_x'];
        
                    if ( typeof regionsMetadata[ this.attr('id') ]['label_hover_offset_y'] != 'undefined')
                        label_hover_y = regionsMetadata[ this.attr('id') ]['label_hover_offset_y'];

                }

                console.log( 'Original BBox for:', this );
                console.log( regions[ this.attr('id') ].originalBBox);

                var originalBBox        = regions[ this.attr('id') ].originalBBox;
                var originalTransform   = regions[ this.attr('id') ].originalTransform; 
                // this.transform( regions[ this.attr('id') ].originalTransform['string'] );
                
                var that = this;

                // that.attr({ transform:  });
                that.attr({ filter: shadow }).animate( { transform: "s1.6,1.6,"+originalBBox.cx+","+originalBBox.cy }, 600, mina.elastic );
                
                regions[ this.attr('id') ].snapLabel.animate( { 'opacity': '1' }, 300, mina.easeout );
                regions[ this.attr('id') ].snapLabel.addTransform('t'+label_hover_x+','+label_hover_y).addTransform('s1.6,1.6');

                console.log( 'On Hover BBox:', that.getBBox() );

            }
            else // not fully compatible browser
            {
                this.attr({ filter: invert });
            }
        }

        /**
         * [removeBounds description]
         * @return {[type]} [description]
         */
        function removeBounds() {

            // cleans the activeBounds Queue
            var nActiveBounds = Object.keys(activeBounds).length;
            // console.log('#Regions with Active Bounds:', nActiveBounds );
            if ( nActiveBounds > 0 )
            { 
                // console.log('There are things to be cleaned!');
                for (var region in activeBounds) {
                    // console.log('#-# region: ', region);
                    for ( var i = 0; i < activeBounds[region].length; i++ ) {
                        activeBounds[region][i].remove();
                    }
                    activeBounds[region] = [];
                }
            } 
        }


        /**
         * [noHoverRegion description]
         * @param  {[type]} event [description]
         * @return {[type]}       [description]
         */
        function noHoverRegion(event) {
            // console.log('mouseOut:', this.attr('id'));
            // setTimeout( function() { removeBounds() }, 2000 );
            if (weakOverlays != null) weakOverlays.animate( { 'opacity': '1' }, 200, mina.easeout );

            if ( isFullyCompatibleBrowser ) {

                /* regions labels */
                var label_hover_x = 0;
                var label_hover_y = 0;

                if ( typeof regionsMetadata[ this.attr('id') ] != 'undefined') 
                {               
                    if ( typeof regionsMetadata[ this.attr('id') ]['label_hover_offset_x'] != 'undefined')
                        label_hover_x = -1 * regionsMetadata[ this.attr('id') ]['label_hover_offset_x'];
        
                    if ( typeof regionsMetadata[ this.attr('id') ]['label_hover_offset_y'] != 'undefined')
                        label_hover_y = -1 * regionsMetadata[ this.attr('id') ]['label_hover_offset_y'];

                    // if ( typeof regionsMetadata[ this.attr('id') ]['label_hover_rotation'] != 'undefined')
                    //  label_hover_rotation = -1 * regionsMetadata[ this.attr('id') ]['label_hover_rotation'];

                }

                var originalBBox        = regions[ this.attr('id') ].originalBBox;
                var originalTransform   = regions[ this.attr('id') ].originalTransform; 

                this.animate({ transform: "s1,1,"+originalBBox.cx+","+originalBBox.cy }, 700, mina.elastic).attr({ filter: noShadow });

                // console.log( 'Original Transform for:', this );
                // console.log( regions[ this.attr('id') ].originalTransform );
                // this.addTransform( regions[ this.attr('id') ].originalTransform['string'] );

                regions[ this.attr('id') ].snapLabel.animate( { 'opacity': '0.2' }, 300, mina.easeout );
                regions[ this.attr('id') ].snapLabel.addTransform('s0.625,0.625').addTransform('t'+label_hover_x+','+label_hover_y);
            }
            else
            {
                this.animate({ transform: "s1,1" }, 700, mina.elastic).attr({ filter: noInvert });
            }


        }



        /**
         * [clickRegion description]
         * @param  {[type]} event [description]
         * @return {[type]}       [description]
         */
        function clickRegion(event) {

            var regionURL = defaultRegionURL,
                target = '_self'; 

            if ( typeof regionsMetadata[ this.attr('id') ] != 'undefined') 
            {       
                if ( typeof regionsMetadata[ this.attr('id') ]['url'] != 'undefined')
                    regionURL = regionsMetadata[ this.attr('id') ]['url'];

                if ( typeof regionsMetadata[ this.attr('id') ]['target'] != 'undefined')
                    target = regionsMetadata[ this.attr('id') ]['target'];
            }
            
            // top.location.href = regionURL; 
            openURwithTarget( regionURL, target );
        }

        /* Main callback code for Snap.load ************************************************************************/

        var regionsContainer = f.select("#regions");
        s.append(regionsContainer); 

        var weakOverlays = f.select("#weak-overlays");
        if ( weakOverlays != null)
        {
            s.append(weakOverlays); 
            weakOverlays.attr({ 'pointer-events': 'none' });            
        } 

        // var  elemRegions     = document.querySelectorAll('#regions > path'),
        var elemRegions     = $('#regions').children(),
            regions         = {};

        // console.log( 'Regiones:', elemRegions.length );

        s.mouseout( function(event) {
            mouseOutSVG(event);
        } );

        var regionBBox;

        for ( var i = 0; i < elemRegions.length; i++ ) {
            regions[ elemRegions[i].id ] = {};
            regions[ elemRegions[i].id ].id = elemRegions[i].id;
            var regionId = regions[ elemRegions[i].id ].id;
            // regions[ elemRegions[i].id ].name = elemRegions[i].getAttribute('data-name');
            regions[ elemRegions[i].id ].snapObject = s.select( '#'+elemRegions[i].id );
            regions[ elemRegions[i].id ].pathLength = Snap.path.getTotalLength( regions[ elemRegions[i].id ].snapObject );
            regions[ elemRegions[i].id ].originalBBox = regions[ elemRegions[i].id ].snapObject.getBBox();
            regions[ elemRegions[i].id ].originalTransform = regions[ elemRegions[i].id ].snapObject.transform();

            // console.log ( elemRegions[i].id,':', regions[ elemRegions[i].id ].originalTransform );

            /* region bounding box */
            var regionBBox = regions[ elemRegions[i].id ].snapObject.getBBox();
            
            var x_center = ( regionBBox.x2 + regionBBox.x ) / 2 + map_x_offset; 
            var y_center = ( regionBBox.y2 + regionBBox.y ) / 2 + map_y_offset;

            /* event handlers */
            regions[ elemRegions[i].id ].snapObject.hover( hoverRegion, noHoverRegion );
            regions[ elemRegions[i].id ].snapObject.click( clickRegion );

            /* regions labels */
            var label_x = x_center;
            var label_y = y_center;
            var label_text = regionId;
            var label_rotation = 0;

            if ( typeof regionsMetadata[ elemRegions[i].id ] != 'undefined') 
            {               
                if ( typeof regionsMetadata[ elemRegions[i].id ]['label_offset_x'] != 'undefined')
                    label_x += regionsMetadata[ elemRegions[i].id ]['label_offset_x'];
    
                if ( typeof regionsMetadata[ elemRegions[i].id ]['label_offset_y'] != 'undefined')
                    label_y += regionsMetadata[ elemRegions[i].id ]['label_offset_y'];

                if ( typeof regionsMetadata[ elemRegions[i].id ]['text'] != 'undefined')
                    label_text = regionsMetadata[ elemRegions[i].id ]['text'];

                if ( typeof regionsMetadata[ elemRegions[i].id ]['rotation'] != 'undefined')
                    label_rotation = regionsMetadata[ elemRegions[i].id ]['rotation'];

            }


            var label       = s.text(label_x, label_y, label_text);

            // var label1       = s.multitext(label_x, label_y, label_text, 200, { "font-size": "10px" });

            var labelBBox   = label.getBBox();
            label.transform('t-'+labelBBox.width/2+',-'+ labelBBox.height/2 +' r' + label_rotation );
            label.attr({ 'pointer-events': 'none' });
            regions[ elemRegions[i].id ].snapLabel = label;
            // regions[ elemRegions[i].id ].snapLabel.remove();
            regions[ elemRegions[i].id ].snapLabel.attr({'font-size': '16px', 'opacity': '0.2'});

            regions[ elemRegions[i].id ].snapLabelTransform = regions[ elemRegions[i].id ].snapLabel.transform();
            // console.log( 'current label transform:', regions[ elemRegions[i].id ].snapLabelTransform ); 


            // s.append(regions[ elemRegions[i].id ].snapLabel );

        }
        /* /End Main callback code for Snap.load ************************************************************************/


    });
};
