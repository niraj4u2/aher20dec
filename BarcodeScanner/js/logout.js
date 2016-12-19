/*
Main JS for tutorial: "Getting Started with HTML5 Local Databases"
Written by Ben Lister (darkcrimson.com) revised May 12, 2010
Tutorial: http://blog.darkcrimson.com/2010/05/local-databases/

Licensed under the MIT License:
http://www.opensource.org/licenses/mit-license.php
*/

$(function(){ 
	
	var localDBDemo = {
		init: function () {
		 this.dropTabless();
		},
		initDatabase: function() {
			try {
			    if (!window.openDatabase) {
			        alert('Local Databases are not supported by your browser. Please use a Webkit browser for this demo');
			    } else {
			        var shortName = 'DEMODB',
			        	version = '1.0',
						displayName = 'DEMODB Test',
						maxSize = 100000; // in bytes
			            DEMODB = openDatabase(shortName, version, displayName, maxSize);
			    }
			} catch(e) {
			    if (e === 2) {
			        // Version mismatch.
			        console.log("Invalid database version.");
			    } else {
			        console.log("Unknown error "+ e +".");
			    }
			    return;
			} 
		},
		  errorHandler: function( transaction, error ) {
	    
		 	if (error.code===1){
		 		// DB Table already exists
		 	} else {
		    	// Error is a human-readable string.
			    console.log('Oops.  Error was '+error.message+' (Code '+ error.code +')');
		 	}
		    return false;		    
	    },
	    
	    nullDataHandler: function() {
		    console.log("SQL Query Succeeded");
	    },
	    dropTabless: function() {
			var that = this;
			DEMODB.transaction(
			    function (transaction) {
			    	transaction.executeSql("DROP TABLE users;", [], that.nullDataHandler, that.errorHandler);
			    	transaction.executeSql("DROP TABLE user_book;", [], that.nullDataHandler, that.errorHandler);
			    	transaction.executeSql("DROP TABLE user_book_records;", [], that.nullDataHandler, that.errorHandler);
			     	transaction.executeSql("DROP TABLE user_book;", [], that.nullDataHandler, that.errorHandler);
			    }
			);
		alert('dsfsd');
			//location.reload();			
		}
		
	};

 	//Instantiate Demo
 	localDBDemo.init();
	
});	

