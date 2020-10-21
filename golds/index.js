export default function golds( { count = 5, correct = true, img, container, leftPerson, rightPerson, extra = 10, duration = 2000, onFinished = () => { } } ) {
    var leftCount = 0
    var rightCount = 0
    var leftBoundary = 0
    var rightBoundary = 0
    if ( correct ) {
        leftCount = count
    } else {
        leftCount = Math.floor( count / 2 )
        rightCount = Math.ceil( count / 2 )
    }
    var golds = generateGold()
    golds.forEach( function ( gold, idx ) {
        var top = gold.offsetTop
        var left = gold.offsetLeft
        top = ( idx % 2 ? top : ( top + 20 ) ) + 'px'
        left += 'px'
        Object.assign( gold.style, {
            top,
            left
        } )
    } )

    golds.forEach( function ( gold ) {
        Object.assign( gold.style, {
            position: 'absolute'
        } )
    } )
    golds.forEach( function ( gold, idx ) {
        var left = gold.offsetLeft
        if ( idx === leftCount ) {
            leftBoundary = left + gold.offsetWidth - extra
        }
        if ( idx === count - rightCount - 1 ) {
            rightBoundary = left - leftPerson.offsetWidth + extra
        }
    } )
    var goldCoords = []
    golds.forEach( function ( gold, idx ) {
        var left = gold.offsetLeft
        var right = left + gold.offsetWidth
        goldCoords.push( {
            left,
            right
        } )
    } )
    leftPerson.animate( [
        { left: leftPerson.offsetLeft + 'px' },
        { left: rightBoundary + 'px' }
    ], {
        duration,
        fill: 'forwards'
    } )
    if ( !correct ) {
        rightPerson.animate( [
            { left: rightPerson.offsetLeft + 'px' },
            { left: leftBoundary + 'px' }
        ], {
            duration,
            fill: 'forwards'
        } )
    }
    var moveT = setInterval( () => {
        move()
    }, 100 );
    function move() {
        var personLeftCoord = leftPerson.offsetLeft + leftPerson.offsetWidth
        var personRightCoord = rightPerson.offsetLeft
        for ( var i = 0; i < goldCoords.length; i++ ) {
            var { left, right } = goldCoords[ i ]
            if ( personLeftCoord >= left || personRightCoord <= right ) {
                let gold = golds[ i ]
                if ( personLeftCoord >= left ) {
                    generateIncrement( gold )
                }
                gold.remove()
                goldCoords.splice( i, 1 )
                golds.splice( i, 1 )
                i--
            }
        }
        if ( !golds.length ) {
            clearInterval( moveT )
            onFinished()
        }
    }
    function generateGold() {
        var golds = []
        for ( var i = 0; i < count; i++ ) {
            var gold = document.createElement( 'img' )
            gold.src = img
            gold.classList.add( 'gold' )
            container.appendChild( gold )
            golds.push( gold )
        }
        return golds
    }
    function generateIncrement( gold ) {
        var { offsetLeft, offsetWidth, offsetTop } = gold
        var increment = document.createElement( 'span' )
        increment.classList.add( 'gold-increment' )
        increment.innerHTML = '+1'
        increment.addEventListener('animationend',function(){
            increment.remove()
        })
        gold.insertAdjacentElement( 'afterend', increment )
        Object.assign( increment.style, {
            left: offsetLeft + offsetWidth / 2 - increment.offsetWidth / 2 + 'px',
            top: offsetTop - increment.offsetHeight + 'px'
        } )
    }
}