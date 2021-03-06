const https = require('https');
const http = require('http');
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

const getPage = (options) => {
  return new Promise((resolve, reject) => {
    https.get(options, (proxiedRes) => {
      resolve(proxiedRes); 
    });
  });
}
console.log(fqdn);
const proxy = async (req, res) => {
  const options = {
    hostname: `${fqdn}`,
    port: 443,
    path: req.url,
    method: 'GET',
    headers: { 'host': `${fqdn}` }
  };
  try {
    const proxiedRes = await getPage(options);
    res.writeHead(proxiedRes.statusCode, proxiedRes.headers);
    proxiedRes.pipe(reverse()).pipe(res);
  } catch(e) {
    console.log(e);
  }
}
http.createServer(proxy).listen(8080);
