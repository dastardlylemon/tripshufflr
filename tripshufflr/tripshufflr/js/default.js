

// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function ()
{
    "use strict";

    var title = new Array();
    var rating = new Array();
    var photo = new Array();
    var id = new Array();
    var review = new Array();
    var website = new Array();
    var auth = new Array();

    var key = "AIzaSyBgGKN50nfIOuQnVgPpM6sFCYhAGsiwayU";

    var BACKALREADY = 0;

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;

    var places = "zoo shopping_mall museum movie_theater aquarium art_gallery bicycle_store bowling_alley amusement_park";

    var food = "bakery cafe food restaurant meal_delivery meal_takeaway";

    var shopping = "shopping_mall store jewelry_store home_goods_store hair_care furniture_store florist clothing_store";

    var feminine = "beauty_salon hair_care jewelry_store night_club spa";

    var nightlife = "spa night_club liquor_store bar casino";

    var profile = places;


    var flyout;

    app.onactivated = function (args)
    {
        if (args.detail.kind === activation.ActivationKind.launch)
        {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated)
            {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            }
            else
            {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }


            WinJS.UI.Fragments.render("ms-appx:///search.html", form).done(function ()
            {
                args.setPromise(WinJS.UI.processAll());
                var myButton = document.getElementById("search-button");
                myButton.addEventListener("click", clickHandle, false);
                var element = document.getElementById("noplace");
                flyout = new WinJS.UI.Flyout(element, {});
            });

        }
    };

    app.oncheckpoint = function (args)
    {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. You might use the
        // WinJS.Application.sessionState object, which is automatically
        // saved and restored across suspension. If you need to complete an
        // asynchronous operation before your application is suspended, call
        // args.setPromise().
    };

    function randomSequence(n)
    {
        var seq = new Array(n);
        for (var i = 0; i < n; i++)
        {
            seq[i] = i;
        }
        for (var i = 0; i < n; i++)
        {
            var a = Math.floor(Math.random() * n);
            var b = Math.floor(Math.random() * n);

            var tmp = seq[a];
            seq[a] = seq[b];
            seq[b] = tmp;
        }
        return seq;
    }

    function localizer(term)
    {
        //returns range in meters. default is 1000
        var range = 16000;

        switch (term)
        {
            case 'street_number':
            case 'street_address':
                //precise street address
                range = 5 * 1600; //1600 meters/mile, 5 miles
                break;
            case 'route':
                //highway
                range = 10 * 1600;
                break;
            case 'intersection':
                //intersection
                range = 2 * 1600;
                break;
            case 'political':
                range = 2 * 1600;
                break;
            case 'country':
                //country
                range = 0;
                break;
            case 'administrative_area_level_1':
                //state
                range = 50000;
                break;
            case 'administrative_area_level_2':
                //county
                range = 20 * 1600;
                break;
            case 'administrative_area_level_3':
                //minor civil division
                range = 10 * 1600;
                break;
            case 'colloquial_area':
                //alternative name (colloquial area)
                range = 2 * 1600;
                break;
            case 'locality':
                //city or town
                range = 10 * 1600;
                break;
            case 'sublocality':
                //below a locality
                range = 5 * 1600;
                break;
            case 'neighborhood':
                //neighborhood
                range = 2 * 1600;
                break;
            case 'premise':
                //building or collection of buildings with a name
                range = 1 * 1600;
                break;
            case 'subpremise':
                //right below a premise
                range = 1 * 1600;
                break;
            case 'postal_code':
                range = 5 * 1600;
                break;
            case 'natural_feature':
                range = 10 * 1600;
                break;
            case 'airport':
                range = 10 * 1600;
                break;
            case 'park':
                range = 2 * 1600;
                break;
            case 'point_of_interest':
                range = 5 * 1600;
                break;
            default:
                range = 10 * 1600;
                break;
        }

        return range;
    }

    function preload(arrayOfImages)
    {
        $(arrayOfImages).each(function ()
        {
            $('<img/>')[0].src = this;
            // Alternatively you could use:
            // (new Image()).src = this;
        });
    }

     function htmlDecode(value)
     {
         if (value)
         {
             return $('<div />').html(value).text();
         } else
         {
             return '';
         }
     }

    function load(i)
    {
        /*var clicked = $(".res-place")[i];
        var name = clicked.children("h3").text();
        var web = '<a href=' + clicked.children('span').text() + '>Link</a>';
        var img = clicked.children('img').attr('src');
        var review = clicked.children('span').children('#review').children('p').html();
        var auth = clicked.find('div.author').eq(0).text();
        */
        $('#rating').css('display', 'block');
        $('#website').css('display', 'block');
        $('#reviews').css('display', 'block');
        $('#athr').css('display', 'block');


        $('#detail-header').children('h2').text(title[i]);
        $('#detail-details').children('#rating').text(rating[i]);
        $('#detail-header').children('img').attr('src', photo[i]);

        $('#reviews').html(htmlDecode(review[i]));
        $('#website').html(website[i]);
        $('#athr').text(auth[i]);
    }

    function loadSearch()
    {
        var output = document.getElementById("output");
        WinJS.UI.Animation.fadeOut(output).done(function ()
        {
            output.style.display = "none";
            var form = document.getElementById("form");
            form.style.display = "block";
            WinJS.UI.Animation.fadeIn(form)
            BACKALREADY = 1;
        });
    }

    function clickHandle(eventInfo)
    {
        var locName = document.getElementById("main-search").value;
        var geourl = "https://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURIComponent(locName) + "&sensor=false";

        WinJS.xhr({ url: geourl, responseType: 'json' }).done(
               function onComplete(request)
               {
                   if (request.status == 200)
                   {

                       var loc = JSON.parse(request.responseText);
                       if (loc.results.length <= 0)
                       {
                           var element = document.getElementById("locname");
                           element.innerText = locName;
                           flyout.show(element, 'auto', 'center');

                       }
                       else
                       {
                           var latitude = loc.results[0].geometry.location.lat;
                           var longitude = loc.results[0].geometry.location.lng;

                           //choose type of place depending on user input profile
                           //var prof = document.getElementById("profile").value;
                           var prof = 'fun';
                           switch (prof)
                           {
                               case 'fun':
                                   profile = places;
                                   break;
                               case 'food':
                                   profile = food;
                                   break;
                               case 'shop':
                                   profile = shopping;
                                   break;
                               case 'nightlife':
                                   profile = nightlife;
                                   break;
                               case 'feminine':
                                   profile = feminine;
                                   break;
                               default:
                                   profile = places;
                                   break;
                           }

                           //document.getElementById("query").value = profile;
                           var types = profile.replace(/ /g, "|");

                           var radii = loc.results[0].address_components[0].types;

                           var maxRadius = 0;
                           for (var i = 0; i < radii.length; i++)
                           {
                               var temp = localizer(radii[i]);
                               if (temp > maxRadius)
                               {
                                   maxRadius = temp;
                               }
                           }
                           var placesurl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=" + encodeURIComponent(key) + "&location=" + latitude + "," + longitude + "&radius=" + maxRadius + "&sensor=false&types=" + types;
                           WinJS.xhr({ url: placesurl, responseType: 'json' }).done(
                               function complete(result)
                               {
                                   if (result.status == 200)
                                   {
                                       var query = JSON.parse(result.responseText);
                                       //var resElement = document.getElementById("results");
                                       var length = query.results.length;
                                       //resElement.innerHTML = "<p> length: " + length + "</p>\n";

                                       var output = document.getElementById("output");

                                       var form = document.getElementById("form");
                                       WinJS.UI.Animation.fadeOut(form).done(function ()
                                       {
                                           form.style.display = "none";
                                           output.style.display = "block";
                                           if (BACKALREADY == 0)
                                           {
                                               WinJS.UI.Fragments.render("ms-appx:///res.html", output).then(function ()
                                               {
                                                   var tmp = loc.results[0].formatted_address
                                                   $('#res-header').children('h1').text(tmp.substr(0, tmp.indexOf(",")));

                                                   var names = document.querySelectorAll(".res-place");
                                                   var min = length;
                                                   if (names.length < length)
                                                   {
                                                       min = names.length;
                                                   }
                                                   if (min > 3)
                                                   {
                                                       min = 3;
                                                   }

                                                   var sequence = randomSequence(length);


                                                   for (var i = 0; i < min; i++)
                                                   {
                                                       title[i] = query.results[sequence[i]].name;
                                                       rating[i] = query.results[sequence[i]].rating;
                                                       id[i] = query.results[sequence[i]].reference;
                                                       if (query.results[sequence[i]].photos)
                                                       {
                                                           var photoref = query.results[sequence[i]].photos[0].photo_reference;
                                                           photo[i] = "https://maps.googleapis.com/maps/api/place/photo?key=" + key + "&photoreference=" + photoref + "&sensor=false&maxwidth=800";
                                                       }
                                                       else
                                                       {
                                                           photo[i] = "/images/placeholder.jpg";
                                                       }
                                                   }
                                                   
                                                    preload(photo);

                                                   names[1].innerHTML = query.results[sequence[0]].name;
                                                   names[3].innerHTML = query.results[sequence[1]].name;
                                                   names[4].innerHTML = query.results[sequence[2]].name;
                                                   if (length >= 3)
                                                   {
                                                       var item = document.getElementById("r1");
                                                       item.addEventListener("click", function ()
                                                       {
                                                           load(0);
                                                       }, false);
                                                       item = document.getElementById("r3");
                                                       item.addEventListener("click", function ()
                                                       {
                                                           load(1);
                                                       }, false);
                                                       item = document.getElementById("r4");
                                                       item.addEventListener("click", function ()
                                                       {
                                                           load(2);
                                                       }, false);
                                                   }

                                                   var types = food.replace(/ /g, "|");
                                                   
                                                   var placesurl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=" + encodeURIComponent(key) + "&location=" + latitude + "," + longitude + "&radius=" + maxRadius + "&sensor=false&types=" + types;
                                                   WinJS.xhr({ url: placesurl, responseType: 'json' }).done(
                                                       function complete(result)
                                                       {
                                                           if (result.status == 200)
                                                           {
                                                               var query = JSON.parse(result.responseText);

                                                               var length = query.results.length;

                                                               var sequence = randomSequence(length);

                                                               for (var i = 3; i < min+3; i++)
                                                               {

                                                                   title[i] = query.results[sequence[i]].name;
                                                                   rating[i] = query.results[sequence[i]].rating;
                                                                   id[i] = query.results[sequence[i]].reference;
                                                                   if (query.results[sequence[i]].photos)
                                                                    {
                                                                       var photoref = query.results[sequence[i]].photos[0].photo_reference;
                                                                       photo[i] = "https://maps.googleapis.com/maps/api/place/photo?key=" + key + "&photoreference=" + photoref + "&sensor=false&maxwidth=800";
                                                                   }
                                                                   else
                                                                   {
                                                                       photo[i] = "/images/placeholder.jpg";
                                                                   }
                                                               }
                                                              
                                                                preload(photo);

                                                               names[0].innerHTML = query.results[sequence[3]].name;
                                                               names[2].innerHTML = query.results[sequence[4]].name;
                                                               names[5].innerHTML = query.results[sequence[5]].name;

                                                               if (length >= 3)
                                                               {
                                                                   var item = document.getElementById("r0");
                                                                   item.addEventListener("click", function ()
                                                                   {
                                                                       load(3);
                                                                   }, false);
                                                                   item = document.getElementById("r2");
                                                                   item.addEventListener("click", function ()
                                                                   {
                                                                       load(4);
                                                                   }, false);
                                                                   item = document.getElementById("r5");
                                                                   item.addEventListener("click", function ()
                                                                   {
                                                                       load(5);
                                                                   }, false);
                                                               }
                                                               load(3);
                                                               var infoURLBase = "https://maps.googleapis.com/maps/api/place/details/json?key=" + key;
                                                               var a = 0;
                                                               var infoURL = infoURLBase + "&reference=" + id[0] + "&sensor=false";

                                                               WinJS.xhr({ url: infoURL, responseType: 'json' }).done(function complete(response)
                                                               {
                                                                   if (response.status == 200)
                                                                   {
                                                                       var query = JSON.parse(response.responseText);
                                                                       website[0] = query.result.website;
                                                                       var reviews = query.result.reviews.length;
                                                                       var rand = Math.floor(Math.random() * reviews);
                                                                       review[0] = query.result.reviews[rand].text;
                                                                       auth[0] = query.result.reviews[rand].author_name;
                                                                   }
                                                               });

                                                               a = 1;
                                                               var infoURL = infoURLBase + "&reference=" + id[1] + "&sensor=false";
                                                               WinJS.xhr({ url: infoURL, responseType: 'json' }).done(function complete(response)
                                                               {
                                                                   if (response.status == 200)
                                                                   {
                                                                       var query = JSON.parse(response.responseText);
                                                                       website[1] = query.result.website;
                                                                       var reviews = query.result.reviews.length;
                                                                       var rand = Math.floor(Math.random() * reviews);
                                                                       review[1] = query.result.reviews[rand].text;
                                                                       auth[1] = query.result.reviews[rand].author_name;
                                                                   }
                                                               });

                                                               a = 2;
                                                               var infoURL = infoURLBase + "&reference=" + id[2] + "&sensor=false";
                                                               WinJS.xhr({ url: infoURL, responseType: 'json' }).done(function complete(response)
                                                               {
                                                                   if (response.status == 200)
                                                                   {
                                                                       var query = JSON.parse(response.responseText);
                                                                       website[2] = query.result.website;
                                                                       var reviews = query.result.reviews.length;
                                                                       var rand = Math.floor(Math.random() * reviews);
                                                                       review[2] = query.result.reviews[rand].text;
                                                                       auth[2] = query.result.reviews[rand].author_name;
                                                                   }
                                                               });

                                                               a = 3;
                                                               var infoURL = infoURLBase + "&reference=" + id[3] + "&sensor=false";
                                                               WinJS.xhr({ url: infoURL, responseType: 'json' }).done(function complete(response)
                                                               {
                                                                   if (response.status == 200)
                                                                   {
                                                                       var query = JSON.parse(response.responseText);
                                                                       website[3] = query.result.website;
                                                                       var reviews = query.result.reviews.length;
                                                                       var rand = Math.floor(Math.random() * reviews);
                                                                       review[3] = query.result.reviews[rand].text;
                                                                       auth[3] = query.result.reviews[rand].author_name;
                                                                   }
                                                               });

                                                               a = 4;
                                                               var infoURL = infoURLBase + "&reference=" + id[4] + "&sensor=false";
                                                               WinJS.xhr({ url: infoURL, responseType: 'json' }).done(function complete(response)
                                                               {
                                                                   if (response.status == 200)
                                                                   {
                                                                       var query = JSON.parse(response.responseText);
                                                                       website[4] = query.result.website;
                                                                       var reviews = query.result.reviews.length;
                                                                       var rand = Math.floor(Math.random() * reviews);
                                                                       review[4] = query.result.reviews[rand].text;
                                                                       auth[4] = query.result.reviews[rand].author_name;
                                                                   }
                                                               });

                                                               a = 5;
                                                               var infoURL = infoURLBase + "&reference=" + id[5] + "&sensor=false";
                                                               WinJS.xhr({ url: infoURL, responseType: 'json' }).done(function complete(response)
                                                               {
                                                                   if (response.status == 200)
                                                                   {
                                                                       var query = JSON.parse(response.responseText);
                                                                       website[5] = query.result.website;
                                                                       var reviews = query.result.reviews.length;
                                                                       var rand = Math.floor(Math.random() * reviews);
                                                                       review[5] = query.result.reviews[rand].text;
                                                                       auth[5] = query.result.reviews[rand].author_name;
                                                                   }
                                                               });

                                                               var a = document.getElementById("back");
                                                               a.addEventListener("click", loadSearch, false);
                                                           }
                                                       });


                                               });

                                           }
                                           else
                                           {
                                               
                                               WinJS.UI.Animation.fadeIn(output).then(function ()
                                               {
                                                   var tmp = loc.results[0].formatted_address
                                                   $('#res-header').children('h1').text(tmp.substr(0, tmp.indexOf(",")));

                                                   var names = document.querySelectorAll(".res-place");
                                                   var min = length;
                                                   if (names.length < length)
                                                   {
                                                       min = names.length;
                                                   }
                                                   if (min > 3)
                                                   {
                                                       min = 3;
                                                   }

                                                   var sequence = randomSequence(length);


                                                   for (var i = 0; i < min; i++)
                                                   {
                                                       title[i] = query.results[sequence[i]].name;
                                                       rating[i] = query.results[sequence[i]].rating;
                                                       id[i] = query.results[sequence[i]].reference;
                                                       if (query.results[sequence[i]].photos)
                                                       {
                                                           var photoref = query.results[sequence[i]].photos[0].photo_reference;
                                                           photo[i] = "https://maps.googleapis.com/maps/api/place/photo?key=" + key + "&photoreference=" + photoref + "&sensor=false&maxwidth=800";
                                                       }
                                                       else
                                                       {
                                                           photo[i] = "/images/placeholder.jpg";
                                                       }
                                                   }
                                                   
                                                    preload(photo);

                                                   names[1].innerHTML = query.results[sequence[0]].name;
                                                   names[3].innerHTML = query.results[sequence[1]].name;
                                                   names[4].innerHTML = query.results[sequence[2]].name;
                                                   if (length >= 3)
                                                   {
                                                       var item = document.getElementById("r1");
                                                       item.addEventListener("click", function ()
                                                       {
                                                           load(0);
                                                       }, false);
                                                       item = document.getElementById("r3");
                                                       item.addEventListener("click", function ()
                                                       {
                                                           load(1);
                                                       }, false);
                                                       item = document.getElementById("r4");
                                                       item.addEventListener("click", function ()
                                                       {
                                                           load(2);
                                                       }, false);
                                                   }
                                                   
                                                   
                                                   var types = food.replace(/ /g, "|");
                                                   var placesurl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=" + encodeURIComponent(key) + "&location=" + latitude + "," + longitude + "&radius=" + maxRadius + "&sensor=false&types=" + types;
                                                   WinJS.xhr({ url: placesurl, responseType: 'json' }).done(
                                                       function complete(result)
                                                       {
                                                           if (result.status == 200)
                                                           {
                                                               var query = JSON.parse(result.responseText);

                                                               var length = query.results.length;

                                                               var sequence = randomSequence(length);

                                                               for (var i = 3; i < min+3; i++)
                                                               {

                                                                   title[i] = query.results[sequence[i]].name;
                                                                   rating[i] = query.results[sequence[i]].rating;
                                                                   id[i] = query.results[sequence[i]].reference;
                                                                   if (query.results[sequence[i]].photos)
                                                                   {
                                                                       var photoref = query.results[sequence[i]].photos[0].photo_reference;
                                                                       photo[i] = "https://maps.googleapis.com/maps/api/place/photo?key=" + key + "&photoreference=" + photoref + "&sensor=false&maxwidth=800";
                                                                   }
                                                                   else
                                                                   {
                                                                       photo[i] = "/images/placeholder.jpg";
                                                                   }
                                                               }
                                                              
                                                                preload(photo);

                                                               names[0].innerHTML = query.results[sequence[3]].name;
                                                               names[2].innerHTML = query.results[sequence[4]].name;
                                                               names[5].innerHTML = query.results[sequence[5]].name;

                                                               if (length >= 3)
                                                               {
                                                                   var item = document.getElementById("r0");
                                                                   item.addEventListener("click", function ()
                                                                   {
                                                                       load(3);
                                                                   }, false);
                                                                   item = document.getElementById("r2");
                                                                   item.addEventListener("click", function ()
                                                                   {
                                                                       load(4);
                                                                   }, false);
                                                                   item = document.getElementById("r5");
                                                                   item.addEventListener("click", function ()
                                                                   {
                                                                       load(5);
                                                                   }, false);
                                                               }
                                                               load(3);
                                                               var infoURLBase = "https://maps.googleapis.com/maps/api/place/details/json?key=" + key;
                                                               var a = 0;
                                                               var infoURL = infoURLBase + "&reference=" + id[0] + "&sensor=false";

                                                               WinJS.xhr({ url: infoURL, responseType: 'json' }).done(function complete(response)
                                                               {
                                                                   if (response.status == 200)
                                                                   {
                                                                       var query = JSON.parse(response.responseText);
                                                                       website[0] = query.result.website;
                                                                       var reviews = query.result.reviews.length;
                                                                       var rand = Math.floor(Math.random() * reviews);
                                                                       review[0] = query.result.reviews[rand].text;
                                                                       auth[0] = query.result.reviews[rand].author_name;
                                                                   }
                                                               });

                                                               a = 1;
                                                               var infoURL = infoURLBase + "&reference=" + id[1] + "&sensor=false";
                                                               WinJS.xhr({ url: infoURL, responseType: 'json' }).done(function complete(response)
                                                               {
                                                                   if (response.status == 200)
                                                                   {
                                                                       var query = JSON.parse(response.responseText);
                                                                       website[1] = query.result.website;
                                                                       var reviews = query.result.reviews.length;
                                                                       var rand = Math.floor(Math.random() * reviews);
                                                                       review[1] = query.result.reviews[rand].text;
                                                                       auth[1] = query.result.reviews[rand].author_name;
                                                                   }
                                                               });

                                                               a = 2;
                                                               var infoURL = infoURLBase + "&reference=" + id[2] + "&sensor=false";
                                                               WinJS.xhr({ url: infoURL, responseType: 'json' }).done(function complete(response)
                                                               {
                                                                   if (response.status == 200)
                                                                   {
                                                                       var query = JSON.parse(response.responseText);
                                                                       website[2] = query.result.website;
                                                                       var reviews = query.result.reviews.length;
                                                                       var rand = Math.floor(Math.random() * reviews);
                                                                       review[2] = query.result.reviews[rand].text;
                                                                       auth[2] = query.result.reviews[rand].author_name;
                                                                   }
                                                               });

                                                               a = 3;
                                                               var infoURL = infoURLBase + "&reference=" + id[3] + "&sensor=false";
                                                               WinJS.xhr({ url: infoURL, responseType: 'json' }).done(function complete(response)
                                                               {
                                                                   if (response.status == 200)
                                                                   {
                                                                       var query = JSON.parse(response.responseText);
                                                                       website[3] = query.result.website;
                                                                       var reviews = query.result.reviews.length;
                                                                       var rand = Math.floor(Math.random() * reviews);
                                                                       review[3] = query.result.reviews[rand].text;
                                                                       auth[3] = query.result.reviews[rand].author_name;
                                                                   }
                                                               });

                                                               a = 4;
                                                               var infoURL = infoURLBase + "&reference=" + id[4] + "&sensor=false";
                                                               WinJS.xhr({ url: infoURL, responseType: 'json' }).done(function complete(response)
                                                               {
                                                                   if (response.status == 200)
                                                                   {
                                                                       var query = JSON.parse(response.responseText);
                                                                       website[4] = query.result.website;
                                                                       var reviews = query.result.reviews.length;
                                                                       var rand = Math.floor(Math.random() * reviews);
                                                                       review[4] = query.result.reviews[rand].text;
                                                                       auth[4] = query.result.reviews[rand].author_name;
                                                                   }
                                                               });

                                                               a = 5;
                                                               var infoURL = infoURLBase + "&reference=" + id[5] + "&sensor=false";
                                                               WinJS.xhr({ url: infoURL, responseType: 'json' }).done(function complete(response)
                                                               {
                                                                   if (response.status == 200)
                                                                   {
                                                                       var query = JSON.parse(response.responseText);
                                                                       website[5] = query.result.website;
                                                                       var reviews = query.result.reviews.length;
                                                                       var rand = Math.floor(Math.random() * reviews);
                                                                       review[5] = query.result.reviews[rand].text;
                                                                       auth[5] = query.result.reviews[rand].author_name;
                                                                   }
                                                               });

                                                               var a = document.getElementById("back");
                                                               a.addEventListener("click", loadSearch, false);
                                                           }
                                                       });


                                               });
                                           }

                                       });


                                   }
                               },
                               function onErr(result)
                               {

                               },
                               function progress(result)
                               {

                               });

                       }
                   }
               },
               function onErr(request)
               {

               },
               function progress(request)
               {

               });
    }

    app.start();
})();
