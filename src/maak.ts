import "./config";
import { api, session, } from "@hboictcloud/api";

interface FormData {
    questionOrCodeSnippet: string;
    expertiseLevel: string;
    dateTime: string;
    formType: string; // Added to distinguish between question and code snippet forms
}

document.addEventListener("DOMContentLoaded", () => {
    const questionForm: any = document.getElementById("questionForm");
    const codeSnippetForm: any = document.getElementById("codeSnippetForm");

    if (questionForm && codeSnippetForm) {
        questionForm.addEventListener("submit", (event) => handleSubmit(event, "question"));
        codeSnippetForm.addEventListener("submit", (event) => handleSubmit(event, "codeSnippet"));
    }
});

function handleSubmit(event: Event, formType: string): void {
    event.preventDefault();

    const form: HTMLFormElement = event.target as HTMLFormElement;
    const textareaInput: HTMLTextAreaElement | null = form.querySelector("textarea");
    const dropdown: HTMLSelectElement | null = document.getElementById("expertiseDropdown") as HTMLSelectElement;
    const datetimeInput: HTMLInputElement | null = document.getElementById("datetimeInput") as HTMLInputElement;

    if (textareaInput && dropdown && datetimeInput) {
        const formData: FormData = {
            questionOrCodeSnippet: textareaInput.value,
            expertiseLevel: dropdown.value,
            dateTime: datetimeInput.value,
            formType: formType, // Indicate the source form type
        };

        const formDataKey: any = "formDataKey";
        const existingData: any = localStorage.getItem(formDataKey);

        if (existingData) {
            const storedData: FormData[] = JSON.parse(existingData);
            storedData.push(formData);
            localStorage.setItem(formDataKey, JSON.stringify(storedData));
        } else {
            localStorage.setItem(formDataKey, JSON.stringify([formData]));
        }

        console.log(`Form Data from ${formType} Form stored in Local Storage:`, formData);
    }
}
