const axios = require("axios");

module.exports = async function fetchXML(url) {
  const response = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
    timeout: 10000,
  });

  return response.data;
};