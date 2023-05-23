import path from 'path';
import {promises as fs} from 'fs';

let images = JSON.parse(await fs.readFile(path.join(process.cwd(), "/../") + "db.json", "utf-8"));
export default async function handler(req, res) {
    try {
        const {query} = req.query;
        if (query === "getNextImage") {
            let index = Math.floor((Math.random() * images.data.length))
            let image = images.data[index];
            res.status(200).json({
                message: "Successful",
                data: image,
                index: index,
                total: images.data.length
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