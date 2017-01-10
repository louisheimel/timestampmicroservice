var express = require('express');
var app = express();
var path = require('path');

app.use('/', express.static(path.join(__dirname, 'public')));
app.get('/',(req, res) => { res.redirect('/static/index.html'); });
app.get('/:query', function(req, res) {
  var query = req.params.query;
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  var dateCheck = {
    unix: function(query) {
      var isCorrectLength = query.split('').length === 10;
      var isIntegerSequence = query.split('')
    				   .map((n) => { return parseInt(n); })
 				   .map((n) => { return n.toString(); })
				   .join('') === query;
      return isCorrectLength && isIntegerSequence;
    },
    natLang: function(query) {
      var queryComponents = decodeURI(query).replace(',', ' ').split(' ').filter((e) => { return e.length !== 0; });
 
      try {
        var hasMonth = months.some((e) => { return e === queryComponents[0]; });
        var hasDate = queryComponents[1].length === 2;
        var hasYear = queryComponents[2].length === 4;
      }
      catch(e) {
        return false;
      }
      return hasMonth && hasDate && hasYear;
    },
  };

  var parse = {
    unixToNatLang: function(query) {
      var natural = "";
      var date = new Date(+query * 1000);
      natural += months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
      return natural;
    },
    natLangToUnix: function(query) {
      return new Date(query).getTime() / 1000;
    },
  };

  if (dateCheck.unix(query)) {
    res.send(JSON.stringify({"unix": +query, "natural": parse.unixToNatLang(query)}));
  } else if(dateCheck.natLang(query)) {
    res.send(JSON.stringify({"unix": parse.natLangToUnix(query), "natural":query }));
  } else {
    res.send(JSON.stringify({"unix": null, "natural": null}));
  }
});
app.listen(8080);
