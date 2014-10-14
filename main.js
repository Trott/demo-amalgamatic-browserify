var amalgamatic = require('amalgamatic');

var sfx = require('amalgamatic-sfx');
sfx.setOptions({
    url: 'http://cors-anywhere.herokuapp.com/ucelinks.cdlib.org:8888/sfx_ucsf/az'
});

amalgamatic.add('sfx', sfx);

var drupal6 = require('amalgamatic-drupal6');
drupal6.setOptions({
    url: 'http://cors-anywhere.herokuapp.com/www.library.ucsf.edu/search/node'
});
amalgamatic.add('drupal6', drupal6);

var pubmed = require('amalgamatic-pubmed');
amalgamatic.add('pubmed', pubmed);

var dbs = require('amalgamatic-ucsflibdbs');
amalgamatic.add('dbs', dbs);

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
                elem.innerHTML='';

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

var searchTermsRegExp = new RegExp("[\\?&]q=([^&#]*)");
var searchTermsMatch = searchTermsRegExp.exec(window.location.search);

var searchTerms;

if (searchTermsMatch) {
    searchTerms = decodeURIComponent(searchTermsMatch[1].replace(/\+/g, " "));
}

if (searchTerms) {
    document.addEventListener('DOMContentLoaded', function () {
        var i,l;

        search(searchTerms);

        var resultIds = ['pubmed', 'sfx', 'drupal6'];
        var progress = document.createElement('progress');
        var resultElem;
        for (i=0, l=resultIds.length; i<l; i++) {
            resultElem = document.getElementById(resultIds[i]);
            if (resultElem) {
                resultElem.appendChild(progress);
            }
        }

        var searchInputs = document.getElementsByClassName('amalgamatic-search');
        for (i=0, l=searchInputs.length; i<l; i++) {
            searchInputs[i].setAttribute('value', searchTerms);
        }
    });
}
