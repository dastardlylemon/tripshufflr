// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function ()
{
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;

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
            args.setPromise(WinJS.UI.processAll());
            var myButton = document.getElementById("helloButton");
            myButton.addEventListener("click", clickHandle, false);
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

    function clickHandle(eventInfo)
    {
        var loc = document.getElementById("location").value;
        var search = document.getElementById("keyword").value;
        var geourl = "https://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURIComponent(loc) + "&sensor=false";

        WinJS.xhr({ url: geourl, responseType: 'json' }).done(
               function onComplete(request)
               {
                   if (request.status == 200)
                   {
    
                       var loc = JSON.parse(request.responseText);
                       var latitude = loc.results[0].geometry.location.lat;
                       var longitude = loc.results[0].geometry.location.lng;


                       var key = "AIzaSyA49ByqroYLnOOpV59Z8FugW2qyhiQgRYY";
                       var placesurl = "https://maps.googleapis.com/maps/api/place/textsearch/json?key=" + encodeURIComponent(key) + "&location=" + latitude + "," + longitude + "&radius=5000&sensor=false&query=" + encodeURIComponent(search);

                       document.getElementById("query").value = placesurl;

                       WinJS.xhr({ url: placesurl, responseType: 'json' }).done(
                           function complete(result)
                           {
                               if (result.status == 200)
                               {
                                   var query = JSON.parse(result.responseText);
                                   var resElement = document.getElementById("results");
                                   var length = query.results.length;
                                   resElement.innerHTML = "<p> length: " + length + "</p>\n";
                                   for (var i = 0; i < length; i++)
                                   {
                                       var name = query.results[i].name;
                                       var element = "<p>" + name + "</p>";
                                       resElement.innerHTML += element + "\n";
                                   }
                               }
                           },
                           function onErr(result)
                           {

                           },
                           function progress(result)
                           {

                           });

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
