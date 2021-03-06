# reverse-me

Principle
Decision Log

Lesson Learnt
* Redirect loop
* flush(cb) vs flush: () => {}
* backpressure (imdb.com) -  proxiedRes.pipe(reverse()).pipe(res)



connection speed download slow because all unzip

tech selection: solution - options
why not jsdom
why not node-fetch / highland

limitation:
- only https
- browser compatability
- redirection
- hyperlink not working when redirect 
- content-encoding: 'gzip'
 proxiedRes.pipe(zlib.createGunzip()).pipe(reverse()).pipe(res) (yahoo.com)
- site asset does not support redirect (eg: google.com vs www.google.com )

 testing:
 dev.to
 google.com
 bbc.com
 yahoo.com
 imdb.com

 BUG:
 yahoo.com

 node version

