document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("commandInput");
    const output = document.getElementById("output");
    const terminal = document.getElementById("terminal-container");
    const hint = document.getElementById("autocompleteHint");
    const mirror = document.getElementById("inputMirror");

    let commandHistory = [];
    let historyIndex = -1;

    const helpMessage = `
    <b>💻 System Commands:</b><br>
    <b>help or h</b>        - Show available commands<br>
    <b>clear or cls</b>       - Clear the terminal<br>
    <b>neofetch or fetch</b>    - Display system info (Arch Linux style)<br>
    <br>
    <b>👤 Personal Information:</b><br>
    <b>whoami</b>      - Display my identity<br>
    <b>skills</b>      - Show my technical skills<br>
    <b>projects</b>    - List my featured projects<br>
    <b>experience</b>      - Display my Experience<br>
    <b>others</b>      - Show my management/soft skills<br>
    <br>
    <b>🌐 Online Profiles:</b><br>
    <b>linkedin or ln</b>    - Open my LinkedIn profile<br>
    <b>github or gh</b>      - Open my GitHub profile<br>
    <br>
    <b>📄 Documents:</b><br>
    <b>resume or r</b>      - Download my resume<br>
    `;

    const commands = {
        help: helpMessage,
        neofetch: () => {
            let currentTime = new Date().toLocaleTimeString();
            return `<pre>
        <span class="blue">      /\\      </span>  User: Shivam_Maheshwari
        <span class="blue">     /  \\     </span>  OS: Ubuntu
        <span class="blue">    /    \\    </span>  Hostname: https://shivam7400.github.io/Portfolio/
        <span class="blue">   /  /\\  \\   </span>  Time: ${currentTime}
        <span class="blue">  /  (--)  \\  </span>  Email: <a href="mailto:shivammaheshwari317@gmail.com" class="custom-link">shivammaheshwari317@gmail.com</a>
        <span class="blue"> /  /    \\  \\ </span>  GitHub: <a href="https://github.com/Shivam7400" target="_blank" class="custom-link">github.com/Shivam7400</a>
        <span class="blue">/___\\    /___\\</span>  LinkedIn: <a href="https://www.linkedin.com/in/shivammaheshwari317" target="_blank" class="custom-link">linkedin.com/in/shivammaheshwari317/</a>    </pre>`;
        },

        github: () => {
            window.open("https://github.com/Shivam7400", "_blank");
            return `Opening <a href="https://github.com/Shivam7400" target="_blank" class="custom-link">GitHub/Shivam7400</a>...`;
        },

        linkedin: () => {
            window.open("https://www.linkedin.com/in/shivammaheshwari317", "_blank");
            return `Opening <a href="https://www.linkedin.com/in/shivammaheshwari317" target="_blank" class="custom-link">LinkedIn/shivammaheshwari317</a>...`;
        },

        projects: `
        - Food Menu Website: Developed a Django-based application that allows users and restaurants to register and manage their menus. Designed and implemented a secure user authentication system for a custom dashboard, allowing restaurant owners to manage offerings effortlessly; resulting in a smoother onboarding process for 25+ new clients.<br><br>
        - Video Streaming Website: Video Stream is an online video streaming platform of TV content and movies across 9 languages, and every major sport covered live and many more.<br><br>
        - Material Management Website: Managed material inventory across stores, factory, and organizations, while also handling customer billing and invoicing.
        `,
        experience: `
        <b><u>Python Software Developer</u> | Manupatra Technology, Information and Internet | Noida (U.P.) | SEPT 2024 – PRESENT</b></br>
        Experienced Python developer skilled in web scraping (BeautifulSoup, Scrapy, Selenium), web development (Flask, Django), databases (SQL, MongoDB).<br>
        - Upgraded previous crawling scripts to use Requests and Scrapy for improved speed, efficiency, and data cleaning formatting & transformation.<br>
        - Developed captcha models to detect and solve captchas, improving data crawling efficiency using Keras, OpenCV and Tesseract.<br>
        - Built APIs with Flask to provide extracted data preprocess, and store case data in MSSQL, with automated email notifications for updates to user<br><br><br>
        
        <b><u>Python & Django Developer</u> | BytesView Analytics | Noida (U.P.) | JUNE 2022 – AUG 2024</b></br>
        Implemented features in their Scrapy project & Django Backend Development</br>
        - Updated the Scrapy project (NewsDataFeeds) to use fast crawling techniques, boosting data retrieval speed by 60% and data cleaning formatting & transformation.</br>
        - Developed Python scripts to automate daily tasks, saving 16 hours per week with customizable functionality using Selenium.</br>
        - Revamped the Django dashboard, streamlining functions and improving loading speed, reducing user issues by 25% and boosting satisfaction.</br>
        - Implemented a project to record operations performed on the Django dashboard, generating SQL query files for efficient tracking and audit purposes
        `,
        skills: `
        - Python Backend Development<br>
        - Python: Flask, FastApi, Django, Scrapy, Selenium<br>
        - JavaScript: JS, Ajex, jQuery<br>
        - Database: MySQL, MongoDB, Redis<br>
        - Version Control: Git<br>
        - CI/CD: Docker, GitHub CI/CD, Bash Script<br>
        - Cloud: AWS<br>
        - Tools: Postman<br>
        - OS: Ubuntu, Windows
        `,
        others: `
        - Rapid learner with a strong ability to adapt to new technologies<br>
        - Strong communication and interpersonal skills<br>
        - Strong problem-solving skills
        `,
        whoami: `<a href="https://www.linkedin.com/in/shivammaheshwari317" class="custom-link">Shivam Maheshwari</a> | <b>Python Backend Developer</b>`,

        resume: () => {
            const link = document.createElement("a");
            link.href = "resume.pdf";
            link.download = "Shivam_Resume.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            return "Downloading resume...";
        },

        clear: () => resetTerminal(),
        exit: () => resetTerminal(),
    };

    const aliases = {
        gh: "github",
        ln: "linkedin",
        r: "resume",
        cls: "clear",
        h: "help",
        fetch: "neofetch"
    };

    const commandList = Object.keys(commands).concat(Object.keys(aliases));

    function processCommand(cmd) {
        cmd = cmd.toLowerCase();
        if (cmd === "") {
            output.scrollTop = output.scrollHeight;
            return;
        }

        commandHistory.push(cmd);
        historyIndex = commandHistory.length;

        if (aliases[cmd]) cmd = aliases[cmd];

        if (cmd === "clear" || cmd === "exit") {
            resetTerminal();
            return;
        }

        let response = typeof commands[cmd] === "function" ? commands[cmd]() : commands[cmd] || getClosestCommand(cmd);
        appendCommand(cmd, response);
    }

    function resetTerminal() {
        output.innerHTML = `<div class="help-message">Type 'help' to see available commands.</div>`;
        input.value = "";
        hint.textContent = "";
    }

    function appendCommand(command, result) {
        let commandLine = document.createElement("div");
        commandLine.classList.add("command-line");
        commandLine.innerHTML = `<span class="prompt">λ</span> ${command}`;
        output.appendChild(commandLine);

        let resultLine = document.createElement("div");
        resultLine.classList.add("command-result");
        resultLine.innerHTML = result;
        output.appendChild(resultLine);

        input.scrollIntoView({ behavior: "smooth" });
    }

    function getClosestCommand(inputCmd) {
        let closestMatch = commandList.find(cmd => cmd.startsWith(inputCmd));
        return closestMatch ? `Did you mean <b>${closestMatch}</b>?` : `Command not found: ${inputCmd}`;
    }

    function updateAutocompleteHint() {
        let currentInput = input.value;
        if (!currentInput) {
            hint.textContent = "";
            return;
        }
        let match = commandList.find(cmd => cmd.startsWith(currentInput));
        if (match) {
            hint.textContent = match.slice(currentInput.length);
            mirror.textContent = currentInput;
            hint.style.left = mirror.offsetWidth + "px";
        } else {
            hint.textContent = "";
        }
    }

    function autocompleteCommand() {
        let currentInput = input.value;
        if (!currentInput) return;
        let match = commandList.find(cmd => cmd.startsWith(currentInput));
        if (match) input.value = match;
        hint.textContent = "";
    }

    function createCommandBar() {
        const bar = document.getElementById("command-bar");
    
        const allCommands = Object.keys(commands);
    
        [...allCommands].sort().forEach(cmd => {
            const button = document.createElement("button");
            button.textContent = cmd;
            button.dataset.cmd = cmd;
            button.addEventListener("click", () => {
                processCommand(cmd);
            });
            bar.appendChild(button);
        });
    }

    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            processCommand(input.value.trim());
            input.value = "";
            hint.textContent = "";
        } else if (event.key === "ArrowRight" || event.key === "Tab") {
            event.preventDefault();
            autocompleteCommand();
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                input.value = commandHistory[historyIndex];
            }
        } else if (event.key === "ArrowDown") {
            event.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                input.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                input.value = "";
            }
        }
    });

    input.addEventListener("input", updateAutocompleteHint);

    terminal.addEventListener("click", function () {
        input.focus();
    });

    resetTerminal();
    createCommandBar();
});
