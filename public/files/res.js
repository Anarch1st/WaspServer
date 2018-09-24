let URLs = (function() {

  function parseResponse(data) {
    return data;
  }
  return {
    urls: {
      GET_BASE_FILE_URL: '/files/get'
    },
    func: {
      parseResponse: parseResponse
    }
  }
})();
