const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const responseHandler = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  switch (request.method) {
    case 'GET':
      if (parsedUrl.pathname === '/') {
        htmlHandler.getIndex(request, response);
      } else if (parsedUrl.pathname === '/style.css') {
        htmlHandler.getCSS(request, response);
      } else if (parsedUrl.pathname === '/getChars') {
        responseHandler.getChars(request, response);
      } else if (parsedUrl.pathname === '/notReal') {
        responseHandler.notReal(request, response);
      } else {
        responseHandler.notReal(request, response);
      }
      break;
	  
    case 'HEAD':
      if (parsedUrl.pathname === '/getChars') {
        responseHandler.getCharsMeta(request, response);
      } else {
        responseHandler.notRealMeta(request, response);
      }
      break;
    case 'POST':
      if (parsedUrl.pathname === '/addUser') {
        const res = response;
        const body = [];

        request.on('error', (err) => {
          console.dir(err);
          res.statusCode = 400;
          res.end();
        });

        request.on('data', (chunk) => {
          body.push(chunk);
        });

        request.on('end', () => {
          const bodyString = Buffer.concat(body).toString();
          const bodyParams = query.parse(bodyString);

          responseHandler.addChar(request, res, bodyParams);
        });
      }
      break;
    default:
      responseHandler.notReal(request, response);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
