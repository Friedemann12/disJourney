export default async function handler(req, res) {
    let imageUrl = req.body.imageUrl;
    let imageName = req.body.imageName;

    try {
        const imageRes = await fetch(imageUrl);
        const arrayBuffer = await imageRes.arrayBuffer();

        res.setHeader('Content-Disposition', `attachment; filename=` + imageName);
        res.setHeader('Content-Type', imageRes.headers.get('content-type'));

        return res.end(Buffer.from(arrayBuffer));
    } catch (err) {
        console.error(err);
        return res.status(500).send(err);
    }
}