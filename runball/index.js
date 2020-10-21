export default function runball( { formatter, x1, y1, x2, y2, dur = '1s', count = 1, interval = .2, toScale = 2, done = function () { } } ) {
    return new Promise( function ( resolve ) {
        var x0 = x2 - x1
        var y0 = y2 - y1
        var len = ( x0 ** 2 + y0 ** 2 ) ** .5
        // 黄金分割点的公式 b/a = (根号5 - 1)/2
        var a = ( 5 ** .5 - 1 ) / 2
        var pathPointX = 0
        var pathPointY = 0
        pathPointX = a * x0 - len * ( 1 - a ) / ( 1 + ( x0 / y0 ) ** 2 ) ** .5
        pathPointY = a * y0 - len * ( 1 - a ) / ( 1 + ( y0 / x0 ) ** 2 ) ** .5
        if ( x0 > 0 && y0 > 0 ) {
            pathPointX = a * x0 + len * ( 1 - a ) / ( 1 + ( x0 / y0 ) ** 2 ) ** .5
            pathPointY = a * y0 + len * ( 1 - a ) / ( 1 + ( y0 / x0 ) ** 2 ) ** .5
        }
        var xmlns = 'http://www.w3.org/2000/svg'
        generateRunballSvg()
        function generateRunballSvg() {
            var runballSvg = document.createElementNS( xmlns, 'svg' )
            runballSvg.classList.add( 'runball-svg' )
            runballSvg.setAttribute( 'version', '1.1' )
            runballSvg.setAttribute( 'xmlns', xmlns )
            runballSvg.setAttribute( 'xlink', 'http://www.w3.org/1999/xlink' )
            document.body.appendChild( runballSvg )
            var promises = []
            for ( let i = 0; i < count; i++ ) {
                var promise = new Promise( function ( resolve ) {
                    let begin = i * interval + 's'
                    generateSingleRunball( runballSvg, begin, resolve, i )
                } )
                promises.push( promise )
            }
            Promise.all( promises ).then( function () {
                document.body.removeChild( runballSvg )
                resolve()
            } )
        }
        function generateSingleRunball( runballSvg, begin, onend, order ) {
            var g = document.createElementNS( xmlns, 'g' )
            g.setAttribute( 'transform', `translate(${ x1 },${ y1 })` )
            g.setAttribute( 'opacity', '0' )
            runballSvg.appendChild( g )
            var opacity = document.createElementNS( xmlns, 'animate' )
            opacity.setAttribute( 'attributeName', 'opacity' )
            opacity.setAttribute( 'attributeType', 'CSS' )
            opacity.setAttribute( 'begin', begin )
            opacity.setAttribute( 'fill', 'freeze' )
            opacity.setAttribute( 'from', '0' )
            opacity.setAttribute( 'to', '1' )
            opacity.setAttribute( 'dur', '0.01s' )
            g.appendChild( opacity )
            var animateMotion = document.createElementNS( xmlns, 'animateMotion' )
            animateMotion.setAttribute( 'begin', begin )
            animateMotion.setAttribute( 'dur', dur )
            animateMotion.setAttribute( 'repeatCount', '1' )
            animateMotion.setAttribute( 'fill', 'freeze' )
            animateMotion.setAttribute( 'path', `M0,0 Q ${ pathPointX } ${ pathPointY } ${ x0 } ${ y0 }` )
            animateMotion.onend = function () {
                runballSvg.removeChild( g )
                onend()
                done( order )
            }
            g.appendChild( animateMotion )
            var animateTransform = document.createElementNS( xmlns, 'animateTransform' )
            animateTransform.setAttribute( 'attributeName', 'transform' )
            animateTransform.setAttribute( 'attributeType', 'XML' )
            animateTransform.setAttribute( 'type', 'scale' )
            animateTransform.setAttribute( 'begin', begin )
            animateTransform.setAttribute( 'fill', 'freeze' )
            animateTransform.setAttribute( 'from', 1 )
            animateTransform.setAttribute( 'to', toScale )
            animateTransform.setAttribute( 'dur', dur )
            var contents = formatter()
            contents.forEach( function ( item ) {
                g.appendChild( item )
                item.appendChild( animateTransform.cloneNode( true ) )
            } )
        }
    } )

}