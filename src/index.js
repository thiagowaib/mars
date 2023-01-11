const express = require('express')
const cors = require('cors')
const ytdl = require('ytdl-core')
require('dotenv').config()

const initServer = () => {
    const app = express();

    app.use(express.json())
    app.use(cors())

    app.use(express.static('public'))

    app.get('/:url', (req, res) => {
        try{
            const {url} = req.params
            
            // Validates if there is a URL
            if(url === "")
                return res.status(400).send({message: "URL inválida"})
        
            // Creates a random key
            const randKey = Date.now()
        
            // Configures the response header and sends it with the attached file
            res.header("Content-Disposition", `attachment; filename="video-${randKey}.mp4"`)
            return ytdl(url, {filter: 'audioandvideo', quality: 'highest'}).pipe(res);

        }catch(err){
            console.log(err)
            return res.status(500).send({message: "Houve algum erro no servidor", error: err})
        }
    }) 


    /**
     * Format overload
     */
    app.get('/:url/:format', (req, res) => {
        try{
            const {format, url} = req.params
        
            // Checks for null format
            if(format === "")
                format = "mp4"

            // Validates the format
            if(format.toLowerCase() !== "mp3" && format.toLowerCase() !== "mp4")
                return res.status(400).send({message: "Formato inválido (mp3 ou mp4)"})
            
            // Validates if there is a URL
            if(url === "")
                return res.status(400).send({message: "URL inválida"})
        
            // Creates a random key
            const randKey = Date.now()
        
            // If it's a video file (mp4)
            if(format.toLowerCase === "mp4") {
                // Configures the response header and sends it with the attached file
                res.header("Content-Disposition", `attachment; filename="video-${randKey}.mp4"`)
                return ytdl(url, {filter: 'audioandvideo', quality: 'highest'}).pipe(res);
            } 
        
            // If it's an audio file (mp3)
            else {
                // Configures the response header and sends it with the attached file
                res.header("Content-Disposition", `attachment; filename="audio-${randKey}.mp3"`)
                return ytdl(url, {filter: 'audio', quality: 'highest'}).pipe(res);
            }
        }catch(err){
            console.log(err)
            return res.status(500).send({message: "Houve algum erro no servidor", error: err})
        }
    }) 

    const server = require('http').Server(app)
    server.listen(process.env.SERVER_PORT || 5000, () => {
        console.log(`Server online :)`)
    })
}

initServer()