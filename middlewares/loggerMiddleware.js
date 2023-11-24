const fs = require("fs");

const loggerMiddleware = (req, res, next) => {
  console.log(req.url);
  if (req.url === "/logs") {
    next();
    return;
  }

  function writeLog(newLog) {
    fs.writeFile("./log.json", newLog, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }

  try {
    fs.readFile("./log.json", (err, data) => {
      const log = JSON.parse(data);
      log.use = log.use + 1;
      switch (req.url) {
        case "/search/movies":
          log.search = log.moviesSearch + 1;
          break;
        case "/search/series":
          log.search = log.seriesSearch + 1;
          break;
        default:
          break;
      }
      const newData = JSON.stringify(log);

      writeLog(newData);
    });
    next();
  } catch (error) {
    console.log(error);
    next();
  }
};

module.exports = loggerMiddleware;
