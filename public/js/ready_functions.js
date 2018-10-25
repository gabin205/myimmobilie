$(document).ready(function ()
{
    var agencies;
    
    $('#loginForm').submit(function(){
        $('.log-status').addClass('wrong-entry');
        $('.alert').fadeIn(500);
        setTimeout( "$('.alert').fadeOut(600);",600 );
    });

    $('.form-control').keypress(function(){
        $('.log-status').removeClass('wrong-entry');
    });

    $('#loginForm').submit(function (e)
    {
      e.preventDefault();
      $.ajax(
        {
            type    : 'POST',
            url     : '/fa17g16/user/login',
            dataType: 'json',
            data    : $('#loginForm').serialize(),
            success : function (response)
            {
                if (response.login === "true")
                {
                    alert("Successful");
                    $(document).ajaxStop(function ()
                        {
                            window.location.reload();
                        });
                  //$('#myhomepage').html('<center><strong>SUCCESS</strong></center>')
                }
                else
                {
                    $('#errorfield').html('<p>' + response.message +'</p>');
                }
            },
            error   : function ()
            {
                console.log("Error while Login!");
            }
        });
    });

    /*
    * typeahead adresses
    */
    $('.adress-complete-typeahead').typeahead(
    {
        hint     : true,
        highlight: true,
        minLength: 1
    },
    {
        source: function (query, process)
        {
            $.ajax({
                type    : 'POST',
                url     : '/fa17g16/search/adress',
                data    : 'search=' + query,
                dataType: "json",
                success : function (data)
                {
                    process($.map(data, function (items)
                    {
                        var arrItems = [];
                        for (var i in items)
                        {
                            var item = items[i].zipcode + ", " + items[i].location;
                            arrItems.push(item);
                        }
                        return arrItems;
                    }));
                }
            });
            return arrItems;
        },
        limit : 7,
    }
    );
    $('.adress-zipcode-typeahead').typeahead(
        {
            hint     : true,
            highlight: true,
            minLength: 1
        },
        {
            source: function (query, process)
            {
                $.ajax({
                    type    : 'POST',
                    url     : '/fa17g16/search/adress/zipcode',
                    data    : 'search=' + query,
                    dataType: "json",
                    success : function (data)
                    {
                        process($.map(data, function (items)
                        {
                            var arrItems = [];
                            for (var i in items)
                            {
                                var item = items[i].zipcode;
                                arrItems.push(item);
                            }
                            return arrItems;
                        }));
                    }
                });
                return arrItems;
            },
            limit : 7,
        }
    );
    $('.adress-location-typeahead').typeahead(
        {
            hint     : true,
            highlight: true,
            minLength: 1
        },
        {
            source: function (query, process)
            {
                $.ajax({
                    type    : 'POST',
                    url     : '/fa17g16/search/adress',
                    data    : 'search=' + query,
                    dataType: "json",
                    success : function (data)
                    {
                        process($.map(data, function (items)
                        {
                            var arrItems = [];
                            for (var i in items)
                            {
                                var item = items[i].location;
                                arrItems.push(item);
                            }
                            return arrItems;
                        }));
                    }
                });
                return arrItems;
            },
            limit : 7,
        }
    );
              
    var $star_rating = $('.star-rating .fa');

    $star_rating.on('click', function() {
      $star_rating.siblings('input.rating-value').val($(this).data('rating'));
      return SetRatingStar();
    });
    
    var SetRatingStar = function() {
        return $star_rating.each(function() {
          if (parseInt($star_rating.siblings('input.rating-value').val()) >= parseInt($(this).data('rating'))) {
            return $(this).removeClass('fa-star-o').addClass('fa-star');
          } else {
            return $(this).removeClass('fa-star').addClass('fa-star-o');
          }
        });
    };
    
    SetRatingStar();
    
    $('#sendRating').click(function ()
    {
        $('#ratingForm').submit();
    });
    
    $('#sendRequest').click(function ()
    {
        $('#contactForm').submit();
    });

    $('#sendMessage').click(function ()
    {
        $('#replyForm').submit();
    });
    
    $('#setAppointment').click(function ()
    {
        var success = true;
        if(!validateDate("appointmentDate")) {
            document.getElementById("appointmentDate").style.border = "1px solid red";
            success = false;
        }
        else document.getElementById("appointmentDate").style.border = "1px solid #ced4da";
        
        if(!validateTime("appointmentTime")) {
            document.getElementById("appointmentTime").style.border = "1px solid red";
            success = false;
        }
        else document.getElementById("appointmentTime").style.border = "1px solid #ced4da";
        
        if(!success)
            document.getElementById("formaterror").innerHTML = "Invalid input";
        else {
            var now = new Date();
            var app = new Date($('#appointmentDate').val() + ' ' + $('#appointmentTime').val());
            if(app > now)
                $('#appointmentForm').submit();
            else document.getElementById("formaterror").innerHTML = "Appointment date is in the past.";
        }
    });
});

