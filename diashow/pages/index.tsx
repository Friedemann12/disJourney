import Head from 'next/head';
import React, {useEffect} from 'react';
import Image from 'next/image';
import {faRefresh} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import ContextMenu from "../components/contextMenu";

async function getRandomImage() {
    return fetch("/api/images/getNextImage").then((res) => res.json());
}

type discordImage = {
    message: string,
    prompt: string,
    url: string,
    id: string
}
//45000
const timeToNextImage = 45000
export default function Home() {
    const [discordImage, setDiscordImage] = React.useState<discordImage>({
        message: "",
        prompt: "",
        url: "",
        id: ""
    });
    const [showContextMenu, setShowContextMenu] = React.useState(false);
    const [contextMenuX, setContextMenuX] = React.useState(0);
    const [contextMenuY, setContextMenuY] = React.useState(0);
    const [total, setTotal] = React.useState(0);
    const [index, setIndex] = React.useState(0);

    function setDiscordImageAndPrompt(data) {
        setDiscordImage(data);
        if (data.prompt.length >= 750) {
            data.prompt = data.prompt.substring(0, 750) + "..."
        }
    }

    useEffect(() => {
        let i = 0
        const id = setInterval(() => {
            if (document.getElementById("prompting") === null) return;
            if (i === 0) {
                document.getElementById("prompting").innerHTML = "";
            }
            typeWriter(i, getPrompt(discordImage.prompt))
            i++;
        }, discordImage.prompt.length >= 500 ? 10 : 50);
        return () => clearInterval(id);
    }, [discordImage])

    const delay = ms => new Promise(res => setTimeout(res, ms));

    async function newImage() {
        setDiscordImageAndPrompt({
            message: discordImage.message,
            prompt: "",
            url: discordImage.url,
            id: discordImage.id
        })
        let bla = await getRandomImage();
        setTotal(bla.total)
        setIndex(bla.index)
        setDiscordImageAndPrompt(bla.data);
    }

    useEffect(() => {
        const id = setInterval(() => {
            newImage();
        }, timeToNextImage);
        return () => clearInterval(id);
    })

    function typeWriter(i = 0, text = getPrompt(discordImage.prompt)) {
        if (document.getElementById("prompting") === null) return;
        document.getElementById("prompting").innerHTML += text.charAt(i);
    }


    function getPrompt(prompt: string): string {
        if (prompt === "" || prompt === null || prompt === undefined) return "";
        const regex = new RegExp('\\*\\*(.*?)\\*\\*', 'gm')
        return regex.exec(prompt)[1];
    }


    return (
        <div>
            <Head>
                <title>disJourney</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <div>
                {discordImage.url !== "" ?

                    <div className="imageContainer">
                        <ContextMenu
                            targetId='image'
                            imageUrl={discordImage.url}
                            imageName={"Image_#" + index + ".png"}
                        />
                        <p className="prompt"><span className="prompting intro">_prompt:&nbsp;</span>
                            <span id="prompting" className="prompting"></span>
                        </p>
                        <p className={"imagecounter"}>image #{index}/{total}</p>
                        <Image src={discordImage.url} alt="moin" width={0}
                               height={0}
                               sizes="100vw" className="image" id="image"/>
                        <p className={"nextImageButton"} onClick={newImage}>next image</p>
                    </div>
                    :
                    <div className={"startDiashowContainer"}>
                        <p className={"startDiashow"} onClick={newImage}>start</p>
                    </div>
                }
            </div>
        </div>
    )
}

