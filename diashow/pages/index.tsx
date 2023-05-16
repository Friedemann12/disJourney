import Head from 'next/head';
import React, {useEffect} from 'react';
import Image from 'next/image';
import {faRefresh} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

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
    const [test, setTest] = React.useState<discordImage>({
        message: "",
        prompt: "",
        url: "",
        id: ""
    });
    const [isNewText, setIsNewText] = React.useState(false);

    function setTestAndPrompt(data) {
        setTest(data);
        if (data.prompt.length >= 750) {
            data.prompt = data.prompt.substring(0, 750) + "..."
        }
        typeWriter(0, getPrompt(data.prompt))
    }

    const delay = ms => new Promise(res => setTimeout(res, ms));

    async function newImage() {
        let bla = await getRandomImage();
        setTestAndPrompt(bla.data);
    }

    useEffect(() => {
        const id = setInterval(() => {
            newImage();
        }, timeToNextImage);
        return () => clearInterval(id);
    })

    async function typeWriter(i = 0, text = getPrompt(test.prompt)) {
        if (i === 0) {
            await delay(250);
            document.getElementById("prompting").innerHTML = "";
        }
        if (i < text.length && !isNewText) {
            document.getElementById("prompting").innerHTML += text.charAt(i);
            i++;
            setTimeout(function () {
                typeWriter(i, text)
            }, text.length >= 500 ? 10 : 50);
        }
    }


    function getPrompt(prompt: string): string {
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
                {test.url !== "" ?
                    <div className="imageContainer">
                        <p className="prompt"><span className="prompting intro">_prompt:&nbsp;</span>
                            <span id="prompting" className="prompting"></span>
                        </p>
                        <Image src={test.url} alt="moin" width={0}
                               height={0}
                               sizes="100vw" className="image"/>
                    </div>
                    :
                    <button onClick={newImage}>Start</button>
                }
            </div>
        </div>
    )
}

