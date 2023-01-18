
// variables declaration.
const imgCount = 20;
const imageHeight = "250px";
let startTime = 0, endTime = 0, imageValue = [], finalImgPredictions = [];

// displaying text at center of the screen
$("<div id='initialText' >Choose a Backend to see the total duration </div>")
    .css({
        "position": "absolute",
        "left": "50%",
        "top": "50%",
        "transform": "translate(-50%, -50%)",
        "text-align": "center"
    }).appendTo("body");


// creates multiple rows & columns.
const container = document.getElementById("container");
let displayImageHTMlContent = () => {
    document.getElementById('durationTime').innerHTML = `<div class="spinner-grow spinner-grow-sm mt-1 ml-1" role="status"></div>`
    // for (let i = 0; i < 1; i++) {
    const row = document.createElement("div");
    row.classList.add("row");
    row.classList.add('mt-5');
    console.log("imgCount", imgCount)
    for (let j = 0; j < imgCount; j++) {
        const col = document.createElement("div");
        col.classList.add("col-sm-3");
        col.classList.add("d-flex");
        col.innerHTML = `<div class="card rounded flex-fill mt-2 shadow">
        <img class="image" id="img${j + 1}" src="../../assets/images/imageClassification/${j + 1}.jpeg" alt="...">
        <div class="card-footer text-center fw-bold text-capitalize">
          <div class="spinner-grow spinner-grow-sm" role="status" id="spinner${j + 1}"></div>
            <p id="imgval${j + 1}"></p>
        </div>`;
        row.appendChild(col);
        // }

        container.appendChild(row);
    }
    $('.image').css({ "height": imageHeight });
}

// this function will be triggered on change of value in dropdown.
$("#backendDP").change(function () {
    imageValue = [];
    finalImgPredictions = [];
    let value = $(this).val();
    console.log("value", value);
    if (value !== "select") {
        $('#initialText').hide();
        $("#container").empty();
        for (let i = 0; i < imgCount; i++) {
            $(`#spinner${i + 1}`).show();
            $(`#imgval${i + 1}`).hide();
        }

        displayImageHTMlContent();
        tf.setBackend(value);
        imgPrediction();
    } else {
        $('#initialText').show();
    }
});

// this function will predict the image.
const imgPrediction = async () => {
    // Load the MobileNet model
    const model = await mobilenet.load();
    startTime = getCurrentTime()
    for (let i = 0; i < imgCount; i++) {
        let img = document.getElementById('img' + (i + 1));
        console.log("img.......", 'img' + (i + 1), img)
        const predictions = await model.classify(img);
        imageValue.push(predictions);
    }
    // getting final prediction of an image
    imageValue.map(element => {
        const finalPrediction = element.reduce((prev, current) => (+prev.probability > +current.probability) ? prev : current);
        finalImgPredictions.push(finalPrediction);
    });

    // assign names for an image
    console.log("finalImgPredictions", finalImgPredictions)
    finalImgPredictions.forEach(async (imgVal, imgIcr) => {
        let finalImg = document.getElementById('imgval' + (imgIcr + 1));
        console.log("finalImg", finalImg)
        finalImg.innerHTML = imgVal.className;
        $(`#spinner${imgIcr + 1}`).hide();
        $(`#imgval${imgIcr + 1}`).show();
    })
    endTime = getCurrentTime();
    durationTime();
}

// current time.
let getCurrentTime = () => {
    if ("performance" in window == true) {
        return performance.now();
    }
    return new Data().getTime();
}


// total duration
const durationTime = async () => {
    const duration = (endTime - startTime);
    document.getElementById('durationTime').innerHTML = Math.round(duration).toString() + ' ms';
}
