import path from 'path';
import {promises as fs} from 'fs';

let images = JSON.parse(await fs.readFile(path.join(process.cwd(), "/../") + "db.json", "utf-8"));
let counter = 0;
export default async function handler(req, res) {
    try {
        const {query} = req.query;
        if (query === "getNextImage") {
            let image = images.data[Math.floor((Math.random() * images.data.length))];
            counter++;
            res.status(200).json({
                message: "Successful",
                data: image
            });
            res.end()
        } else if (query === "loadJson") {
            console.log("loading new Images")
            images = JSON.parse(await fs.readFile(path.join(process.cwd(), "/../") + "db.json", "utf-8"));
            res.status(200)
            res.end()
        }
    } catch (e) {
        res.status(500).json({error: e.message})
    }
}