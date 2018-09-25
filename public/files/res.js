let URLs = (function() {

  function parseResponse(data) {
    console.log(data);
    return data;
  }
  return {
    urls: {
      GET_BASE_FILE_URL: '/files/get'
    },
    parseResponse: parseResponse
  }
})();
