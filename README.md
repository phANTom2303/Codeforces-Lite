# Codeforces Lite

#### A sidebar Chrome extension that enhances Codeforces, making it a more productive platform for competitive programmers.

[![Chrome Web Store](https://i.imgur.com/iswHnpJ.png)](https://chromewebstore.google.com/detail/codeforces-lite/hgcgfmgjkfjmhoebifgmbfipinkkjgco)

---

# Overview

![Hero Section](/public/assets/images/preview1.png)

#### **Codeforces Lite** brings a more refined experience for competitive programmers on Codeforces.
#### From enhanced UI elements and dark theme, to a fully functional code editor, this extension provides everything you need for a seamless coding experience on Codeforces.

---

# Features

## 1. Built-in Code Editor with Code Save capabilities

![Code Editor](/public/assets/images/preview2.png)

#### With Codeforces Lite, you can now write, time, and submit code directly from the problem page. No need to switch tabs or upload files manually.

Key features include:
- Default language selector for easy switching between programming languages.
- Adjustable font size for a customized coding experience.
- Built-in timer for practicing timed coding problems.
- Options to reset your code and automatic tab indentation.

 Along with this, your submitted codes are saved locally and can be retrieved when you revisit the same problem. The storage system is designed to handle over 1000+ code files, with each file being up to 200+ lines long, by automatically managing storage and deleting older codes to make space for newer ones.

 This is done by an efficient storage management system using HashMap and Queue.

## 2. Dark Theme

![Dark Theme Support](/public/assets/images/preview3.png)

#### Codeforces Lite offers a highly optimized dark theme designed to provide a more visually comfortable experience, especially during extended coding sessions. The dark theme ensures a consistent look throughout the entire platform.

#### Key features of the dark theme include:

- **Eye Comfort:** The dark theme reduces eye strain by minimizing the contrast between the screen and the environment, particularly in low-light conditions.
- **Battery Efficiency:** On devices with OLED or AMOLED screens, the dark theme can help conserve battery life by reducing the energy used to display brighter pixels.
- **Code Readability:** Syntax highlighting is optimized for better readability in dark mode, ensuring that different elements in the code—such as keywords, variables, and comments—stand out clearly without causing visual fatigue.
- **User Control:** You can toggle the dark theme on or off based on your preferences, allowing you to switch between light and dark modes seamlessly.


## 3. Custom Templates and Default Cursor Placement

#### With Codeforces Lite, you can set up custom templates that automatically load whenever you start solving a new problem. This feature helps you avoid the repetitive task of setting up your environment or writing boilerplate code from scratch.

#### By predefining your commonly used template (such as input/output functions, imports, or debugging statements), you can focus directly on problem-solving, improving your speed and efficiency during contests or practice sessions.

#### Additionally, you can specify the exact position for your cursor using the `$0` symbol in your template, allowing you to start typing right where you need. The extension also remembers the cursor’s position when switching tabs and revisiting problems, ensuring you pick up exactly where you left off—saving valuable time during contests.

## 4. UI Enhancements

![UI Enhancements](/public/assets/images/preview4.png)

#### Codeforces Lite enhances the overall UI of Codeforces by making it more accessible, visually appealing, and user-friendly.

#### Elements are optimized for better positioning, creating a clean and intuitive interface for seamless navigation.

- Improved alignment of the problemset page for a more structured look.
- Redesigned login and register pages for a smoother user experience.
- Customized dark theme for various extension components to ensure consistency with our dark theme design.
- **User Control:** You can easily toggle the `Change UI` option on or off according to your preferences, allowing you to switch seamlessly between the default user interface and the enhanced version.

---

## Local Setup for Developers

#### To set up Codeforces Lite locally, follow these steps:

1. Fork the repository through github

    ```bash
    git clone <Your Forked Repo>
    ```

2. Install the dependencies:

    ```bash
    npm i
    ```

3. Build the project whenever you want to see the changes you made:

    ```bash
    npm run build
    ```

4. To add the extension to Chrome:

    - Open Chrome and navigate to [chrome extensions](chrome://extensions/) or Manage extensions
    - Enable "Developer mode" in the top right corner.
    - Click "Load unpacked" and select the `dist` folder from the project.

![Core Developers](/public/assets/images/extensionguide.png)

---

## How To Contribute?

#### Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**. Follow the steps below to get involved:

1. Check for issues or features that need work [here](https://github.com/MaanasSehgal/Codeforces-Lite/issues) if you want to improve existing features. If you wish to implement a feature of your own, raise an issue and start working on it to keep track of your progress.

2. In your forked repo, create a branch for the feature or bug fix you're working on.
    ```bash
    git checkout -b bug/<bug-name>
    ```
    ```bash
    git checkout -b feature/<feature-name>
    ```
3. Make sure to properly handle any errors and ensure the feature is production-ready.
4. Write down proper commit messages which explain what you have fixed or what you have implemented.

    ```bash
    git commit -m "feat: Implemented real-time code submission status to display submission updates without page redirects, improving user experience"

    git push origin <your-branch-name>
    ```

5. Once you are ready, create a pull request (PR) for review:
    - Go to the repository on GitHub.
    - Click on "Pull requests" and create a new PR for your branch.
    - Properly list down the changes in your PR message.
6. Your PR will be reviewed and merged upon approval.

## Core Developers

![UI Improvement Example](/public/assets/images/preview5.png)


| Developer                | LinkedIn                                                     | GitHub                                           |
| ------------------------ | ------------------------------------------------------------ | ------------------------------------------------ |
| **Maanas Sehgal**        | [LinkedIn](https://www.linkedin.com/in/maanassehgal/)        | [GitHub](https://github.com/MaanasSehgal)        |
| **Devendra Suryavanshi** | [LinkedIn](https://www.linkedin.com/in/devendrasuryavanshi/) | [GitHub](https://github.com/devendrasuryavanshi) |

# Thanks for using our extension!