/*
This js is used for store on localStorage
*/
function getAbsolutePath() {
    var loc = window.location;
    var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
    return loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
}
function getpagename(){
	var URL = window.location.pathname; // Gets page name
	return URL.substring(URL.lastIndexOf('/') + 1); 
}
function handleClick(cb){
	if(cb.checked == true){
		checked =1
	}else{
		checked =0
	}
	 $.ajax({
		url:BaseUrl+"save_userbook_check_status",
		type: 'get',
		data: {
			user_book_id: cb.value, 
			checked: checked
		  },
		success: function(data) {
			updatelocalbook(cb.value,checked);
			alert('successfully updated');
		},
		error: function(data) {
		    $('#'+cb.id).prop('checked', false);
			alert('Please check your internet connection ');
		}
	});
}

  $(document).ready(function(){
		var submitIcon = $('.searchbox-icon');
		var inputBox = $('.searchbox-input');
		var searchBox = $('.searchbox');
		var isOpen = false;
		submitIcon.click(function(){
			if(isOpen == false){
				searchBox.addClass('searchbox-open');
				inputBox.focus();
				isOpen = true;
			} else {
				searchBox.removeClass('searchbox-open');
				inputBox.focusout();
				isOpen = false;
			}
		});  
		 submitIcon.mouseup(function(){
				return false;
			});
		searchBox.mouseup(function(){
				return false;
			});
		$(document).mouseup(function(){
				if(isOpen == true){
					$('.searchbox-icon').css('display','block');
					submitIcon.click();
				}
			});
	});
		function buttonUp(){
			var inputVal = $('.searchbox-input').val();
			inputVal = $.trim(inputVal).length;
			if( inputVal !== 0){
				$('.searchbox-icon').css('display','none');
			} else {
				$('.searchbox-input').val('');
				$('.searchbox-icon').css('display','block');
			}
		}
		
