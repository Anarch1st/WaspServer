let URLs = (function() {

  function parseResponse(data) {
    return data;
  }

  function getUrlFromRoute(route) {
    if (route && route.length > 0) {
      var url = "";

      for (var path of route) {
        url += path + '/'
      }

      return url.substring(0, url.length-1);
    } else {
      return "";
    }
  }
  return {
    urls: {
      GET_BASE_FILE_URL: '/files/get/'
    },
    parseResponse: parseResponse,
    getUrlFromRoute: getUrlFromRoute
  }
})();
