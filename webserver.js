#! /usr/bin/env node

if (process.argv[2] == "-h" || process.argv[2] == "-help") {
	console.log(`webserver <WEBSERVER-DIRECTORY || CURRENT-DIRECTORY> <ERROR-PAGE-DIRECTORY || WEBSERVER-DIRECTORY (optional)>`)
	console.log("E.g., webserver ./content ./content/errors/")

	return
}

const path = process.argv[2] || __dirname
const errPath = process.argv[3] || path

const express = require("express")
const app = express()

const fs = require("fs")

function send(file, loc) {
	fs.readFile(file, "utf-8", (error, data) => {
		if (error) {
			console.error(error)

			fs.readFile(`${errPath}500.html`, (error, data) => {
				if (error) { loc.send("Error 500: Error while displaying message in response to previous error") }
				else { loc.send(data) }
			})
		}
		else {
			loc.send(data)
		}
	})
}

app.get("/", (req, res) => {
	res.set("Content-Type", "text/html")
	send(`${path}/index.html`, res)
})
app.get("/style.css", (req, res) => {
	res.set("Content-Type", "text/css")
	send(`${path}/style.css`, res)
})
app.get("/script.js", (req, res) => {
	res.set("Content-Type", "application/javascript")
	send(`${path}/script.js`, res)
})
app.get("/favicon.png", (req, res) => {
	res.set("Content-Type", "image/png")
	res.sendFile(`${path}/favicon.png`)
})

app.use((req, res) => {
	fs.readFile(`${errPath}/404.html`, "utf-8", (error, data) => {
		if (error) { console.error(error) }
		else { res.status(404).send(data) }
	})
})

app.listen(8000, () => console.log("Listening on port 8000"))
