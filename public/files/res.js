let URLs = (function() {

  let getApi = function(url, method, contentType, handleAs) {
    return {
      url: url,
      method: method || "GET",
      contentType: contentType || "application/json",
      handleAs: handleAs || "json"
    };
  };

  return {
    urls: {
      GET_FILE_LIST: getApi('/get');
    }
  }
})();
