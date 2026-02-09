import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ResourceCard = ({ title, url, icon: Icon, delay, isHighlighted, clickEffect, isInternal }) => {
    const navigate = useNavigate();

    const handleClick = (e) => {
        if (isInternal) {
            e.preventDefault();
            const action = () => {
                if (url.startsWith('http')) {
                    navigate('/resource', { state: { url, title } });
                } else {
                    navigate(url);
                }
            };

            if (clickEffect) {
                setTimeout(action, 150);
            } else {
                action();
            }
        }
    };

    const CardContent = () => (
        <div className={`bg-neutral-800/50 backdrop-blur-md border rounded-xl p-6 flex flex-col items-center justify-center h-48 gap-4 transition-all shadow-lg 
            ${isHighlighted
                ? 'border-bible-gold shadow-bible-gold/20'
                : 'border-neutral-700 hover:border-bible-gold/50 hover:shadow-bible-gold/10'
            }`}
        >
            <div className={`p-4 rounded-full transition-colors duration-300 
                ${isHighlighted
                    ? 'bg-bible-gold text-black'
                    : 'bg-neutral-800 text-bible-gold group-hover:bg-bible-gold group-hover:text-black'
                }`}
            >
                <Icon size={32} strokeWidth={1.5} />
            </div>
            <h3 className={`text-lg font-medium text-center transition-colors 
                ${isHighlighted ? 'text-white font-bold' : 'text-gray-200 group-hover:text-white'}`}
            >
                {title}
            </h3>
        </div>
    );

    return (
        <motion.a
            href={isInternal ? undefined : url}
            onClick={handleClick}
            target={isInternal ? undefined : "_blank"}
            rel={isInternal ? undefined : "noopener noreferrer"}
            className="block group relative cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{
                opacity: 1,
                y: 0,
                // If highlighted, add a subtle scale pulse or border pulse
                scale: isHighlighted ? [1, 1.02, 1] : 1,
            }}
            transition={{
                delay: delay,
                duration: 0.5,
                // Repeats for highlighted
                scale: isHighlighted ? {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                } : {}
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{
                scale: clickEffect ? 0.9 : 0.98,
                rotate: clickEffect ? [0, -2, 2, 0] : 0, // Shake effect on click
                transition: { duration: 0.1 }
            }}
        >
            <CardContent />
        </motion.a>
    );
};

export default ResourceCard;
