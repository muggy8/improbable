let fs = require("fs")
let marked = require("marked")
let http = require('http')
let readFile = promisify(fs.readFile)
let url = require("url")
let htmlTemplate = `
<html>
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
	</head>
	<body>uwu</body>
</html>
`

http.createServer(async function (req, res) {
	let path = url.parse(req.url).pathname
	let isMarkdown = false
	if (/\/([^\/\.]*\.[^\/\.]+)?$/.test(path)){
		// uwu
	}
	else{
		path += ".md"
		isMarkdown = true
	}
	
	try{
		let contents = await readFile(__dirname + path, "utf-8")
		if (isMarkdown){
			contents = marked(contents)
			contents = htmlTemplate.replace("uwu", contents)
		}
		
		res.writeHead(200)
		res.write(contents)
	}
	catch(uwu){
		res.writeHead(404, {'Content-Type': 'text/plain'})
		res.write('404: Not Found')
		console.log(uwu)
	}
	
	// res.writeHead(200, {'Content-Type': 'text/plain'})
	// res.write('Hello World!')
	res.end()
}).listen(5000)

console.log("listening on localhost:5000")

function promisify(fn){
	return function(){
		let context = this
		let args = Array.prototype.slice.call(arguments)
		return new Promise(function(accept, reject){
			args.push(function(err, data){
				if (err){
					return reject(err)
				}
				accept(data)
			})
			fn.apply(context, args)
		})
	}
}