var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.get('/:query', function(req, res) {
  var query = req.params.query;
  console.log('query is: ' + query)
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
      if (!queryComponents) { return null }
      var hasMonth = months.some((e) => { return e === queryComponents[0]; });
      var hasDate = queryComponents[1] ? queryComponents[1].length === 2 : false;
      var hasYear = queryComponents[2] ? queryComponents[2].length === 4 : false;
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

  console.log('query is: ' + query)
  if (dateCheck.unix(query)) {
    res.send(JSON.stringify({"unix": +query, "natural": parse.unixToNatLang(query)}));
  } else if(dateCheck.natLang(query)) {
    res.send(JSON.stringify({"unix": parse.natLangToUnix(query), "natural":query }));
  } else {
    res.send(JSON.stringify({"unix": null, "natural": null}));
  }
});
app.listen(process.env.PORT || 8080);
