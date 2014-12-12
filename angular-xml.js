if (!X2JS) {
  throw new Error("You're required to include the X2JS library to use the xml module.");
}

(function(ng) {

  function responseIsXml(response) {
    var contentType = response.headers('content-type'),
        XML = '/xml',
        minIndex = 'text/xml'.indexOf(XML);
    if (contentType) {
      return contentType.indexOf(XML) >= minIndex;
    } else {
      return false;
    }
  }

  function xmlHttpInterceptorFactory($q, x2js) {
    function responseHandler(response) {
      if (response && responseIsXml(response)) {
        response.xml = x2js.xml_str2json(response.data);
        return response;
      } else {
        return $q.when(response);
      }
    }
    return {
      response: responseHandler
    };
  }

  function configProvider($provide) {
    $provide.factory('xmlHttpInterceptor', ['$q', 'x2js', xmlHttpInterceptorFactory]);
  }

  function x2jsFactory() {
    return new X2JS();
  }

  if (ng) {
    ng
      .module('xml', [])
      .config(['$provide', configProvider])
      .factory('x2js', x2jsFactory);
  }

}(angular));

