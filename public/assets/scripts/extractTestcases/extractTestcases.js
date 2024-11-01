document.addEventListener("DOMContentLoaded", function () {
    const sampleTests = document.querySelectorAll(".sample-test");
    const testCases = [];
    let caseNumber = 1;

    sampleTests.forEach((sampleTestDiv) => {
        const inputs = sampleTestDiv.querySelectorAll(".input pre");
        const outputs = sampleTestDiv.querySelectorAll(".output pre");

        if (inputs.length !== outputs.length) {
            console.error("Mismatch between input and output elements.");
            return;
        }

        inputs.forEach((inputElement, index) => {
            const inputValue = inputElement.innerText.trim();
            const outputValue = outputs[index].innerText.trim();

            testCases.push({
                Testcase: caseNumber++,
                Input: inputValue,
                ExpectedOutput: outputValue,
            });
        });
    });

    console.log(JSON.stringify(testCases, null, 2));
});
