var express = require('express')

function getQueryObj(route) {
  if (route.indexOf('?') !== -1) {
    var query = route.slice(route.indexOf('?') + 1);
    var result = {};
    query.split("&").forEach(function (part) {
      var item = part.split("=");
      result[item[0]] = decodeURIComponent(item[1]);
    });
    return result;
  }
}

module.exports = function (routes) {
  var router = express.Router()


  Object.keys(routes).forEach(function (route) {
    if (route.indexOf(':') !== -1) {
      router.all(route, function (req, res, next) {
        // Rewrite target url using params
        var target = routes[route]
        for (var param in req.params) {
          target = target.replace(':' + param, req.params[param])
        }
        req.query = Object.assign(req.query, getQueryObj(routes[route]));
        req.url = target
        next()
      })
    } else {
      router.all(route + '*', function (req, res, next) {
        // Rewrite url by replacing prefix
        req.query = Object.assign(req.query, getQueryObj(routes[route]));
        req.url = req.url.replace(route, routes[route])
        next()
      })
    }

  })

  return router
}