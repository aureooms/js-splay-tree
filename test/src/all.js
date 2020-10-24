import test from 'ava' ;

import * as compare from "@aureooms/js-compare" ;
import * as random from "@aureooms/js-random" ;
import * as it from "@aureooms/js-itertools" ;
import fn from "@aureooms/js-functools" ;

import bst from '../../src' ;

/**
 * tests the following methods
 *
 * bst.insert( value )
 * bst.in_order_traversal( cb ( value ) { ... } )
 * bst.find( value )
 * bst.remove( value )
 */

function all ( BSTname, BST, diffname, diff, n ) {

	const title = `binary search tree (${BSTname}, ${diffname}, ${n})`;

	test( title, t => {

		var bst, a, b, c, d, e, half, i, x, remove;

		const Tree = BST( diff );
		bst = new Tree();

		a = [];
		i = n;

		while ( i-- ) {
			x = Math.random();
			bst.insert( x );
			a.push( x );
		}

		a.sort( diff );

		b = [];
		c = [];
		half = Math.floor( n / 2 );

		// CHECK CONTENT
		bst.in_order_traversal( function ( v ) { b.push( v ); } );
		t.deepEqual(b, a, "check content");


		// PREPARE FOR CHECKING PURPOSES
		i = n;
		while ( i-- ) {
			a[i] = [true, a[i]];
		}


		// CHECK FIND SORTED
		i = n;
		while ( i-- ) {
			b[i] = bst.find( a[i][1] );
		}
		t.deepEqual( b, a, "check find sorted" );

		// CHECK FIND SHUFFLED
		random.shuffle( a, 0, n );
		i = n;
		while ( i-- ) {
			b[i] = bst.find( a[i][1] );
		}
		t.deepEqual( b, a, "check find shuffled" );


		remove = function(l, r, p, q, txt){

			// REMOVE

			i = r;
			while ( i --> l ) {
				bst.remove( a[i][1] );
				a[i][0] = false;
			}


			// CHECK CONTENT AFTER REMOVE

			d = [];
			e = [];
			for ( i = p ; i < q ; ++i ) {
				e.push( a[i][1] );
			}

			e.sort( diff );
			bst.in_order_traversal( function ( v ) { d.push(v); } );
			t.deepEqual( d, e, "check content " + txt );


			// CHECK FIND AFTER REMOVE

			i = n;
			while ( i-- ) {
				b[i] = bst.find(a[i][1])[0];
				c[i] = a[i][0];
			}

			t.deepEqual( b, c, "check find " + txt );


			// TRY REMOVING TWICE

			i = r;
			while ( i --> l ) {
				bst.remove(a[i][1]);
			}

		};

		remove( half, n, 0, half, "after remove half" );

		// ADD NEW ELEMENTS
		i = n;
		while ( i --> half ) {
			x = Math.random();
			bst.insert( x );
			a[i] = [true, x];
		}

		// CHECK CONTENT NEW ELEMENTS

		d = [];
		e = [];
		for ( i = 0 ; i < n ; ++i ) {
			e.push( a[i][1] );
		}

		e.sort( diff );
		bst.in_order_traversal( function ( v ) { d.push(v); } );
		t.deepEqual( d, e, "check content new elements" );


		// CHECK FIND NEW ELEMENTS

		i = n;

		while ( i-- ) {
			b[i] = bst.find( a[i][1] );
		}

		t.deepEqual( b, a, "check find new elements" );


		remove( 0, half, half, n,  "after remove first half" );
		remove( half, n, 0, 0,  "after remove second half" );

	});

};



it.exhaust(
	it.starmap( all ,
		it.map( fn.compose( [ it.list , it.chain ] ) ,
			it.product( [
				[
					["__SplayTree1__", bst.__SplayTree1__],
					["__SplayTree2__", bst.__SplayTree2__],
					["__SplayTree3__", bst.__SplayTree3__],
					["__SplayTree4__", bst.__SplayTree4__],
					["__SplayTree5__", bst.__SplayTree5__],
				],

				[
					["increasing", compare.increasing],
					["decreasing", compare.decreasing]
				],

				[[1], [16], [17], [31], [32], [33], [127], [128], [129]]

				] , 1
			)
		)
	)
) ;