/*
 * resets error messages in search
 */
function resetErrors()
{
    document.getElementById("searchplace").style.border = "1px solid #ced4da";
    document.getElementById("minCost").style.border     = "1px solid #ced4da";
    document.getElementById("maxCost").style.border     = "1px solid #ced4da";
    document.getElementById("minSpace").style.border    = "1px solid #ced4da";
    document.getElementById("maxSpace").style.border    = "1px solid #ced4da";
    document.getElementById("zipcodeerror").innerHTML       = "";
    document.getElementById("costerror").innerHTML      = "";
    document.getElementById("spaceerror").innerHTML     = "";
}

/*
 * Function to check required fields
 * Does not load next page if there is an error
 */
function checkIfEmpty()
{
    var successful  = true;
    var minCostVal  = Math.abs(document.getElementById("minCost").value);
    var maxCostVal  = Math.abs(document.getElementById("maxCost").value);
    var minSpaceVal = Math.abs(document.getElementById("minSpace").value);
    var maxSpaceVal = Math.abs(document.getElementById("maxSpace").value);

    // check if field 'searchplace' is empty
    if (document.getElementById("searchplace").value.trim().length <= 0)
    {
        document.getElementById("searchplace").style.border = "1px solid red";
        document.getElementById("zipcodeerror").innerHTML       = "please enter zipcode";
        successful                                          = false;
    }
    else
    {
        document.getElementById("searchplace").style.border = "1px solid #ced4da";
        document.getElementById("zipcodeerror").innerHTML       = "";
    }

    // check if field 'maxCost' has a smaller value than field 'minCost'
    if ((maxCostVal < minCostVal
         && document.getElementById("maxCost").value.length > 0)
        || isNaN(maxCostVal) || isNaN(minCostVal))
    {

        document.getElementById("minCost").style.border = "1px solid red";
        document.getElementById("maxCost").style.border = "1px solid red";

        if (isNaN(maxCostVal) || isNaN(minCostVal))
            document.getElementById("costerror").innerHTML = "min price and max price must be a number";
        else document.getElementById("costerror").innerHTML = "max price cannot be smaller than min price";

        successful = false;
    }
    else
    {
        document.getElementById("minCost").style.border = "1px solid #ced4da";
        document.getElementById("maxCost").style.border = "1px solid #ced4da";
        document.getElementById("costerror").innerHTML  = "";
    }

    // check if field 'maxSpace' has a smaller value than field 'minSpace'
    if ((maxSpaceVal < minSpaceVal
         && document.getElementById("maxSpace").value.length > 0)
        || isNaN(maxSpaceVal) || isNaN(minSpaceVal))
    {

        document.getElementById("minSpace").style.border = "1px solid red";
        document.getElementById("maxSpace").style.border = "1px solid red";

        if (isNaN(maxSpaceVal) || isNaN(minSpaceVal))
            document.getElementById("spaceerror").innerHTML = "min space and max space must be a number";
        else document.getElementById("spaceerror").innerHTML = "max space cannot be smaller than min space";

        successful = false;
    }
    else
    {
        document.getElementById("minSpace").style.border = "1px solid #ced4da";
        document.getElementById("maxSpace").style.border = "1px solid #ced4da";
        document.getElementById("spaceerror").innerHTML  = "";
    }

    // do not load next page
    if (successful === false)
    {
        return false;
    }

    // load next page
    return true;
}

