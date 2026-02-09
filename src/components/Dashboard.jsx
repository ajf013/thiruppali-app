import { BookOpen, Calendar, Music, FileText, Radio, Scroll, Mic2 } from 'lucide-react';
import ResourceCard from './ResourceCard';
import { motion } from 'framer-motion';
import bibleLogo from '../assets/bible_logo.png';
import Footer from './Footer/Footer';

const resources = [
    {
        title: "இன்றைய சிந்தனை & புனிதர்கள்",
        url: "/calendar",
        icon: BookOpen,
        isHighlighted: true,
        clickEffect: true,
        isInternal: true,
    },
    {
        title: "வாசக நூல்கள்",
        url: "https://www.bibleintamil.com/u_fs-lectionary.htm",
        icon: Scroll,
        isHighlighted: true,
        isInternal: true,
    },
    {
        title: "இறை அலைகள்",
        url: "https://www.bibleintamil.com/iraialai/starting-songtext.htm",
        icon: Radio,
        isHighlighted: true,
        isInternal: true,
    },
    {
        title: "முத்துச்சரம்",
        url: "https://www.bibleintamil.com/songstext/starting-songtext.htm",
        icon: Music,
        isHighlighted: true,
        isInternal: true,
    },
    {
        title: "திருப்பலி இராகங்கள்",
        url: "https://www.bibleintamil.com/u_fs-mass-raga.htm",
        icon: Mic2,
        isHighlighted: true,
        isInternal: true,
    },
];

const Dashboard = () => {
    return (
        <div className="min-h-screen bg-bible-dark text-white p-6 pb-20">
            <motion.header
                className="flex flex-col items-center mb-10 pt-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <img src={bibleLogo} alt="Logo" className="w-16 h-16 mb-4 opacity-90" />
                <h1 className="text-xl md:text-2xl font-bold text-bible-gold text-center">
                    திருப்பலி வாசகம் & பாடல்கள்
                </h1>
            </motion.header>

            <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {resources.map((resource, index) => (
                    <ResourceCard
                        key={resource.title}
                        {...resource}
                        delay={index * 0.1}
                    />
                ))}
            </div>

            <Footer />
        </div>
    );
};

export default Dashboard;
