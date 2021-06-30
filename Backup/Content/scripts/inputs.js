const FloatLabel = (() => {
    // add active class
    const handleFocus = (e) => {
        const target = e.target;
        target.parentNode.classList.add("active");
        target.parentNode.classList.add("focus");

        var placeholder = target.getAttribute("data-placeholder");
        if (placeholder) {
            target.setAttribute("placeholder", placeholder);
        }
    };

    // remove active class
    const handleBlur = (e) => {
        const target = e.target;
        if (!target.value) {
            target.parentNode.classList.remove("active");
        }
        target.parentNode.classList.remove("focus");
        target.removeAttribute("placeholder");
    };

    // register events
    const bindEvents = (floatField) => {
        // const floatField = element.querySelector("input");
        floatField.addEventListener("focus", handleFocus);
        floatField.addEventListener("blur", handleBlur);
    };

    // get DOM elements
    const init = () => {
        const floatContainers = document.querySelectorAll(".float-container");

        floatContainers.forEach((element) => {
            let input = element.querySelector("input");
            let select = element.querySelector("select");

            if (input) {
                bindEvents(input);

                if (input.value) {
                    element.classList.add("active");
                }
            }

            if (select) {
                if (select.value) {
                    element.classList.add("active");
                }
                bindEvents(select);
            }
        });
    };

    return {
        init: init,
    };
})();

$(document).ready(function () {
    FloatLabel.init();
});