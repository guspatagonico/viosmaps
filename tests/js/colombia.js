/**
 * Colombia Interactive Map
 * @author  Jhonny Romero
 * @date 20170827
 */

function openURwithTarget( url, target ) {
	var win = window.open(url, target);
	win.focus();
}

window.onload = function () {

	var s 			= Snap("#svgMap");
	var map_x_offset = 85, map_y_offset = 55;
	var isFullyCompatibleBrowser =  ! ( $.browser.msie || $.browser.msedge || $.browser["windows phone"] );
	var shadow 		= s.filter(Snap.filter.shadow(0, 9, 3));
	var noShadow 	= s.filter(Snap.filter.shadow(0,0,0));
	var invert 		= s.filter(Snap.filter.invert(1.0));
	var noInvert 	= s.filter(Snap.filter.invert(0));
	var saturate	= s.filter(Snap.filter.saturate(1.5));
	var saturateFilterChild = saturate.node.firstChild;
	var activeBounds = {};
	var defaultRegionURL = '#';
	var regionsMetadata =
        { 
            'valle-del-cauca':      { 'text': "Valle del cauca", 'text2': "Cali, Población: 4.613.377", 'label_offset_x': -100, 'label_offset_y': 50, 'label_hover_offset_x': -500, 'label_hover_offset_y': -80 },	
            'putumayo':             { 'text': "Putumayo", 'text2': "Mocoa, Población: 345.204", 'label_offset_x': -80, 'label_offset_y': 0, 'label_hover_offset_x': -400, 'label_hover_offset_y': 200 },	
            'antioquia':            { 'text': "Antioquia", 'text2': "Medellín, Población: 6.534.764", 'label_offset_x': 5, 'label_offset_y': 60,'label_hover_offset_x': -700, 'label_hover_offset_y': -370 },	
            'caldas':               { 'text': "Caldas", 'text2': "Manizales, Población: 988.003", 'label_offset_x': -20, 'label_offset_y': 40, 'label_hover_offset_x': -800, 'label_hover_offset_y': -70 },	
            'cordoba':              { 'text': "Córdoba", 'text2': "Montería, Población: 1.709.603", 'label_offset_x': 140, 'label_offset_y': -50, 'label_hover_offset_x': -700, 'label_hover_offset_y': -120},	
            'sucre':                { 'text': "Sucre", 'text2': "Sincelejo, Población: 851.526", 'label_offset_x': -30, 'label_offset_y': -10, 'label_hover_offset_x': -700, 'label_hover_offset_y': -60 },	
            'atlantico':            { 'text': "Atlántico", 'text2': "Barranquilla, Población: 2.461.001", 'label_offset_x': -10, 'label_offset_y': 0, 'label_hover_offset_x': -700, 'label_hover_offset_y': -50 },
            'magdalena':            { 'text': "Magdalena", 'text2': "Santa Marta, Población: 1.259.667", 'label_offset_x': -50, 'label_offset_y': -80, 'label_hover_offset_x': -800, 'label_hover_offset_y': -40 },	
            'cesar':                { 'text': "Cesar", 'text2': "Valledupar, Población: 4.613.377", 'label_offset_x': -195, 'label_offset_y': 200, 'label_hover_offset_x': 280, 'label_hover_offset_y': 30 },	
            'la-guajira':           { 'text': "La Guajira", 'text2': "Riohacha, Población: 957.814", 'label_offset_x': 100, 'label_offset_y': -20, 'label_hover_offset_x': 200, 'label_hover_offset_y': 80 },	
            'bolivar':              { 'text': "Bolívar", 'text2': "Cartagena de Indias, Población: 2.097.086", 'label_offset_x': 80, 'label_offset_y': 80, 'label_hover_offset_x': -800, 'label_hover_offset_y': -400 },	
            'norte-de-santander':   { 'text': "Norte de Santander", 'text2': "Cúcuta, Población: 1.355.723", 'label_offset_x': 80, 'label_offset_y': 0, 'label_hover_offset_x': 260, 'label_hover_offset_y': -150 },	
            'choco':                { 'text': "Chocó", 'text2': "Quibdó, Población: 500,076", 'label_offset_x': -180, 'label_offset_y': 140, 'label_hover_offset_x': -600, 'label_hover_offset_y': -500 },	
            'risaralda':            { 'text': "RIS", 'text2': "Pereira, Población: 500.076", 'label_offset_x': 30, 'label_offset_y': 60, 'label_hover_offset_x': -800, 'label_hover_offset_y': -80 },	
            'tolima':               { 'text': "Tolima", 'text2':"Ibagué, Población: 1.408.274", 'label_offset_x': 0, 'label_offset_y': 50, 'label_hover_offset_x': -800, 'label_hover_offset_y': -120 },	
            'quindio':              { 'text': "QUI", 'text2': "Armenia, Población: 565.266", 'label_offset_x': 30, 'label_offset_y': 20, 'label_hover_offset_x': -820, 'label_hover_offset_y': -60 },	
            'cundinamarca':         { 'text': "CUN", 'text2': "Bogotá, Población: 2.680.041", 'label_offset_x': -20, 'label_offset_y': -20, 'label_hover_offset_x': -900, 'label_hover_offset_y': -120 },	
            'santander':            { 'text': "Santander", 'text2': "Bucaramanga, Población: 2,061,095", 'label_offset_x': 0, 'label_offset_y': 50, 'label_hover_offset_x': 450, 'label_hover_offset_y': -110 },	
            'arauca':               { 'text': "Arauca", 'text2': "Arauca, Población: 262.315", 'label_offset_x': 0, 'label_offset_y': 0, 'label_hover_offset_x': 300, 'label_hover_offset_y': -100 },	
            'boyaca':               { 'text': "BOY", 'text2': "Tunja, Población: 1,276,367", 'label_offset_x': 50, 'label_offset_y': 40, 'label_hover_offset_x': 450, 'label_hover_offset_y': -220},	
            'casanare':             { 'text': "Casanare", 'text2': "Yopal, Población: 356.438", 'label_offset_x': -30, 'label_offset_y': 20, 'label_hover_offset_x': 500, 'label_hover_offset_y': -200 },	
            'bogota':               { 'text': "DC", 'text2': "Bogotá, Población: 7.980.001", 'label_offset_x': 20, 'label_offset_y': 0, 'label_hover_offset_x': 900, 'label_hover_offset_y': 0 },	
            'nariño':               { 'text': "Nariño", 'text2': "Pasto, Población: 1.744.275", 'label_offset_x': 0, 'label_offset_y': 0, 'label_hover_offset_x': -550, 'label_hover_offset_y': 200 },	
            'cauca':                { 'text': "Cauca", 'text2': "Popayán, Población: 4.613.377", 'label_offset_x': 0, 'label_offset_y': -40, 'label_hover_offset_x': -600, 'label_hover_offset_y': -50 },	
            'huila':                { 'text': "Huila", 'text2': "Neiva, Población: 1.154.804", 'label_offset_x': 20, 'label_offset_y': 0, 'label_hover_offset_x': -820, 'label_hover_offset_y': -50 },	
            'caqueta':              { 'text': "Caquetá", 'text2': "Florencia, Población: 477.619", 'label_offset_x': -20, 'label_offset_y': 90, 'label_hover_offset_x': 670, 'label_hover_offset_y': 60 },	
            'amazonas':             { 'text': "Amazonas", 'text2': "Leticia, Población: 76.243", 'label_offset_x': 0, 'label_offset_y': -50, 'label_hover_offset_x': 550, 'label_hover_offset_y': -150 },	
            'vaupes':               { 'text': "Vaupés", 'text2': "Mitú, Población: 43.665", 'label_offset_x': -30, 'label_offset_y': -10, 'label_hover_offset_x': 350, 'label_hover_offset_y': 100 },	
            'vichada':              { 'text': "Vichada", 'text2': "Puerto Carreño, Población: 71.974", 'label_offset_x': 0, 'label_offset_y': 0, 'label_hover_offset_x': 250, 'label_hover_offset_y': -350 },	
            'guainia':              { 'text': "Guainía", 'text2': "Inírida, Población: 41.482", 'label_offset_x': 0, 'label_offset_y': 0, 'label_hover_offset_x': 350, 'label_hover_offset_y': -300 },	
            'meta':                 { 'text': "Meta", 'text2': "Villavicencio, Población: 961.292", 'label_offset_x': 0, 'label_offset_y': 0, 'label_hover_offset_x': 800, 'label_hover_offset_y': -100 },	
            'guaviare':             { 'text': "Guaviare", 'text2': "San José del Guaviare, Población: 111.060", 'label_offset_x': 0, 'label_offset_y': 0, 'label_hover_offset_x': 600, 'label_hover_offset_y': 130 },	
			
	};

	Snap.plugin( function( Snap, Element, Paper, global ) {
		Element.prototype.addTransform = function( t ) {
			return this.transform( this.transform().localMatrix.toTransformString() + t );
		};
	});

	Snap.load("assets/colombia_departments.svg", function (f) {

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

                if (weakOverlays != null) weakOverlays.animate( { 'opacity': '0.4' }, 200, mina.easeout );

                var $lastChild = $('#regions').children().last();
                var lastSnapObject = s.select( '#'+$lastChild.attr('id') );
                lastSnapObject.after(this);

                /* regions labels */
                var	label_hover_x = 0, label_hover_y = 0;

                if ( typeof regionsMetadata[ this.attr('id') ] != 'undefined') 
                {				
                    if ( typeof regionsMetadata[ this.attr('id') ]['label_hover_offset_x'] != 'undefined')
                            label_hover_x = regionsMetadata[ this.attr('id') ]['label_hover_offset_x'];

                    if ( typeof regionsMetadata[ this.attr('id') ]['label_hover_offset_y'] != 'undefined')
                            label_hover_y = regionsMetadata[ this.attr('id') ]['label_hover_offset_y'];
                    if ( typeof regionsMetadata[ this.attr('id') ]['text'] != 'undefined')
                    label_text = regionsMetadata[ this.attr('id') ]['text'];
                }
                var originalBBox 		= regions[ this.attr('id') ].originalBBox;
                var originalTransform 	= regions[ this.attr('id') ].originalTransform; 
                var that = this;

                that.attr({ filter: shadow }).animate( { transform: "s1.6,1.6,"+originalBBox.cx+","+originalBBox.cy }, 600, mina.elastic );
                regions[ this.attr('id') ].snapLabel.node.innerHTML=regionsMetadata[ this.attr('id') ]['text2'];
                regions[ this.attr('id') ].snapLabel.animate( { 'opacity': '1' }, 300, mina.easeout );
                regions[ this.attr('id') ].snapLabel.addTransform('t'+label_hover_x+','+label_hover_y).addTransform('s1.6,1.6');
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
            if ( nActiveBounds > 0 )
            { 
                for (var region in activeBounds) {
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
                    if ( typeof regionsMetadata[ this.attr('id') ]['text'] != 'undefined')
                        label_text = regionsMetadata[ this.attr('id') ]['text'];
                }
                var originalBBox 		= regions[ this.attr('id') ].originalBBox;
                var originalTransform 	= regions[ this.attr('id') ].originalTransform; 

                this.animate({ transform: "s1,1,"+originalBBox.cx+","+originalBBox.cy }, 700, mina.elastic).attr({ filter: noShadow });
                regions[ this.attr('id') ].snapLabel.animate( { 'opacity': '0.8' }, 300, mina.easeout );
                regions[ this.attr('id') ].snapLabel.addTransform('s0.625,0.625').addTransform('t'+label_hover_x+','+label_hover_y);
                regions[ this.attr('id') ].snapLabel.node.innerHTML=regionsMetadata[ this.attr('id') ]['text'];
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

            var regionURL = defaultRegionURL, target = '_self'; 

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
        var	elemRegions		= $('#regions').children(),
                regions			= {};

        s.mouseout( function(event) {
                mouseOutSVG(event);
        } );

        var regionBBox;

        for ( var i = 0; i < elemRegions.length; i++ ) {
            
            regions[ elemRegions[i].id ] = {};
            regions[ elemRegions[i].id ].id = elemRegions[i].id;
            var regionId = regions[ elemRegions[i].id ].id;
            regions[ elemRegions[i].id ].snapObject = s.select( '#'+elemRegions[i].id );
            regions[ elemRegions[i].id ].pathLength = Snap.path.getTotalLength( regions[ elemRegions[i].id ].snapObject );
            regions[ elemRegions[i].id ].originalBBox = regions[ elemRegions[i].id ].snapObject.getBBox();
            regions[ elemRegions[i].id ].originalTransform = regions[ elemRegions[i].id ].snapObject.transform();

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
//					label_text = "Hola";

                if ( typeof regionsMetadata[ elemRegions[i].id ]['rotation'] != 'undefined')
                    label_rotation = regionsMetadata[ elemRegions[i].id ]['rotation'];
            }
            var label 		= s.text(label_x, label_y, label_text);
            var labelBBox 	= label.getBBox();
            label.transform('t-'+labelBBox.width/2+',-'+ labelBBox.height/2 +' r' + label_rotation );
            label.attr({ 'pointer-events': 'none' });
            regions[ elemRegions[i].id ].snapLabel = label;
            regions[ elemRegions[i].id ].snapLabel.attr({'font-size': '40px', 'opacity': '0.8'});
            regions[ elemRegions[i].id ].snapLabelTransform = regions[ elemRegions[i].id ].snapLabel.transform();
        }
        /* /End Main callback code for Snap.load ************************************************************************/
    });
};

