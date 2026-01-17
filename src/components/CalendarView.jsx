import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowLeft, Calendar as CalendarIcon, BookOpen, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import localCalendarData from '../data/calendar_data.json';
import Footer from './Footer/Footer';

const CalendarView = () => {
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [calendarData, setCalendarData] = useState(localCalendarData);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch live data on mount
    useEffect(() => {
        const fetchLiveData = async () => {
            setIsLoading(true);
            try {
                // Use AllOrigins as CORS proxy
                const response = await fetch('https://api.allorigins.win/raw?url=https://www.bibleintamil.com/ref2009/u_calendar2026.htm');
                if (!response.ok) throw new Error('Network response was not ok');
                const html = await response.text();

                // Parse the HTML
                const parsedData = parseCalendarHtml(html);

                if (Object.keys(parsedData).length > 0) {
                    console.log('Successfully fetched and parsed live calendar data', Object.keys(parsedData).length);
                    setCalendarData(prev => ({ ...prev, ...parsedData }));
                }
            } catch (error) {
                console.error('Failed to fetch live calendar data, using local fallback:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLiveData();
    }, []);

    const parseCalendarHtml = (html) => {
        const newData = {};
        const tamilMonths = {
            "ஜனவரி": 0, "பிப்ரவரி": 1, "மார்ச்": 2, "ஏப்ரல்": 3, "மே": 4, "ஜூன்": 5,
            "ஜூலை": 6, "ஆகஸ்ட்": 7, "செப்டம்பர்": 8, "அக்டோபர்": 9, "நவம்பர்": 10, "டிசம்பர்": 11
        };

        // Simple parsing logic matching the Node.js script but browser-friendly
        const monthChunks = html.split('<span class="U_subhead">');

        for (let i = 1; i < monthChunks.length; i++) {
            const chunk = monthChunks[i];
            const monthMatch = chunk.match(/^([^ ]+) 2026/); // Assuming 2026 for now, could be dynamic
            if (!monthMatch) continue;

            const monthName = monthMatch[1];
            const monthIndex = tamilMonths[monthName];

            if (monthIndex === undefined) continue;

            // Regex for date and links
            // Providing global flag to iterate
            const dateRegex = /<td[^>]*bgcolor="[^"]*">(\d+)<\/td>/g;
            const linkRegex = /window\.location\.assign\('([^']+)'\)/g;

            let match;
            while ((match = dateRegex.exec(chunk)) !== null) {
                const dateNum = parseInt(match[1]);

                // Advance linkRegex to where date was found
                linkRegex.lastIndex = dateRegex.lastIndex;

                const readingMatch = linkRegex.exec(chunk);
                const saintMatch = linkRegex.exec(chunk);

                if (readingMatch && saintMatch) {
                    const monthStr = String(monthIndex + 1).padStart(2, '0');
                    const dateStr = String(dateNum).padStart(2, '0');
                    const key = `2026-${monthStr}-${dateStr}`; // Hardcoded 2026 based on URL

                    newData[key] = {
                        readingUrl: readingMatch[1],
                        saintUrl: saintMatch[1]
                    };
                }
            }
        }
        return newData;
    };

    // Helper to format date as YYYY-MM-DD
    const formatDateKey = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const monthNames = [
        "ஜனவரி", "பிப்ரவரி", "மார்ச்", "ஏப்ரல்", "மே", "ஜூன்",
        "ஜூலை", "ஆகஸ்ட்", "செப்டம்பர்", "அக்டோபர்", "நவம்பர்", "டிசம்பர்"
    ];

    const weeks = ["ஞாயிறு", "திங்கள்", "செவ்வாய்", "புதன்", "வியாழன்", "வெள்ளி", "சனி"];

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleDateClick = (day) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setSelectedDate(newDate);
    };

    const isToday = (day) => {
        const today = new Date();
        return day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear();
    };

    const isSelected = (day) => {
        return day === selectedDate.getDate() &&
            currentDate.getMonth() === selectedDate.getMonth() &&
            currentDate.getFullYear() === selectedDate.getFullYear();
    };

    return (
        <div className="min-h-screen bg-bible-dark text-white p-4 pb-20">
            {/* Header */}
            <motion.div
                className="flex items-center justify-between mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <button
                    onClick={() => navigate('/')}
                    className="p-2 rounded-full bg-neutral-800 text-bible-gold hover:bg-neutral-700 transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <h2 className="text-xl font-bold text-bible-gold">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="w-10"></div> {/* Spacer for center alignment */}
            </motion.div>

            {/* Calendar Grid */}
            <motion.div
                className="bg-neutral-800/50 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-neutral-700"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
            >
                {/* Month Navigation */}
                <div className="flex justify-between items-center mb-6 px-2">
                    <button onClick={prevMonth} className="p-2 text-gray-400 hover:text-white transition-colors">
                        <ChevronLeft size={24} />
                    </button>
                    <div className="flex items-center gap-2 text-bible-gold">
                        {isLoading && <span className="w-2 h-2 rounded-full bg-bible-gold animate-pulse"></span>}
                        <CalendarIcon size={20} />
                        <span className="font-medium">தேதியைத் தேர்ந்தெடுக்கவும்</span>
                    </div>
                    <button onClick={nextMonth} className="p-2 text-gray-400 hover:text-white transition-colors">
                        <ChevronRight size={24} />
                    </button>
                </div>

                {/* Days Header */}
                <div className="grid grid-cols-7 mb-2 text-center border-b border-neutral-700 pb-2">
                    {["ஞாயிறு", "திங்கள்", "செவ்வாய்", "புதன்", "வியாழன்", "வெள்ளி", "சனி"].map((day, index) => (
                        <div key={day} className={`text-[10px] sm:text-sm font-bold ${index === 0 ? 'text-red-500' : 'text-blue-400'}`}>
                            {day}
                        </div>
                    ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                    {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                        <div key={`empty-${index}`} className="aspect-[4/5] sm:aspect-square" />
                    ))}

                    {Array.from({ length: daysInMonth }).map((_, index) => {
                        const day = index + 1;
                        const today = isToday(day);
                        const selected = isSelected(day);

                        return (
                            <motion.button
                                key={day}
                                onClick={() => handleDateClick(day)}
                                className={`
                                    w-full aspect-[3/4] sm:aspect-square rounded-lg flex flex-col items-center justify-start pt-2 relative overflow-hidden group border transition-all
                                    ${today
                                        ? 'bg-bible-gold text-black border-bible-gold shadow-lg shadow-bible-gold/20'
                                        : 'bg-neutral-800/50 text-gray-300 border-neutral-700 hover:border-bible-gold/50 hover:bg-neutral-800'
                                    }
                                    ${selected && !today ? 'ring-2 ring-bible-gold text-white bg-neutral-700' : ''}
                                `}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span className={`text-sm sm:text-lg font-bold ${today ? 'scale-110' : ''}`}>{day}</span>

                                <div className="flex flex-col gap-1 mt-1 w-full px-0.5">
                                    <span className={`text-[8px] sm:text-[10px] py-0.5 w-full text-center rounded ${today ? 'bg-black/20 text-black font-medium' : 'bg-neutral-900/80 text-green-400'}`}>
                                        வாசகம்
                                    </span>
                                    {/* Hide Saint on tiny screens if needed, or keep small */}
                                    <span className={`text-[8px] sm:text-[10px] py-0.5 w-full text-center rounded ${today ? 'bg-black/20 text-black font-medium' : 'bg-neutral-900/80 text-blue-300'}`}>
                                        புனிதர்
                                    </span>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </motion.div>

            {/* Selected Date Details */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={selectedDate.toISOString()}
                    className="mt-8 bg-neutral-900/80 rounded-2xl p-6 border border-neutral-800"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                >
                    <div className="flex items-center gap-3 mb-4 text-bible-gold">
                        <BookOpen size={24} />
                        <h3 className="text-lg font-bold">
                            {selectedDate.getDate()} {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                        </h3>
                    </div>

                    <div className="flex flex-col gap-3">
                        {(() => {
                            const dateKey = formatDateKey(selectedDate);
                            const data = calendarData[dateKey];
                            const saintLink = data?.saintUrl
                                ? `https://www.bibleintamil.com/${data.saintUrl.replace('../', '')}`
                                : `https://www.bibleintamil.com/saints/${String(selectedDate.getMonth() + 1).padStart(2, '0')}${String(selectedDate.getDate()).padStart(2, '0')}.htm`;

                            const readingLink = data?.readingUrl
                                ? `https://www.bibleintamil.com/ref2009/${data.readingUrl}`
                                : "https://www.bibleintamil.com/ref2009/u_calendar2026.htm"; // Fallback with manual logic if needed

                            return (
                                <>
                                    <button
                                        onClick={() => navigate('/resource', {
                                            state: {
                                                url: readingLink,
                                                title: `இன்றைய சிந்தனை - ${selectedDate.getDate()} ${monthNames[selectedDate.getMonth()]}`
                                            }
                                        })}
                                        className="w-full py-4 rounded-xl bg-gradient-to-r from-bible-gold to-yellow-600 text-black font-bold text-center hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-bible-gold/20"
                                    >
                                        <BookOpen size={20} />
                                        இன்றைய சிந்தனை வாசிக்க
                                    </button>

                                    <button
                                        onClick={() => navigate('/resource', {
                                            state: {
                                                url: saintLink,
                                                title: `இன்றைய புனிதர் - ${selectedDate.getDate()} ${monthNames[selectedDate.getMonth()]}`
                                            }
                                        })}
                                        className="w-full py-3 rounded-xl bg-neutral-800 text-bible-gold border border-bible-gold/30 font-medium text-center hover:bg-neutral-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <User size={20} />
                                        இன்றைய புனிதர்
                                    </button>
                                </>
                            );
                        })()}
                    </div>
                </motion.div>
            </AnimatePresence>
            <Footer />
        </div>
    );
};

export default CalendarView;
