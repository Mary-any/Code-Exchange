// speak.ts
export function shiftFocus(direction: "left" | "right" | "up" | "down"): void {
    // Get all focusable elements within the document
    const focusableElements: NodeListOf<HTMLElement> = document.querySelectorAll(
        "a, button, input, [tabindex], *[tabindex], *[contenteditable], *[role], select, textarea, .question-container"
    );

    // Find the currently focused element
    const currentIndex: number = Array.from(focusableElements).indexOf(document.activeElement as HTMLElement);

    // Calculate the new index based on the direction
    let newIndex: number = -1; // Initialize with a default value
    if (direction === "left") {
        newIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1;
    } else if (direction === "right") {
        newIndex = currentIndex < focusableElements.length - 1 ? currentIndex + 1 : 0;
    } else if (direction === "up") {
        newIndex = currentIndex - 1;
    } else if (direction === "down") {
        newIndex = currentIndex + 1;
    }

    // Ensure newIndex stays within bounds
    newIndex = (newIndex + focusableElements.length) % focusableElements.length;

    // Remove the highlight from the currently focused element
    (document.activeElement as HTMLElement)?.classList.remove("highlight");

    // Set focus on the new element
    (focusableElements[newIndex] as HTMLElement)?.focus();

    // Highlight the newly focused element
    (focusableElements[newIndex] as HTMLElement)?.classList.add("highlight");

    // Speak the word (you may need to implement text-to-speech functionality)
    const spokenWord: string | undefined =
        (focusableElements[newIndex] as HTMLElement)?.innerText ||
        (focusableElements[newIndex] as HTMLInputElement)?.value;
    if (spokenWord) {
        speakWord(spokenWord);
    }
}


export function speakWord(word: string): void {
    // Implement text-to-speech functionality here
    // For example, you can use the SpeechSynthesis API
    const utterance: SpeechSynthesisUtterance = new SpeechSynthesisUtterance(word);
    speechSynthesis.speak(utterance);
}

window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
        shiftFocus("left");
    } else if (event.key === "ArrowRight") {
        shiftFocus("right");
    } else if (event.key === "ArrowUp") {
        shiftFocus("up");
    } else if (event.key === "ArrowDown") {
        shiftFocus("down");
    }
});

