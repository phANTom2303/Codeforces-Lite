document.addEventListener("DOMContentLoaded", function () {
    const inputElements = document.querySelectorAll(".input pre");
    const outputElements = document.querySelectorAll(".output pre");

    if (inputElements.length !== outputElements.length) {
        console.error("Mismatch between input and output elements");
        return;
    }

    const testCases = [];

    inputElements.forEach((inputElement, index) => {
        const inputValue = inputElement.innerText.trim();
        const outputValue = outputElements[index].innerText.trim();

        testCases.push({
            Testcase: index + 1,
            Input: inputValue,
            ExpectedOutput: outputValue,
        });
    });

    console.log(JSON.stringify(testCases, null, 2));
});
