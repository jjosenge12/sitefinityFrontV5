$(document).ready(function () {
  const FloatLabel = (() => {
    // add active class
    const handleFocus = (e) => {
      const target = e.target;
      target.parentNode.classList.add("active");

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
          if (input.value) {
            element.classList.add("active");
          }

          bindEvents(input);
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

  const NumericInput = (() => {
    const handleKeyDown = (e) => {
      var input = $(`#${e.target.id}`)[0];
      if (e.key === "Backspace") {
        e.preventDefault();

        if (input.value) {
          input.value = "";
        } else if (input.previousSibling) {
          input.previousSibling.focus();
          input.previousSibling.value = "";
        }
      } else if (e.key >= "0" && e.key <= "9") {
        e.preventDefault();
        input.value = e.key;
        if (input.nextSibling) {
          input.nextSibling.focus();
        }
      }
    };

    const handlePaste = function (e) {
      e.preventDefault();
      var content = (e.clipboardData || window.clipboardData).getData("text");
      var input = $(this).parent()[0].children[0],
        inputs = $(this).parent()[0].children;

      $(inputs).each(function () {
        this.value = "";
      });

      var i = 0;
      while (i < content.length && input) {
        if (content[i] >= "0" && content[i] <= "9") {
          input.value = content[i];
          input = input.nextSibling;
        }

        i++;
      }

      if (input) {
        input.focus();
      } else {
        $(inputs[inputs.length - 1]).focus();
      }
    };

    const bindEvents = (x) => {
      x.addEventListener("keydown", handleKeyDown);
      x.addEventListener("paste", handlePaste);
    };

    const init = () => {
      var containers = document.querySelectorAll(".numericInputContainer");
      containers.forEach((element) => {
        for (let i = 0; i < Number(element.dataset.length); i++) {
          var newInput = document.createElement("input");
          newInput.max = "9";
          newInput.maxLength = "9";
          newInput.type = "number";
          newInput.classList.add("numericInput");
          newInput.id = element.id + "-" + i;
          newInput.dataset.index = i;
          newInput.dataset.length = element.dataset.length;
          newInput.style = "width: calc(100%/" + element.dataset.length + ");";

          bindEvents(newInput);
          element.append(newInput);
        }
      });
    };

    return {
      init,
    };
  })();

  FloatLabel.init();
  NumericInput.init();

  $("#openMenuBtn").click(function () {
    $(this).hide();
    $("#closeMenuBtn").show();

    $("#menu").show("slide", { direction: "right" });
  });

  $("#closeMenuBtn").click(function () {
    $(this).hide();
    $("#openMenuBtn").show();

    $("#menu").hide("slide", { direction: "right" });
  });

  $(".sectionTitle").click(function(){
    console.log(this.querySelector("span"));
    $(`#${this.id}Arrow`).toggleClass("pointRight pointDown");
    $(`#${this.id}Content`).slideToggle();
  });

  $(".continue-btn").click(function () {
    $.when(
      $(`#${this.dataset.collapse}Arrow`).addClass("pointRight"),
      $(`#${this.dataset.collapse}Arrow`).removeClass("pointDown"),
      $(`#${this.dataset.collapse}Content`).slideUp(),
      $(`#${this.dataset.expand}Arrow`).addClass("pointDown"),
      $(`#${this.dataset.expand}Arrow`).removeClass("pointRight"),
      $(`#${this.dataset.expand}Content`).slideDown()
    ).done(() => {
      $("html, body").animate(
        {
          scrollTop: $(`#${this.dataset.expand}`).offset().top,
        },
        300
      );
    });
  });
});
