import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import bibleLogo from '../assets/bible_logo.png';

const SplashScreen = ({ onFinish }) => {
    const [text, setText] = useState('');
    const fullText = "திருப்பலி வாசகம் & பாடல்கள்";

    useEffect(() => {
        // Typewriter effect
        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex <= fullText.length) {
                setText(fullText.slice(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(interval);
                // Wait a bit after typing finishes before exiting
                setTimeout(() => {
                    onFinish();
                }, 1500);
            }
        }, 100); // Speed of typing

        return () => clearInterval(interval);
    }, [onFinish]);

    return (
        <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bible-dark text-bible-gold"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
        >
            <motion.img
                src={bibleLogo}
                alt="Bible Logo"
                className="w-32 h-32 mb-8 drop-shadow-2xl"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            />
            <motion.h1
                className="text-2xl md:text-3xl font-bold tracking-wide text-center px-4 h-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
            >
                {text}
                <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                    className="ml-1 inline-block w-1 h-6 bg-bible-gold align-middle"
                />
            </motion.h1>
        </motion.div>
    );
};

export default SplashScreen;