function showMsg(i) {
    $.ajax({
        type : 'GET',
        url : '/fa17g16/messaging/show/' + i,
        dataType: 'json',
        success : function (response) {
            document.getElementById("messageContent").innerHTML = "";
            var resp = response.data.messagesToConversation[0];

            var names = {};
            names[resp.participants[0].id] =
                resp.participants[0].first_name + " " + resp.participants[0].last_name;
            names[resp.participants[1].id] =
                resp.participants[1].first_name + " " + resp.participants[1].last_name;

            var parentId = 0;
            var nextAnswer = resp.message;
            var arrAnswers = [];
            while (nextAnswer.answers.length > 0) {
                if (nextAnswer.answers[0].answers.length === 0)
                    parentId = nextAnswer.answers[0].id;

                nextAnswer = nextAnswer.answers[0];
                arrAnswers.push(nextAnswer);
            }

            for (i = arrAnswers.length - 1; i >= 0; i--) {
                $('#messageContent').append('\
                    <div class="ml-4">'+
                    '<p id="header" class="ansbox" style="font-weight: bold;">' +
                        names[arrAnswers[i].sender_id] + " " + arrAnswers[i].created_at.substring(0,10) +
                        '&nbsp &nbsp' + arrAnswers[i].created_at.substring(11,19) +
                    '</p>\n\
                    <h5 id="header" class="ansbox">' + arrAnswers[i].header + '</h5>\n\
                    <p id="body" class="ansbox">' + arrAnswers[i].body + '</p>\n\
                    <hr></div>');
            }

            $('#messageContent').append('\
                <div class="ml-4">'+
                    '<p id="header" class="ansbox" style="font-weight: bold;">' +
                        names[resp.message.sender_id] + '\
                    </p>\n\
                    <p id="header" class="ansbox" style="font-weight: bold;">' + resp.message.created_at.substring(0,10) +
                        '&nbsp &nbsp' +  resp.message.created_at.substring(11,19) +
                    '</p>\n\
                    <h5 id="header" class="ansbox">' + resp.message.header + '</h5>\n\
                    <p id="body" class="ansbox">' + resp.message.body + '\
                    </p>\n\
                </div>');

            if(resp.message.real_estate_id !== null){
              $('#messageContent').append('<div class="ml-4"> <a href="/fa17g16/real_estate/'+resp.message.real_estate_id+'"'+
                ' class="btn btn-secondary"><i aria-hidden="true"></i>Show Real Estate</a></div>');
            }

            if (parentId === 0)
                parentId = resp.message.id;

            $("#receiver_id").val(resp.message.sender_id);
            $("#buyer_id").val(resp.message.sender_id);
            $("#real_estate_id").val(resp.message.real_estate_id);
            $("#parent_id").val(parentId);
            document.getElementById('replyBtn').style.visibility = 'visible';
            document.getElementById('appointmentBtn').style.visibility = 'visible';
            $('#replyForm').attr('action', '/fa17g16/messaging/answer/' + parentId);
            $('#appointmentForm').attr('action', '/fa17g16/appointments/appointment');
        },
        error : function () {
            console.log("Error!");
        }
    });
}

function showAgencies() {
    $.ajax({
        type : 'GET',
        url : '/fa17g16/search/agencies/',
        dataType: 'json',
        success : function (response) {
            document.getElementById("sellRealtyContent").innerHTML = "";
            agencies = response;
            for (var i = 0; i < response.data.length; i++) {
                console.log(response.data[i].profilepicture);
                if (response.data[i].profilepicture == null){
                  $('#sellRealtyContent').append('\
                      <div class="col-lg-12" onclick="showAgents(' + i + ')">\n\
                          <div class="row" id="rowDiv">\n\
                              <div class="col-lg-4 mx-auto mb-3">\n\
                                <div class="text-center">\n\
                                  <img class="card-img-top" src="http://192.168.73.186/public/images/nopicture.png"\n\
                                       style="max-width:70%; margin-top:20px">\n\
                                </div>\n\
                              </div>\n\
                              <div class="col-lg-4">\n\
                                  <h5 id="header" class="ansbox">' + response.data[i].name + '</h5>\n\
                                  <p id="body" class="ansbox">' + response.data[i].phone + '</p>\n\
                                  <p id="body" class="ansbox" style="margin-top:-10px;">' +
                                      response.data[i].email + '</p>\n\
                                  <p id="body" class="ansbox" style="margin-top:-10px;">' +
                                      response.data[i].website + '</p>\n\
                                  <p id="body" class="ansbox" style="margin-top:-10px;">Manager: ' +
                                      response.data[i].manager.first_name + ' ' +
                                      response.data[i].manager.last_name + '</p>\n\
                              </div>\n\
                              <div class="col-lg-4" id="ratingDiv">\n\
                            </div>\n\
                          </div>\n\
                      </div>\n\
                  ');
                }
                else {
                  $('#sellRealtyContent').append('\
                      <div class="col-lg-12" onclick="showAgents(' + i + ')">\n\
                          <div class="row" id="rowDiv">\n\
                              <div class="col-lg-4 mx-auto mb-3">\n\
                                <div class="text-center">\n\
                                  <img class="card-img-top" src="'+ response.data[i].profilepicture +'"\n\
                                       style="max-width:100%; margin-top:20px">\n\
                                </div>\n\
                              </div>\n\
                              <div class="col-lg-8">\n\
                                  <h5 id="header" class="ansbox">' + response.data[i].name + '</h5>\n\
                                  <p id="body" class="ansbox">' + response.data[i].phone + '</p>\n\
                                  <p id="body" class="ansbox" style="margin-top:-10px;">' +
                                      response.data[i].email + '</p>\n\
                                  <p id="body" class="ansbox" style="margin-top:-10px;">' +
                                      response.data[i].website + '</p>\n\
                                  <p id="body" class="ansbox" style="margin-top:-10px;">Manager: ' +
                                      response.data[i].manager.first_name + ' ' +
                                      response.data[i].manager.last_name + '</p>\n\
                              </div>\n\
                          </div>\n\
                      </div>\n\
                  ');
                }
		var ratings = [];
                for(var a = 0; a < response.data[i].agents.length; a++) {
                    for(var r = 0; r < response.data[i].agents[a].agent_ratings.length; r++) {
                        ratings.push(response.data[i].agents[a].agent_ratings[r]);
                    }
		}
		$('#ratingDiv').attr('id', 'ratingDiv' + i);
                showRatingForAgent(ratings, i);
            }
        },
        error : function () {
            console.log("Error!");
        }
   });
}

