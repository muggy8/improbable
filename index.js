let fs = require("fs")
let marked = require("marked")
let http = require('http')
let readFile = promisify(fs.readFile)
let pathStats = promisify(fs.lstat)
let readDir = promisify(fs.readdir)
let url = require("url")
let htmlTemplate = `
<html>
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<style>
			img {
				max-width: 100%;
				height: auto;
			}
			body {background-color: #000; font-family: sans-serif; color: #fff;}
		</style>
	</head>
	<body>uwu</body>
</html>
`

http.createServer(async function (req, res) {
	let path = url.parse(req.url).pathname
	console.log(path)
	let isMarkdown = false

	if (/\/([^\/\.]*\.md)$/){
		isMarkdown = true
	}
	else if (/\/([^\/\.]*\.[^\/\.]+)?$/.test(path)){
		// has file extention and isn't directory
	}

	let stats
	try{
		stats = await pathStats(__dirname + path)
	}
	catch(uwu){
		try{
			stats = await pathStats(__dirname + path + ".md")
			res.writeHead(308, {
				'Content-Type': 'text/plain',
				"Location": path + ".md"

			})
			res.write('redirect')
			res.end()

		}
		catch(UwU){
			res.writeHead(404, {'Content-Type': 'text/plain'})
			res.write('404: Not Found')
			res.end()
		}
		return
	}

	if (stats.isDirectory()){

		let directoryItems = (await readDir(__dirname + path)).map(async function(subPath){
			let maybePath = __dirname + path + "/" + subPath
			let stats = await pathStats(maybePath)
			return stats.isFile()
				? `<li><a href="./${subPath}">${subPath}</a></li>`
				: `<li><a href="./${subPath}/">${subPath}/</a></li>`
		})

		directoryItems = (await Promise.all(directoryItems)).join("")

		let ele = `<ul>${directoryItems}</ul>`
		let contents = htmlTemplate.replace("uwu", ele)

		res.writeHead(200)
		res.write(contents)
	}
	else{
		let contents = await readFile(__dirname + path, "utf-8")
		if (isMarkdown){
			contents = marked(contents)
			contents = htmlTemplate.replace("uwu", contents)
		}

		res.writeHead(200)
		res.write(contents)
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
