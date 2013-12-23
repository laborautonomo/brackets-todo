/* global brackets, define */

define( function( require, exports, module ) {
	'use strict';
	
	// Get dependencies.
	var StringUtils = brackets.getModule( 'utils/StringUtils' ),
		
		// Variables.
		expression,
		done = /^\[x\]/i;
	
	/**
	 * Pass file to parsing function.
	 */
	function parseFile( currentDocument, todos ) {
		var documentTodos = [],
			index = -1,
			fileToMatch,
			text;
		
		if ( currentDocument !== null && typeof( currentDocument ) !== 'string' ) {
			// Get information about current file.
			fileToMatch = currentDocument.file.fullPath;
			text = currentDocument.getText();
			
			// Parse document.
			documentTodos = parseText( text, StringUtils.getLines( text ) );
			
			// Check if file has already been added to array.
			for ( var i = 0, length = todos.length; i < length; i++ ) {
				if ( todos[ i ].path == fileToMatch ) {
					// File found in array, store index.
					index = i;
					break;
				}
			}
			
			// Add file to array if any comments is found.
			if ( documentTodos.length > 0 ) {
				// Create object for new entry in array if none found.
				if ( index == -1 ) {
					todos.push( {} );
					index = length;
				}
				
				// Get any matches and merge with previously found comments.
				todos[ i ].path = currentDocument.file.fullPath;
				todos[ i ].file = currentDocument.file.fullPath.replace( /^.*[\\\/]/ , '' );
				todos[ i ].todos = documentTodos;
			} else if ( index > -1 ) {
				todos.splice( i, 1 );
			}
		}
		
		return todos;
	}
	
	/**
	 * Go through text and search for matches.
	 */
	function parseText( text, lines ) {
		var matchArray,
			documentTodos = [];
		
		// Go through each match in current document.
		while ( ( matchArray = expression.exec( text ) ) !== null ) {
			// Add match to array.
			documentTodos.push( {
				todo: matchArray[ 2 ].replace( done, '' ),
				tag: matchArray[ 1 ].replace( ' ', '' ).toLowerCase(),
				line: StringUtils.offsetToLineNum( lines, matchArray.index ) + 1,
				char: matchArray.index - text.lastIndexOf( '\n' , matchArray.index ) - 1,
				done: done.test( matchArray[ 2 ] )
			} );
		}
		
		// Return found comments.
		return documentTodos;
	}
	
	/**
	 * Get the regular epression to use in parsing.
	 */
	function getExpression() {
		return expression;
	}
	
	/**
	 * Set the regular epression to use in parsing.
	 */
	function setExpression( newExpression ) {
		expression = newExpression;
	}
	
	// Make variables accessible.
	exports.getExpression = getExpression;
	exports.setExpression = setExpression;
	exports.parseFile = parseFile;
	exports.parseText = parseText;
} );