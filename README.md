# reverse-me

Principle
Decision Log

Lesson Learnt
* Redirect loop
* flush(cb) vs flush: () => {}

connection speed

tech selection: solution - options
why not jsdom
why not node-fetch / highland

limitation:
- only https
- browser compatability
- redirection
- hyperlink not working when redirect 
- content-encoding: 'gzip'
 proxiedRes.pipe(zlib.createGunzip()).pipe(reverse()).pipe(res)

