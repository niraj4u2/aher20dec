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
			//this.dropTables('users');
			//this.selectLogin();
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
		},dataSelectHandler: function( transaction, results ) {
		//	alert(results.rows.length); return false;
		    if (results.rows.length > 0) {
				 window.location.href = "http://localhost/aherapp/index.html";	
				}
				
				
				}, 
		  selectLogin: function() {
	    	var that = this;
			DEMODB.transaction(
			    function (transaction) {
			        transaction.executeSql("SELECT * FROM users;", [], that.dataSelectHandler, that.errorHandler);
			    }
			);			    
	    },
	    dropTables: function(table_name) {
			var that = this;
			DEMODB.transaction(
			    function (transaction) {
			    	transaction.executeSql("DROP TABLE "+table_name+";", [], that.nullDataHandler, that.errorHandler);
			    }
			);
			console.log("Table 'page_settings' has been dropped.");
			//location.reload();			
		}
		
	};

 	//Instantiate Demo
 	localDBDemo.init();
	
});	

