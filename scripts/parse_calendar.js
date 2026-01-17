
import fs from 'fs';
import path from 'path';

const rawHtmlPath = path.join(process.cwd(), 'calendar_raw.html');
const outputPath = path.join(process.cwd(), 'src/data/calendar_data.json');

// Ensure data directory exists
if (!fs.existsSync(path.dirname(outputPath))) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
}

const html = fs.readFileSync(rawHtmlPath, 'utf-8');

// Regex to find all months
// In the HTML, months are in <th> spans: <span class="U_subhead">ஜனவரி 2026</span>
// We can split the content by month headers.
// Note: This relies on the specific structure of the fetched HTML.

// Mapping Tamil month names to indices
const tamilMonths = {
    "ஜனவரி": 0, "பிப்ரவரி": 1, "மார்ச்": 2, "ஏப்ரல்": 3, "மே": 4, "ஜூன்": 5,
    "ஜூலை": 6, "ஆகஸ்ட்": 7, "செப்டம்பர்": 8, "அக்டோபர்": 9, "நவம்பர்": 10, "டிசம்பர்": 11
};

const calendarData = {};

// Simple split by month header to chunk the data
// Looks like <span class="U_subhead">MONTH 2026</span>
const monthChunks = html.split('<span class="U_subhead">');

// Skip the first chunk (header stuff)
for (let i = 1; i < monthChunks.length; i++) {
    const chunk = monthChunks[i];
    // Extract month name
    const monthMatch = chunk.match(/^([^ ]+) 2026/);
    if (!monthMatch) continue;

    const monthName = monthMatch[1];
    const monthIndex = tamilMonths[monthName];

    if (monthIndex === undefined) continue;

    // Now find all days in this chunk
    // Structure: 
    // <td width="21" rowspan="2" bgcolor="...">1</td>
    // ... onClick="...('READING_URL')" ...
    // ... onClick="...('SAINT_URL')" ...

    // We can regex for determining the date and its associated links.
    // The days appear in order 1..31
    // We can regex find all instances of number cells.

    // Regex to capture a day block approx
    // <td[^>]*>([0-9]+)<\/td>.*?onClick="[^"]*'([^']+)'".*?onClick="[^"]*'([^']+)'"
    // Multiline matching is tricky in JS regex without 's' flag support in older Node, but Node 18+ supports /s
    // Let's use a global match loop.

    // Strategy: Find a date number, then look for the next two onClick links.
    const dateRegex = /<td[^>]*bgcolor="[^"]*">(\d+)<\/td>/g;
    const linkRegex = /window\.location\.assign\('([^']+)'\)/g;

    let match;
    while ((match = dateRegex.exec(chunk)) !== null) {
        const dateNum = parseInt(match[1]);

        // From this position, find the next two links
        linkRegex.lastIndex = dateRegex.lastIndex; // Start searching from where date was found

        const readingMatch = linkRegex.exec(chunk);
        const saintMatch = linkRegex.exec(chunk);

        if (readingMatch && saintMatch) {
            // Construct key: YYYY-MM-DD
            const monthStr = String(monthIndex + 1).padStart(2, '0');
            const dateStr = String(dateNum).padStart(2, '0');
            const key = `2026-${monthStr}-${dateStr}`;

            calendarData[key] = {
                readingUrl: readingMatch[1],
                saintUrl: saintMatch[1]
            };
        }
    }
}

fs.writeFileSync(outputPath, JSON.stringify(calendarData, null, 2));
console.log(`Parsed ${Object.keys(calendarData).length} days. Saved to ${outputPath}`);
