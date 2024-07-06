import {useEffect, useRef, useState} from 'react';
import notify from '../assets/sounds/notify.mp3';

const usePlaySound = (soundUrl: string = notify, play: boolean = true) => {
    const audioRef = useRef(new Audio(soundUrl));
    const playSound = () => {
        audioRef.current.play();
    }

    useEffect(() => {
        if (play) {
            audioRef.current.play();
        }
    }, [play]);

    return playSound;

};

export default usePlaySound;
