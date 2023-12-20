document.addEventListener("DOMContentLoaded", () => {
    const options: NodeListOf<HTMLLIElement> = document.querySelectorAll("#read li");

    options.forEach(option => {
        option.addEventListener("mouseover", speakOption);
        option.addEventListener("focus", speakOption);
    });
});

function speakOption(event: MouseEvent | FocusEvent): void {
    const target : any = event.target as HTMLLIElement;
    const textToSpeak: string = target.innerText.trim();

    if ("speechSynthesis" in window) {
        const synth: SpeechSynthesis = window.speechSynthesis;
        const utterance: SpeechSynthesisUtterance = new SpeechSynthesisUtterance(textToSpeak);

        // Speak the text
        synth.speak(utterance);
    }
}
