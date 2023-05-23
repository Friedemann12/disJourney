import {useState, useEffect, useRef, useLayoutEffect} from 'react';
import {saveAs} from 'file-saver';

const ContextMenu = ({targetId, imageUrl, imageName}) => {
    const [contextData, setContextData] = useState({visible: false, posX: 0, posY: 0});
    const contextRef = useRef(null);


    useEffect(() => {
        const contextMenuEventHandler = (event) => {
            const targetElement = document.getElementById(targetId)
            if (targetElement && targetElement.contains(event.target)) {
                event.preventDefault();
                setContextData({visible: true, posX: event.clientX, posY: event.clientY})
            } else if (contextRef.current && !contextRef.current.contains(event.target)) {
                setContextData({...contextData, visible: false})
            }
        }

        const offClickHandler = (event) => {
            if (contextRef.current && !contextRef.current.contains(event.target)) {
                setContextData({...contextData, visible: false})
            }
        }

        document.addEventListener('contextmenu', contextMenuEventHandler)
        document.addEventListener('click', offClickHandler)
        return () => {
            document.removeEventListener('contextmenu', contextMenuEventHandler)
            document.removeEventListener('click', offClickHandler)
        }
    }, [contextData, targetId])

    useLayoutEffect(() => {
        if (contextData.posX + contextRef.current?.offsetWidth > window.innerWidth) {
            setContextData({...contextData, posX: contextData.posX - contextRef.current?.offsetWidth})
        }
        if (contextData.posY + contextRef.current?.offsetHeight > window.innerHeight) {
            setContextData({...contextData, posY: contextData.posY - contextRef.current?.offsetHeight})
        }
    }, [contextData])

    async function downloadImage() {
        try {
            const res = await fetch("/api/downloadImage", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({imageUrl: imageUrl, imageName: imageName}),
            });

            if (!res.ok) throw new Error("Error downloading the image");

            const blob = await res.blob();
            saveAs(blob, imageName);

        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div ref={contextRef} className='contextMenuContainer' style={{
            display: `${contextData.visible ? 'block' : 'none'}`,
            left: contextData.posX,
            top: contextData.posY
        }}>
            <p onClick={downloadImage}>download</p>
        </div>
    );
}

export default ContextMenu;