function showFavorites(id) {
    $.ajax({
        type: 'GET',
        url: '/fa17g16/favoriten/real_estate/' + id,
        dataType: 'json',
        success: function (response) {

            document.getElementById("favorableContent").innerHTML = '';//JSON.stringify(response.data);
            id = response;

            for (var i = 0; i < response.data.favorite_real_estate.length; i++) {
                var current_favor = response.data.favorite_real_estate[i];
                var picture = ((current_favor.real_estate.medias[0].path == null) ?
                        'class="card-img-top" src="https://sfsuse.com/~fa17g16/public/images/nopicture.png" style="max-width:70%; margin-top:20px"'
                        :
                        'class="card-img-top" src="'+ current_favor.real_estate.medias[0].path +'" style="max-width:100%; margin-top:20px"'
                );
                $('#favorableContent').append('\
                   <a href="/fa17g16/real_estate/'+current_favor.real_estate.id+'">\n\
                      <div class="col-lg-12">\n\
                          <div class="row" id="rowDiv">\n\
                              <div class="col-lg-4 mx-auto mb-3">\n\
                                <div class="text-center">\n\
                                  <img '+picture+'>\n\
                                </div>\n\
                              </div>\n\
                              <div class="col-lg-4">\n\
                                  <h5 id="header" class="ansbox">' + current_favor.real_estate.header + '</h5>\n\
                                  <p id="body" class="ansbox">' + current_favor.real_estate.description + '</p>\n\
                                  <p id="body" class="ansbox" style="margin-top:-10px;">Rooms: ' +
                    current_favor.real_estate.rooms + '</p>\n\
                                  <p id="body" class="ansbox" style="margin-top:-10px;">Size: ' +
                    current_favor.real_estate.size + '</p>\n\
                                  <p id="body" class="ansbox" style="margin-top:-10px;">Cost: ' +
                    current_favor.real_estate.cost + ' </p>\n\
                              </div>\n\
                              <div class="col-lg-4" id="ratingDiv">\n\
                            </div>\n\
                          </div>\n\
                      </div>\n\
                      </a>\n\
                  ');
            }

        }
    });
}

function showAgents(id) {
    var agents = agencies.data[id].agents;

    document.getElementById("sellRealtyContent").innerHTML = "";
    for (var i = 0; i < agents.length; i++) {
        $('#sellRealtyContent').append('\
            <div class="col-lg-12">\n\
                <div class="row" id="rowDiv"  style="align-items: center;">\n\
                    <div class="col-lg-4" style="display:flex; align-items:center; flex-wrap:wrap;">\n\
                        <img src="/fa17g16/public/images/nopicture.png" style="max-width:200px; padding:20px;">\n\
                    </div>\n\
                    <div class="col-lg-4">\n\
                        <h5 id="header" class="ansbox">' + agents[i].first_name + ' ' +
                            agents[i].last_name + '</h5>\n\
                        <p id="body" class="ansbox">' + agents[i].email + '</p></br>\n\
                        <button type="button" class="btn btn-secondary" onClick="setFormActionRequest('+agents[i].id+')" data-toggle="modal" data-target="#requestModal">\n\
                            <i class="fa fa-vcard"></i> Request\n\
                        </button>\n\
                    </div>\n\
                    <div class="col-lg-4">\n\
                        <div id="ratingDiv">\n\
                        </div>\n\
                    </div>\n\
                </div>\n\
            </div>\n\
            <button id="replyBtn" type="button" class="btn btn-secondary" onclick="showAgencies()"> Back to agencies</button>\n\
        ');

        $('#ratingDiv').attr('id', 'ratingDiv' + i);
        showRatingForAgent(agents[i].agent_ratings, i);
    }
}

