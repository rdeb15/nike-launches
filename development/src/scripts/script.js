$(function() {
  //alert(window.navigator.userAgent);

   // alert(window.navigator.userAgent);
    //quark.platform

    //quark.debug = true

    // quark.unpin();

    $('#logo').on('click', function(e) {
      e.preventDefault();
      //window.location("http://m.nike.com/us/en_us/launch")
      quark.openURL("http://m.nike.com/us/en_us/launch")
    })


    // Menu
    $('#menu').on('click', function(e) {
      e.preventDefault();

      quark.showMenu({
            items: [
                {label: "Finite Kicks", click: function() { quark.openURL("http://www.finitekicks.com/") } },
                {label: "Exit", click: function() { quark.quit() } },
            ],
            x: 310,
            y: 55
        })
    })

    // Login
    $('#refresh').on('click', function(e) {
      e.preventDefault();

      sync();
    })
    

    sync();



});

$(window).load(function() {
      //$('.preloader').addClass('loaded');
});
/**
 * jQuery.ajax mid - CROSS DOMAIN AJAX 
 * ---
 * @author James Padolsey (http://james.padolsey.com)
 * @version 0.11
 * @updated 12-JAN-10
 * ---
 * Note: Read the README!
 * ---
 * @info http://james.padolsey.com/javascript/cross-domain-requests-with-jquery/
 */


jQuery.ajax = (function (_ajax) {

    var protocol = location.protocol,
        hostname = location.hostname,
        exRegex = RegExp(protocol + '//' + hostname),
        YQL = 'http' + (/^https/.test(protocol) ? 's' : '') + '://query.yahooapis.com/v1/public/yql?callback=?',
        query = 'select * from html where url="{URL}" and xpath="*"';

    function isExternal(url) {
        return !exRegex.test(url) && /:\/\//.test(url);
    }

    return function (o) {

        var url = o.url;

        if (/get/i.test(o.type) && !/json/i.test(o.dataType) && isExternal(url)) {

            // Manipulate options so that JSONP-x request is made to YQL

            o.url = YQL;
            o.dataType = 'json';

            o.data = {
                q: query.replace(
                    '{URL}',
                    url + (o.data ?
                        (/\?/.test(url) ? '&' : '?') + jQuery.param(o.data)
                    : '')
                ),
                format: 'xml'
            };

            // Since it's a JSONP request
            // complete === success
            if (!o.success && o.complete) {
                o.success = o.complete;
                delete o.complete;
            }

            o.success = (function (_success) {
                return function (data) {

                    if (_success) {
                        // Fake XHR callback.
                        _success.call(this, { 
                            responseText: (data.results[0] || '')
                                // YQL screws with <script>s
                                // Get rid of them
                                .replace(/<script[^>]+?\/>|<script(.|\s)*?\/script>/gi, '')
                        }, 'success');
                    }
                };
            })(o.success);

        }

        return _ajax.apply(this, arguments);

    };

  })(jQuery.ajax);

function sync() {  

  $.ajax({
      url: 'http://www.nike.com/us/en_us/launch#',
      type: 'GET',
      success: function(res) {
          // Find all the Release links
          var links = $(res.responseText).find('.exp-calendar-card a');
          $.each(links, function(i) {
            $('#content').append(links[i]);
          
           // console.log(links[i].href)
          })

          // Get all the links that were added to the DOM
          var setLinks = $('#content a')
          
          // Find the release card from Nike
          var ver = $(res.responseText).find('.exp-calendar-card');

          $.each(setLinks, function(i) {
            // append the release card to the anchor tag
            var $this = $(this);
            $this.append(ver[i]);
            
            $this.attr('onclick', "quark.openURL('" + links[i] + "')")
            $this.removeAttr('href');
          })


          $('.preloader').addClass('loaded');
         
      },
      beforeSend: function() {
        
        $('.preloader').removeClass('loaded');
        $('#content').html('');
      }
  });




}

