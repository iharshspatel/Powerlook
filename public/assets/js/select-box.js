/** GLOBAL OBJECT **/
var sel = {
	addClass      : function( elem, name ){
		var classes = elem.className.split( ' ' ),
			cIndex  = classes.indexOf( name );
		if( cIndex === -1 ){
			classes.push( name );
		}
		elem.className = classes.join( ' ' );
		return this;
	},	// END addClass
	
	removeClass   : function( elem, name ){
		var classes = elem.className.split( ' ' ),
			cIndex  = undefined;
		function recursive(){
			// use a recursive function to remove all instances
			// of the class name
			cIndex = classes.indexOf( name );
			if( cIndex >= 0 ){
				classes.splice( cIndex, 1 );
				recursive();
			}
		}
		recursive();
		elem.className = classes.join( ' ' );
		return this;
	},	// END removeClass

	hasClass      : function( elem, name ){
		var classes = elem.className.split( ' ' ),
			cIndex  = classes.indexOf( name );
		if( cIndex >= 0 ){
			return true;
		}else{
			return false;
		}
	}, 	// END hasClass

	selectCreate : function( select, label ){

		var _this = this;
			id    = '_' + select.id,
			input = document.createElement( 'input' ),
			div   = document.createElement( 'div' ),
			ul    = document.createElement( 'ul' ),
			val   = { value : select.value ,
					  text  : select.options[select.selectedIndex].text };

		select.style.display = 'none';

		ul.id = 'ul' + id;
		ul.className = 'ddown-list';
		ul.setAttribute( 'aria-live', 'polite' );

		input.setAttribute( 'type', 'text' );
		input.setAttribute( 'aria-autocomplete', 'list' );
		input.setAttribute( 'aria-haspopup', 'true' );
		input.setAttribute( 'aria-owns', ul.id );
		input.className = 'dynamic-dropdown';
		input.id = id;

		if( select.getAttribute( 'data-required' ) === 'true' ){
			input.setAttribute( 'required', 'true' );
		}
		
		label.setAttribute( 'for', id );

		div.className = 'selectRegion';

		div.appendChild( label );
		div.appendChild( input );
		div.appendChild(   ul  );

		select.parentNode.insertBefore( div, select );

		input.value = val.text;

		if( input.value !== '' ){
			this.addClass( label, 'active'  );
		}else{
			this.addClass( label, 'inactive' );
		}

		input.addEventListener( 'focus', function(){
			_this.addClass(    label, 'active'     )
				 .addClass(    label, 'transition' )
				 .removeClass( label, 'inactive'   );
				 $('.border-effect').addClass('active');
			if( this.setSelectionRange ){
				this.setSelectionRange(0, this.value.length);
			}
			populateList(  this, select, document.getElementById( 'ul' + this.id ), -1, true );
		});	// END focus
		input.addEventListener( 'blur', function(){
			var input = this;
			setTimeout( function(){
				if( input.value === '' ){
					_this.addClass(    label, 'inactive'   )
						 .addClass(    label, 'transition' )
						 .removeClass( label, 'active'     );
				}else{
					var list     = getList( input.value, select, false );
					select.value = list.value[0];
					input.value  = list.text[0];
				}
				document.getElementById( 'ul' + input.id ).innerHTML = '';
			}, 250 );
		});	// END blur
		input.addEventListener( 'keyup', function(e){
			var list  = document.getElementById( 'ul' + this.id ).getElementsByTagName( 'li' ),
				index = -1,
				kC    = e.keyCode;
			for( var i=0, x=list.length; i<x; i++ ){
				if( _this.hasClass( list[i], 'active' ) ){
					index = i;
					break;
				}
			}
			if( kC !== 9 && kC !== 16 ){	// SHIFT && TAB	
				if( kC === 13 ){   // ENTER
					var list     = getList( this.value, select, false );
					select.value = list.value[index];
					this.value   = list.text[index];
					document.getElementById( 'ul' + this.id ).innerHTML = '';
				}else{
					switch( kC ){
						case 38: 	// ARROW UP
							index--;
							if( index < 0 ){ index = 0; }
							break;
						case 40: 	// ARROW DOWN
							index++;
							if( index >= list.length ){ index = list.length - 1; }
							break;
						default:
							index = -1;
							break;
					}
					populateList(  this, select, document.getElementById( 'ul' + this.id ), index, false );
				}
			}
		});	// END keyup

		function populateList( input, select, target, index, focus ){
			var list    = getList( input.value, select, focus ),
				counter = 0,
				output;
			if( focus ){
				index = select.selectedIndex - 1;
			}
			target.innerHTML = '';
			for( var i=0, x=list.value.length; i<x; i++ ){
				output = document.createElement( 'li' );
				if( counter === index ){
					output.className = 'active';
				}
				output.appendChild( document.createTextNode( list.text[i] ) );
				output.addEventListener( 'click', function(){
					console.log( 'test' );
					input.value = this.innerHTML;
				});
				target.appendChild( output );
				counter++;
			}
			if( index >= 0 ){
				var lis  = target.getElementsByTagName( 'li' ),
					sTop = 0;
				for( var i=0, x=lis.length; i<x; i++ ){
					if( i >= index ){ break; }
					sTop += lis[i].clientHeight;
				}
				target.scrollTop = sTop;
			}
			
		}	// END populateList

		function getList( val, list, focus ){
			var value   = [],
				text    = [],
				vLength = val.length;
			if( focus ){ 
				vLength = 0;
				val     = '';
			}
			for( var i=0, x=list.length; i<x; i++ ){
				if( list[i].text !== '' && 
				  ( list[i].text.toUpperCase().substring(  0, vLength ) === val.toUpperCase() ||
					list[i].value.toUpperCase().substring( 0, vLength ) === val.toUpperCase() ) ){
					value.push( list[i].value );
					text.push( list[i].text  );
				}
			}
			return { value: value, text: text };
		}	// END function getList

	},	// END selectCreate()

};	// END $

window.onload = function(){
	var labels = document.getElementsByClassName( 'select-label' ),
		id     = '',
		label  = undefined,
		input  = undefined,
		type   = undefined;

	for( var i=0, x=labels.length; i<x; i++ ){
		label = labels[i];
		id    = label.getAttribute( 'for' ) || '';
		input = document.getElementById( id );
		type  = input.getAttribute( 'type' ) || input.tagName;
		type  = type.toLowerCase();
		if( input && ( type === 'select' ) ){
			sel.selectCreate( input, label );
		}// END if( input && select )
	}// END for( labels )


}();
