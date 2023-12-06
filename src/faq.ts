const faqs: NodeListOf<Element> = document.querySelectorAll(".faq");

faqs.forEach((faq: Element) => {
    faq.addEventListener("click", () => {
        faq.classList.toggle("active");
    });
});



// search-bar
function searchQuestions (): void {
    const searchInput: HTMLInputElement | null = document.getElementById("searchInput") as HTMLInputElement;

    if (searchInput) {
        const searchTerm: string = searchInput.value.toLowerCase();
        const faqs: NodeListOf<Element> = document.querySelectorAll(".faq");

        faqs.forEach((faq: Element) => {
            const question: HTMLHeadingElement | null = faq.querySelector("h3");
            if (question) {
                const questionText: string = question.innerText.toLowerCase();
                const isVisible: boolean = questionText.includes(searchTerm);

                if (isVisible) {
                    faq.classList.add("active");
                } else {
                    faq.classList.remove("active");
                }
            }
        });
    }
}

// Event Listener for the button
const searchButton: HTMLButtonElement | null = document.querySelector(".search-bar button");
if (searchButton) {
    searchButton.addEventListener("click", searchQuestions);
}
