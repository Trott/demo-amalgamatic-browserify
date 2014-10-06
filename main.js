var amalgamatic = require('amalgamatic');
var sfx = require('amalgamatic-sfx');
    // var millennium = require('amalgamatic-millennium');
    // var libguides = require('amalgamatic-libguides');
    // var pubmed = require('amalgamatic-pubmed');
    // var drupal6 = require('amalgamatic-drupal6');
    // var dbs = require('amalgamatic-ucsflibdbs');

amalgamatic.add('sfx', sfx);
// amalgamatic.add('millennium', millennium);
// amalgamatic.add('libguides', libguides);
// amalgamatic.add('pubmed', pubmed);
// amalgamatic.add('drupal6', drupal6);
// amalgamatic.add('dbs', dbs);

sfx.setOptions({
    host: 'cors-anywhere.herokuapp.com',
    port: 80,
    path: '/ucelinks.cdlib.org:8888/sfx_ucsf/az',
    withCredentials: false
});

var realDomain = {
    sfx: 'http://ucelinks.cdlib.org:8888'
};

var search = function (searchTerm, res) {
    var callback = null;

    var options = {
        searchTerm: searchTerm,
        pluginCallback: function (err, result) {
            var elem = document.getElementById(result.name);
            if (elem) {
                if (err) {
                    elem.textContent = err.message;
                } else {
                    var ol = document.createElement('ol');
                    var li, a;
                    var href, name;
                    for (var i = 0, l = result.data.length; i < l; i++) {
                        li = document.createElement('li');
                        a = document.createElement('a');
                        href = result.data[i].url.match(/^(https?:)?\/\/[\w:\/\?&%=\.\-~\+]+$/)[0];
                        href = href.replace(/^http:\/\/cors-anywhere.herokuapp.com(:80)?/, realDomain[result.name]);
                        a.setAttribute('href', href);
                        a.textContent = result.data[i].name;
                        li.appendChild(a);
                        ol.appendChild(li);
                    }
                    elem.appendChild(ol);
                }

            } else {
                console.log('Error: #' + result.name + ' not found');
            }
        }
    };

    amalgamatic.search(options);
};

search('medicine');