function updatelocalbook(id=null,checked=null){
	var user_books = JSON.parse(localStorage["user_book_record"]);
	 for(var i=0; i<user_books.length; i++){
		      if(user_books[i].id == id){
                user_books[i].check_status = checked;
              }
            }     
	localStorage["user_book_record"] = JSON.stringify(user_books);
}
$(function(){ 
	$('#logout').on('click', function(){ 
		clear: localStorage.clear(); 
		window.location.href = getAbsolutePath()+"login.html";
	});
	 
	var LocalDb = {
		
		init: function () {
			/*if(localStorage["user_data"] == undefined){
				
			}*/
			
			var page =getpagename();
			var Skip_Page = ["login.html","register.html" ]; 
			//check login if not page is login
			if(jQuery.inArray(page, Skip_Page )<0){
				 LocalDb.CheckDb();
				
			}
			if(page =='login.html'){
				 
				var registration = LocalDb.getParameterByName('registration');
				if(registration){
					$('#flash_message').html('<div class="alert alert-success"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>You have been successfully Register in.</div>');
				//	LocalDb.LoadBookGroomHeader(book_id);
				}
			}
			 $('.loginForm').submit(function(){
				 // clear error msg data 
				LocalDb.resetErrors();
				$('#loader').css('display','block'); 
				var data = $(this).serializeArray();
				var formData = $(this);
				var status = 0;
				$.ajax({
					url:BaseUrl+"user_login",
					async: false,
					data: data,
					dataType:'json', 
					type:'post',
					success: function(data) {
						if(data.status==1){
							if(data.content.user_data != ""){
								LocalDb.iniDataBase(data.content);						
								$('#loader').css('display','none'); 
								$('#flash_message').html('<div class="alert alert-success"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>You have been successfully logged in.</div>');
								window.location.href = "index.html";
							}else{
								$('#flash_message').html('<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>Server down</div>');
							}
							
						}else if(data.status==0){
							if(jQuery.type(data.message)=='string'){
								$('#flash_message').html('<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+data.message+'</div>');
							}else{
								$.each(data.message,function(field_name,msg){
									var msg_data = '<label class="error" for="'+field_name+'">'+msg+'</label>';
									$('input[name="' + field_name + '"], select[name="' + field_name + '"]').addClass('inputTxtError').after(msg_data);
						
								});	
							}
								$('#loader').css('display','none'); 
						}else{
								$('#flash_message').html('<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>Server down</div>');
								$('#loader').css('display','none');
							} 
			   
				},
				error: function(jqXHR, textStatus, errorThrown) {
					alert('status code: '+jqXHR.status+'errorThrown: ' + errorThrown + 'jqXHR.responseText:'+jqXHR.responseText );
			}

		});
		 
	   return false;
				 
				 
				 
				 
			 });
			   // change user book event
			   
			   // this code is used for index.html/qrcode
				$('#MyAherBook').on('change', function(e){ 
				$("#Aher_Sur_Name").html('<option value="">Select Sur Name</option>');
				$("#MyAherBookVillage").html('<option value="">Select Village</option>');
				$("#MyAherBookuserSurname").html('<option value="">Select Name</option>');
				$('#Couple_name').html('');
				$('#date').html('');
				LocalDb.LoadVillage($(this).val());
			});
			
			// load surname according to 
			 $('#MyAherBookVillage').on('change', function(e){ 
				$("#Aher_Sur_Name").html('<option value="">Select Sur Name</option>');
				$("#MyAherBookuserSurname").html('<option value="">Select Name</option>');
				LocalDb.Loadsurname($(this).val());
			});
			// load book usernameusername
			$('#Aher_Sur_Name').on('change', function(e){ 
				$("#MyAherBookuserSurname").html('<option value="">Select Name</option>');
				var village_name =$('#MyAherBookVillage').val();
				LocalDb.LoadBookUserName($(this).val(),village_name);
			});
			 
		},
		
		
		iniDataBase: function (data) {
			localStorage["user_data"] = JSON.stringify(data.user_data);
			localStorage["user_books"] = JSON.stringify(data.user_books);
			localStorage["user_book_record"] = JSON.stringify(data.user_book_record);
			localStorage["user_advt"] = JSON.stringify(data.user_advt);
			
		},
		CheckDb: function () {			
			LocalDb.SetUserProfile();
			LocalDb.LoadAdvt();
			LocalDb.LoadBook();
			var page =getpagename();
			 
			if(page =='booklist.html'){
				LocalDb.LoadBookByName();
				var book_id = LocalDb.getParameterByName('book_id');
				if(book_id){
					
					LocalDb.LoadBookGroomHeader(book_id);
				}
			}
			if(page =='qrdetail.html'){
				 
				var book_id = LocalDb.getParameterByName('book_id');
				if(book_id){
					LocalDb.LoadBookGroomHeader(book_id);
				}
			}
			
			 
		},
		SetUserProfile: function () {
			if(localStorage["user_data"] == undefined){
				window.location.href = getAbsolutePath()+"login.html";exit();
			}
			var localUserData = JSON.parse(localStorage["user_data"]);
			$( "#profile_name" ).html('Hi, '+localUserData.first_name);
			if(localUserData.image){
				$( ".left_profile" ).append('<img class="ra-avatar img-responsive" src="'+localUserData.image+'" >');
			}
		},
		LoadAdvt: function () {
			var ads_class = [ "move-left", "selected", "move-right"];
			var localAdvtData = JSON.parse(localStorage["user_advt"]);
			 var i =0; 
			 $.each(localAdvtData, function(index, value ) {
				var current_class =(ads_class[i])?ads_class[i] :'';
				i++;
				$( "#adsbanner" ).append('<li class="'+current_class+'"><section class="adsBox"><figure><img src="'+value.image+'" alt=""></figure><h4>'+value.advt_title+'</h4><p>'+value.advt_description+'</p><a href="advt_details.html?id='+value.id+'"><button class="k-button k-primary">READ MORE</button></a></section></li>' );
			});			 
		},
		LoadBook: function () {
			var localBookData = JSON.parse(localStorage["user_books"]);
			$.each(localBookData, function(index, value ) {
					$("#MyAherBook").append('<option value="'+value.id+'">'+value.book_name+'</option>');
				});

		},
		LoadBookprofile: function (book_id =null ) {
			var localBookData = JSON.parse(localStorage["user_books"]);
			 
			$.each(localBookData, function(index, value ) {
					if(value.id== book_id)
					$( "#MyAherBookImage" ).html('<img class="ra-avatar img-responsive" src="'+value.couple_image+'" >');
				}); 

		},
		LoadBookGroomHeader: function (book_id =null ) {
			var localBookData = JSON.parse(localStorage["user_books"]);			 
			$.each(localBookData, function(index, value ) {
					if(value.id== book_id){
						$( "#MyAherBookImage" ).html('<img class="ra-avatar img-responsive" src="'+value.couple_image+'" >');
						$( "#MyAherBookImage" ).html('<img class="ra-avatar img-responsive" src="'+value.couple_image+'" >');
						$( "#date" ).html(' '+value.event_date_formate);
						// $( "#time" ).html(' '+row['event_time']);
						$( "#address" ).html(' '+value.home_address);
						$( "#venue_address" ).html(' '+value.location_address);
						$( "#message" ).html(' '+value.message);
						$( ".span_groom_name" ).html(' '+value.groom_name);
						$( ".span_bride_name" ).html(' '+value.bride_name);
						$('#groom_image').attr('src',value.groom_image);
						$('#bride_image').attr('src',value.bride_image);
						$('#qr_book_id').val(value.id);
					}
					
				}); 

		},
		LoadVillage: function (book_id=null) {	
			$("#MyAherBookVillage").html('<option value ="" >Select Village</option>');
			$("#MyAherBookVillage").css('display','block');
			if(book_id){
				 // change profile image 
				 
				 LocalDb.LoadBookprofile(book_id);
				 
				var villages = [];
				var user_books = JSON.parse(localStorage["user_book_record"]);
				$.each(user_books, function(index, value) {
					if(value.user_book_id == book_id){
						 villages.push(value.villege);
					}
				});
				if(villages){
					 var SortedVillage = $.unique(villages.sort()).sort();
					 $.each(SortedVillage, function(index, village) {
						 $("#MyAherBookVillage").append('<option value="'+village+'">'+village+'</option>');
					 })
				}
			}
		},
		Loadsurname: function (village_name=null) {
			$("#Aher_Sur_Name").html('<option value ="" >Select Sur Name</option>');
			$("#Aher_Sur_Name").css('display','block');
			if(village_name){
				var sur_names = [];
				var user_books = JSON.parse(localStorage["user_book_record"]);
				$.each(user_books, function(index, value) {
					if(value.villege == village_name){
						 sur_names.push(value.sur_name);
					}
				});
				if(sur_names){
					 var SortedSurName = $.unique(sur_names.sort()).sort();
					 $.each(SortedSurName, function(index, sur_name) {
						 $("#Aher_Sur_Name").append('<option value="'+sur_name+'">'+sur_name+'</option>');
					 })
				}
			}
		},
		LoadBookUserName: function (sur_name = null,village_name = null) {
			$("#MyAherBookuserSurname").html('<option value ="" >Select Name</option>');
			$("#MyAherBookuserSurname").css('display','block');
			if(sur_name){
				var user_names = [];
				var user_books = JSON.parse(localStorage["user_book_record"]);
				$.each(user_books, function(index, value) {
					if(value.sur_name == sur_name && value.villege == village_name){
						 user_names.push(value.name+' '+value.father_name+' '+value.sur_name );
					}
				});
				if(user_names){
					 var SortedUserName = $.unique(user_names.sort()).sort();
					 $.each(SortedUserName, function(index, username) {
						 $("#MyAherBookuserSurname").append('<option value="'+username+'">'+username+'</option>');
					 })
				}
			}
		},
		
		resetErrors: function () {
			$('form input, form select').removeClass('inputTxtError');
			$('#flash_message').html('');
			$('label.error').remove();
		},
		LoadBookByName: function () {
			var book_record_name = LocalDb.getParameterByName('book_record_name');
			arr = book_record_name.split(" ");
			var user_namesList =   {};
			var user_books = JSON.parse(localStorage["user_book_record"]);
				$.each(user_books, function(index, value) {
					 
					if(value.name == arr[0] && value.father_name == arr[1] && value.sur_name == arr[2] ){
						 //UserList[value.id] = value.name+' '+value.father_name+' '+value.sur_name;
						 user_namesList[value.id] = value;
					}
				});
				 
				 if(user_namesList){
					 $.each(user_namesList, function(index, username) {
						 var gifttype ='';
						 if(username.gift_type==1){
							gifttype ='Money';
						 }else if(username.gift_type==2){
							 gifttype ='Gold';
						 }else{
							 gifttype ='Gift';
						 }
						 var checked='';
						 if(username.check_status==1){
							 checked='checked'
						 }
						 
						 $("#giftlist").append('<div class="whiteBox qrcodePart aherCheck mb20 p0"><div class="media"><div class="media-left"><h3 class="ra-first-name">'+username.name+' '+username.sur_name+' '+username.father_name+'</h3>	</div><div class="media-body"><h3 class="ra-first-name">'+gifttype+'</h3> Aher : '+username.amount+username.gift_name+username.gold_name+'</div><div class="media-right"><input type="checkbox" id="eq'+username.id+'" value ="'+username.id+'" onclick="handleClick(this); "class="k-checkbox" '+checked+' ><label class="k-checkbox-label" for="eq'+username.id+'">&nbsp;</label></div></div></div>'); 
					})
				}
				 
				 
				 
			 
		},
		reset: function () {
			 localStorage["UserData"] = JSON.stringify('[]');
			 localStorage["UserData"] = JSON.stringify(testData);
			 localStorage["UserData"] = JSON.stringify(testData);
		},
		getParameterByName: function (name=null) {
		if(name){
				url = window.location.href;
				name = name.replace(/[\[\]]/g, "\\$&");
				var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
					results = regex.exec(url);
				if (!results) return null;
				if (!results[2]) return '';
				return decodeURIComponent(results[2].replace(/\+/g, " "));
			}else{
				return '';
			}	
		}
	}
	
	LocalDb.init(); 
});	

