// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function ()
{
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;

    var places = "zoo shopping_mall museum movie_theater aquarium art_gallery bicycle_store bowling_alley amusement_park";

    var food = "bakery cafe food restuarant meal_delivery meal_takeaway";

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
        for(var i=0; i<n; i++)
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

        switch(term)
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

                           var key = "AIzaSyA49ByqroYLnOOpV59Z8FugW2qyhiQgRYY";
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

                                       var sequence = randomSequence(length);

                                       var output = document.getElementById("output");

                                       var form = document.getElementById("form");
                                       WinJS.UI.Animation.fadeOut(form).done(function ()
                                       {
                                           form.style.display = "none";
                                           WinJS.UI.Fragments.render("ms-appx:///res.html", output).then(function()
                                           {
                                           
                                                var names = document.querySelectorAll(".res-place");
                                                var min = length;
                                                if (names.length < length)
                                                {
                                                    min = names.length;
                                                }

                                                for (var i = 0; i < min; i++)
                                                {
                                                    var name = query.results[i].name;
                                                    var element = "<h3>" + name + "</h3>";
                                                    names[i].innerHTML = element;
                                                }
                                           });
                                           

                                           
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
