import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const ResourceViewer = ({ title: propTitle, url: propUrl }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Support both props and router state (for dynamic navigation from Calendar)
    const url = propUrl || location.state?.url;
    const title = propTitle || location.state?.title || "Resource";

    const [isLoading, setIsLoading] = useState(true);
    const [blobUrl, setBlobUrl] = useState(null);
    const iframeRef = useRef(null);

    // Agent Script: Injected into every page to handle navigation
    const agentScript = `
        (function() {
            const proxyBase = "/api/proxy/";
            
            function getProxyUrl(targetUrl) {
                try {
                     const urlObj = new URL(targetUrl);
                     // Only proxy our target domain, otherwise fetch directly (or fail if CORS)
                     // Since we only have one proxy rule for bibleintamil, we blindly append path
                     // But for robustness, we just append the path to proxyBase
                     // ideally we should check if it matches the target domain.
                     return proxyBase + urlObj.pathname.replace(/^\//, '') + urlObj.search;
                } catch(e) { return targetUrl; }
            }
            
            async function processAndLoad(targetUrl, targetFrameName) {
                try {
                    // Fetch through proxy
                    const res = await fetch(getProxyUrl(targetUrl));
                    const text = await res.text();
                    
                    // Parse
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(text, 'text/html');
                    
                    // 1. Inject Base
                    const base = doc.createElement('base');
                    base.href = targetUrl;
                    doc.head.prepend(base);
                    
                    // 2. Rewrite Targets
                    // We remove _top/_parent to prevent breaking out. 
                    // We LEAVE named targets so our click handler can intercept them!
                    doc.querySelectorAll('a, form').forEach(el => {
                        if(el.target === '_top' || el.target === '_parent') el.target = '_self';
                    });
                    
                    // 3. Inject Agent (Self-replication)
                    const script = doc.createElement('script');
                    script.textContent = \`(\${arguments.callee.toString()})();\`;
                    doc.head.appendChild(script);
                    
                    // Create Blob
                    const blob = new Blob([doc.documentElement.outerHTML], { type: 'text/html' });
                    const blobUrl = URL.createObjectURL(blob);

                    // Load into target
                    if (targetFrameName && window.parent.frames[targetFrameName]) {
                        window.parent.frames[targetFrameName].location.href = blobUrl;
                    } else if (targetFrameName && window.top.frames[targetFrameName]) {
                         window.top.frames[targetFrameName].location.href = blobUrl;
                    } else {
                        // Default to self/current location
                        window.location.href = blobUrl;
                    }
                    
                } catch(e) { console.error('Navigation failed', e); }
            }

            document.addEventListener('click', e => {
                const link = e.target.closest('a');
                if (link) {
                     // FIX: Resolve URL using document.baseURI because link.href might be blob-relative
                    const rawHref = link.getAttribute('href');
                    if (!rawHref) return;

                    // Skip named anchors / hash links logic if needed, but for now robustly resolve everything
                    // If it starts with #, handle locally.
                    if (rawHref.startsWith('#')) {
                        // Let browser handle hash on same page
                        return;
                    }

                    e.preventDefault();

                    // Resolve absolute URL against the injected <base>
                    const resolvedUrl = new URL(rawHref, document.baseURI).href;
                    const target = link.target;
                    
                    // Case 1: Cross-Frame Navigation (Named Target)
                    if (target && target !== '_self' && target !== '_top' && target !== '_parent' && target !== '_blank') {
                        // Check if named frame exists in parent
                        processAndLoad(resolvedUrl, target);
                    } 
                    // Case 2: Standard Navigation (Self)
                    else {
                        processAndLoad(resolvedUrl, null);
                    }
                }
            });
        })();
    `;

    useEffect(() => {
        let isMounted = true;
        if (!url) return;

        const processUrl = async (targetUrl) => {
            setIsLoading(true);
            try {
                let proxyUrl = targetUrl;
                try {
                    const urlObj = new URL(targetUrl);
                    if (urlObj.hostname.includes('bibleintamil.com')) {
                        proxyUrl = `/api/proxy/${urlObj.pathname.replace(/^\//, '')}${urlObj.search}`;
                    }
                } catch (e) { console.error('URL parse failed', e); }

                const response = await fetch(proxyUrl);
                const html = await response.text();

                if (!isMounted) return;

                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                // 1. Inject Base Tag
                const base = doc.createElement('base');
                base.href = targetUrl;
                doc.head.prepend(base);

                // 2. Rewrite Targets
                doc.querySelectorAll('a, form').forEach(el => {
                    if (el.target === '_top' || el.target === '_parent') el.target = '_self';
                });

                // 3. Inject Agent Script
                const script = doc.createElement('script');
                script.textContent = agentScript;
                doc.head.appendChild(script);

                // 4. Handle Framesets (Deep Proxy)
                const frames = doc.querySelectorAll('frame');
                if (frames.length > 0) {
                    const framePromises = Array.from(frames).map(async (frame) => {
                        const src = frame.getAttribute('src');
                        if (src) {
                            // Resolve absolute URL
                            const frameUrl = new URL(src, targetUrl).href;

                            // Recursive fetch
                            let frameProxyUrl = frameUrl;
                            if (frameUrl.includes('bibleintamil.com')) {
                                const fUrlObj = new URL(frameUrl);
                                frameProxyUrl = `/api/proxy/${fUrlObj.pathname.replace(/^\//, '')}${fUrlObj.search}`;
                            }
                            const frameRes = await fetch(frameProxyUrl);
                            const frameHtml = await frameRes.text();

                            const frameDoc = parser.parseFromString(frameHtml, 'text/html');

                            // Inject Base/Agent into Frame
                            const frameBase = frameDoc.createElement('base');
                            frameBase.href = frameUrl;
                            frameDoc.head.prepend(frameBase);

                            const frameScript = frameDoc.createElement('script');
                            frameScript.textContent = agentScript;
                            frameDoc.head.appendChild(frameScript);

                            // Rewrite targets
                            frameDoc.querySelectorAll('a, form').forEach(el => {
                                if (el.target === '_top' || el.target === '_parent') el.target = '_self';
                            });

                            const blob = new Blob([frameDoc.documentElement.outerHTML], { type: 'text/html' });
                            frame.src = URL.createObjectURL(blob);
                        }
                    });
                    await Promise.all(framePromises);
                }

                const blob = new Blob([doc.documentElement.outerHTML], { type: 'text/html' });
                const blobUrl = URL.createObjectURL(blob);
                setBlobUrl(blobUrl);

            } catch (error) {
                console.error("Failed to load resource", error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        processUrl(url);

        return () => {
            isMounted = false;
            if (blobUrl) URL.revokeObjectURL(blobUrl);
        };
    }, [url]);

    if (!url) return null;

    return (
        <div className="h-screen flex flex-col bg-bible-dark text-white">
            {/* Header */}
            <motion.div
                className="flex items-center justify-between p-4 bg-neutral-900 border-b border-neutral-800 z-10"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-full bg-neutral-800 text-bible-gold hover:bg-neutral-700 transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h2 className="text-lg font-bold text-bible-gold truncate max-w-[200px] sm:max-w-md">
                        {title}
                    </h2>
                </div>

                {/* External Link fallback */}
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-white"
                    title="Open in Browser"
                >
                    <ExternalLink size={20} />
                </a>
            </motion.div>

            {/* Content Area */}
            <div className="flex-1 relative bg-white">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-neutral-900 z-0">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 rounded-full border-2 border-bible-gold border-t-transparent animate-spin"></div>
                            <span className="text-gray-400 text-sm">Loading content...</span>
                        </div>
                    </div>
                )}

                {blobUrl && (
                    <iframe
                        ref={iframeRef}
                        src={blobUrl}
                        className="w-full h-full border-0 absolute inset-0 z-10"
                        title={title}
                        // Allow-same-origin is critical for Blob URL communication and enabling window.parent.frames
                        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
                    />
                )}
            </div>
        </div>
    );
};

export default ResourceViewer;