function showAppointments(id) {
    $.ajax({
        type : 'GET',
        url : '/fa17g16/appointments/appointments/' + id,
        dataType: 'json',
        success : function (response) {
            document.getElementById("appointmentsContent").innerHTML = "";
            agencies = response;
            if(response.data.appointments.length > 0) {
                for (var i = 0; i < response.data.appointments.length; i++) {
                    var appointmentWith;
                    if(response.data.appointments[i].agent.id === id)
                        appointmentWith = response.data.appointments[i].user.first_name + ' ' + response.data.appointments[i].user.last_name;
                    else appointmentWith = response.data.appointments[i].agent.first_name + ' ' + response.data.appointments[i].agent.last_name;

                    $('#appointmentsContent').append('\
                        <div class="row" id="rowDiv">\n\
                            <div class="col-lg-6">\n\
                                <p id="header" class="ansbox" style="font-weight: bold;">Appointment with ' + appointmentWith + '</p>\n\
                                <p id="header" class="ansbox"><i class="fa fa-calendar"></i> ' + response.data.appointments[i].appointment.substring(0,10) + '</p>\n\
                                <p id="header" class="ansbox"><i class="fa fa-clock-o"></i> ' + response.data.appointments[i].appointment.substring(11,16) + '</p>\n\
                            </div>\n\
                            <div class="col-lg-6">\n\
                                <p id="header" class="ansbox" style="font-weight: bold;">Address:</p>\n\
                                <p> ' + response.data.appointments[i].realty.adress.street + ', ' + response.data.appointments[i].realty.adress.zipcode.zipcode + ' ' + response.data.appointments[i].realty.adress.zipcode.location + '</p>\n\
                                <p id="btnContent'+i+'"></p>\n\
                            </div>\n\
                        </div>\n\
                    ');

                    if(response.data.appointments[i].realty.id !== null) {
                        $('#btnContent'+i).append('<div> <a href="/fa17g16/real_estate/' + response.data.appointments[i].realty.id + '"' +
                            ' class="btn btn-secondary"><i aria-hidden="true"></i>Show Real Estate</a></div>');
                    }

                }
            }
            else {
                $('#appointmentsContent').append('<p>You have no current appointments.</p>');
            }
        },
        error : function () {
            console.log("Error!");
        }
   });
}

function showRatingForAgent(ratings, i) {
    var ratings_amount = 0;
    var ratings_sum = 0;
    
    for(var r = 0; r < ratings.length; r++) {
        ratings_amount = ratings_amount+1;
        ratings_sum = ratings_sum + (ratings[r].rating * 2);
    }

    if(ratings_sum > 0) {
        var ratings_avg = (ratings_sum/ratings_amount);
        var stars = Math.round(ratings_avg)/2;
        var starsleft = 5-stars;

        if(stars >= 1) {
            for(var s = 1; s <= stars; s++) {
                $('#ratingDiv' + i).append('\
                    <i class="fa fa-star"></i>');
            }
        }

        if(Math.round(ratings_avg) % 2 !== 0) {
            $('#ratingDiv' + i).append('\
                <i class="fa fa-star-half-o"></i>');
        }

        if(starsleft >= 1) {
            for(var s = 0; s < Math.floor(starsleft); s++) {
                $('#ratingDiv' + i).append('\
                    <i class="fa fa-star-o"></i>');
            }
        }
    }
    else {
        $('#ratingDiv' + i).append('<i class="fa fa-star-o"></i> Not rated yet.');
    }
}

function validateDate(dateId) {
    // check Date Format
    re = /^\d{4}\-\d{1,2}\-\d{1,2}$/;
    if($('#' + dateId).val().match(re)) {
        return true;
    }
    else return false;
}

function validateTime(timeId) {
    // check Time Format
    re = /^\d{1,2}:\d{2}([ap]m)?$/;
    if($('#' + timeId).val().match(re)) {
        return true;
    }
    else return false;
}

function setFormActionRating(id){
    $('#ratingForm').attr('action', "/fa17g16/rateable/agent/"+id);
}

function setFormActionRequest(id){
  $('#contactForm').attr('action', "/fa17g16/messaging/advertisementrequest/"+id);
}