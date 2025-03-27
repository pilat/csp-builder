// Import modules
import { cspDirectives } from './js/cspDirectives.js';
import { Utils } from './js/utils.js';
import { Templates } from './js/templates.js';
import { DirectiveManager } from './js/directiveManager.js';
import { CSPParser } from './js/cspParser.js';

// Initialize application
let directiveManager, cspParser;

document.addEventListener('DOMContentLoaded', () => {
    // Create scroll to top button
    const scrollButton = document.createElement('div');
    scrollButton.className = 'scroll-to-top';
    scrollButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 4l-8 8h6v8h4v-8h6z"/>
        </svg>
    `;
    document.body.appendChild(scrollButton);

    // Show/hide scroll button based on scroll position
    const toggleScrollButton = () => {
        scrollButton.classList.toggle('visible', window.scrollY > 200);
    };

    // Smooth scroll to top when clicked
    scrollButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Listen for scroll events
    window.addEventListener('scroll', toggleScrollButton);
    toggleScrollButton(); // Initial check

    const outputElement = document.getElementById('csp-output');
    
    // Wrap output textarea in a div and add copy button
    const outputWrapper = document.createElement('div');
    outputWrapper.className = 'output-wrapper';
    outputElement.parentNode.insertBefore(outputWrapper, outputElement);
    outputWrapper.appendChild(outputElement);
    
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
        </svg>
    `;
    copyButton.title = "Copy to clipboard";
    outputWrapper.appendChild(copyButton);
    
    // Add click handler for copy button
    copyButton.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(outputElement.value);
            
            // Visual feedback
            const originalSVG = copyButton.innerHTML;
            copyButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
            `;
            copyButton.style.fill = '#4CAF50';
            
            // Revert back after 1.5 seconds
            setTimeout(() => {
                copyButton.innerHTML = originalSVG;
                copyButton.style.fill = '';
            }, 1500);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    });

    // Add focus to output textarea
    outputElement.focus();

    directiveManager = new DirectiveManager(
        document.getElementById('directives-container'),
        outputElement
    );

    cspParser = new CSPParser(directiveManager);

    // Setup event listeners
    document.getElementById('parse-csp').addEventListener('click', () => cspParser.showOverlay());

    // Handle keyboard input and paste events on the output textarea
    outputElement.addEventListener('keypress', (e) => {
        if (e.key && e.key.length === 1) { // Only handle printable characters
            e.preventDefault();
            cspParser.showOverlay();
            // Wait for overlay to be created and input to be focused
            setTimeout(() => {
                const overlayInput = document.getElementById('csp-input');
                if (overlayInput) {
                    overlayInput.value = e.key;
                    overlayInput.selectionStart = overlayInput.selectionEnd = 1;
                }
            }, 0);
        }
    });

    outputElement.addEventListener('paste', (e) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text');
        if (pastedText) {
            cspParser.showOverlay();
            // Wait for overlay to be created and input to be focused
            setTimeout(() => {
                const overlayInput = document.getElementById('csp-input');
                if (overlayInput) {
                    overlayInput.value = pastedText;
                    cspParser.parse(pastedText, document.getElementById('overlay-load'));
                }
            }, 0);
        }
    });
});