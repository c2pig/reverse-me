const https = require('https');
const http = require('http');
const url = require('url');
const { Transform } = require('stream');

const flipStyles = `
$&<style>
  img { -webkit-transform: scaleY(-1);transform: scaleY(-1);}
  body { transform: scale(-1, 1);-moz-transform: scale(-1, 1);-webkit-transform: scale(-1, 1); }
</style>
`
const fqdn = process.argv.slice(2)[0];

const reverse = () => {
  return new Transform({
    decodeStrings: false,
    construct(callback) {
      this.data = '';
      callback();
    },
    transform(chunk, encoding, cb) {
      this.data += chunk;
      cb();
    },
    flush(cb) {
      const flipContent = this.data.replace('<head>', flipStyles).replace(/https:\/\/`${fqdn}`/g, 'http://localhost:8080');
      this.push(flipContent);
      cb();
    }
  })
};

const getOptions = (fqdn, path) => {
  return {
    hostname: `${fqdn}`,
    port: 443,
    path, 
    method: 'GET',
    headers: { 'host': `${fqdn}` }
  };
}

const getPage = (options, redirectLoop = 0) => {
  return new Promise((resolve, reject) => {
    if (redirectLoop > 5) {
      reject(`Too many redirection(${redirectLoop})`);
    }
    https.get(options, (proxiedRes) => {
      const {statusCode, headers: { location = '' } } = proxiedRes;
      const hostname = url.parse(location).hostname; 
      if (statusCode > 299 && statusCode < 400) {
        const options = getOptions((hostname ? hostname : fqdn), location)
        resolve({type: 'redirect', options});
      } else {
        resolve({type: 'complete', result: proxiedRes });
      }
    });
  }).then((chain) => {
    const { type, options, result } = chain;
    if(type === 'complete') {
      return result; 
    }
    if(type === 'redirect') {
      return getPage(options, redirectLoop + 1);
    }
    throw new Error("Something went wrong in redirect chain");
  });
}

const proxy = async (req, res) => {
  try {
    const proxiedRes = await getPage(getOptions(fqdn, req.url));
    res.writeHead(proxiedRes.statusCode, proxiedRes.headers);
    proxiedRes.pipe(reverse()).pipe(res)
  } catch(e) {
    console.log(e);
  }
}
http.createServer(proxy).listen(8080);
