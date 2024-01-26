import "./config";
import { api, session, url } from "@hboictcloud/api";

console.log("script is working");

// Interface for the Question object
interface Question {
    userId: number;
    questionId: number;
    question: string;
    questionSnippet: string;
    questionDate: number;
}

// Interface for the Question object with answer count
interface QuestionWithAnswerCount extends Question {
    answerCount?: number; // Make answerCount optional
}

// Function to get user information by ID from the database
async function getUserById(userId: number): Promise<string | undefined> {
    try {
        const userData: any = await api.queryDatabase("SELECT username FROM user WHERE userId = ?", [userId]);
        if (userData && userData.length > 0) {
            return userData[0].username;
        } else {
            console.warn("No user found for userId:", userId);
            return undefined;
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        return undefined;
    }
}

// Function to insert questions into the website
async function insert(): Promise<void> {
    try {
        console.log("inside insert...");

        // Get questions from the database
        const questions: QuestionWithAnswerCount[] | undefined = await getQuestionsWithAnswerCount();
        console.log("Retrieved questions:", questions);

        // Get the HTML element that will contain the questions
        const questionsContainer: HTMLElement | null = document.getElementById("questionInfo");

        if (questionsContainer && questions && questions.length > 0) {
            for (let i: number = 0; i < questions.length; i++) {
                const questionDiv: HTMLDivElement = document.createElement("div");
                questionDiv.classList.add("question-container");

                const question: QuestionWithAnswerCount = questions[i];

                // Get the username associated with the question's userId
                const username: string | undefined = await getUserById(question.userId);

                if (username) {
                    const questionHTML: string =
                        `<div class="question">
                            <h2>Question ${i + 1}</h2>
                            <p>User: ${username}</p>
                            <p>Question: ${question.question}</p>
                            <p>Date: ${question.questionDate}</p>
                            <p>Answer Count: ${question.answerCount}</p>
                        </div>`;

                    questionDiv.innerHTML = questionHTML;

                    // Get user information from session
                    const loggedInUserId: number | undefined = session.get("user");
                    console.log("User ID from session:", loggedInUserId);

                    // Check if the logged-in user information is available
                    if (loggedInUserId) {
                        // Continue with the existing logic
                        // Add click event listener to each question
                        questionDiv.addEventListener("click", () => {
                            // Set session data for the clicked question
                            session.set("questionId", question.questionId);
                            // Redirect to answer.html
                            window.location.href = `/answer.html?id=${question.questionId}`;
                        });

                        // Append the questionDiv to questionsContainer after adding the click event listener
                        questionsContainer.appendChild(questionDiv);
                    } else {
                        console.error("User information not found in the session.");
                    }

                    console.log("Session after:", session);

                    // Add click event listener to each question
                    questionDiv.addEventListener("click", () => {
                        // Set session data for the clicked question
                        session.set("questionId", question.questionId);
                        // Redirect to answer.html
                        window.location.href = `/answer.html?id=${question.questionId}`;
                    });

                    // Append the questionDiv to questionsContainer after adding the click event listener
                    questionsContainer.appendChild(questionDiv);
                } else {
                    console.error("No username retrieved for userId:", question.userId);
                }
            }
        } else {
            console.error("No questions retrieved");
        }
    } catch (error: any) {
        console.error(error);
    }
}

// Function to get questions from the database with the count of answers
async function getQuestionsWithAnswerCount(): Promise<QuestionWithAnswerCount[] | undefined> {
    try {
        const data: Array<any> = await api.queryDatabase(`
            SELECT q.*, COALESCE(COUNT(a.answerId), 0) AS answerCount
            FROM question q
            LEFT JOIN answer a ON q.questionId = a.questionId
            GROUP BY q.questionId
            ORDER BY q.questionDate DESC
        `) as Array<any>;

        return data.map((item: any) => ({
            userId: item["userId"],
            questionId: item["questionId"],
            question: item["question"],
            questionSnippet: item["questionSnippet"],
            questionDate: item["questionDate"],
            answerCount: item["answerCount"], // No need for undefined handling here
        }));
    } catch (error) {
        console.error("Error fetching questions with answer count:", error);
        return undefined;
    }
}


// Function to get questions from the database
async function getQuestions(): Promise<Question[] | undefined> {
    try {
        const data: Array<any> = await api.queryDatabase("SELECT * FROM question ORDER BY questionDate DESC") as Array<any>;
        return data.map((item: any) => ({
            userId: item["userId"],
            questionId: item["questionId"],
            question: item["question"],
            questionSnippet: item["questionSnippet"],
            questionDate: item["questionDate"],
        }));
    } catch (error) {
        console.error("Error fetching questions:", error);
        return undefined;
    }
}

// Call the insert function
insert();

