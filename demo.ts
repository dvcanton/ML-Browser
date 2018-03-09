// This code was based on the official deeplearn.js documentation and guides
// For more, access https://deeplearnjs.org

// Parameters to be learned
let a = dl.variable(dl.scalar(Math.random()));
let b = dl.variable(dl.scalar(Math.random()));
let c = dl.variable(dl.scalar(Math.random()));
let d = dl.variable(dl.scalar(Math.random()));


// SGD Optimizer
const learningRate = 0.01;
const optimizer = dl.train.sgd(learningRate);


// Cubic polynominal
// y = a * x ^ 3 + b * x ^ 3  + c * x + d
function predict(input) {
  return dl.tidy(() => {
    const x = dl.scalar(input);

    const ax3 = a.mul(x.square().mul(x));
    const bx2 = b.mul(x.square());
    const cx = c.mul(x);
    const y = ax3.add(bx2).add(cx).add(d);

    return y;
  });
}

// Simple squared difference loss
function loss(prediction, actual) {
  const error = dl.scalar(actual).sub(prediction).square();
  return error;
}

// Load and parse a CSV file
// TODO: Validate the file and deal with expections (i.e. missing data, etc)
let data = {};
function loadData() {
    const fileInput = document.getElementById("file").files[0];
    if (typeof fileInput !== "underfined") {
        let x = [];
        let y = [];
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = reader.result;
            const lines = content.split("\r");
            lines.forEach((row) => {
              const rowContent = row.split(",");
              x.push(rowContent[0]);
              y.push(rowContent[1]);
            });
            data = {xs: x, ys: y};
            console.log(data);

            // UI info
            const appDiv = document.getElementById("app");
            const message = document.createElement("p");
            message.innerHTML = "Data loaded";
            appDiv.appendChild(message);
        }
        reader.readAsText(fileInput);

    }
    return false;
}


// Training the model
// TODO: Validate the data before actually training
// WARNING: Make sure the data is already loaded before training
async function trainModel(numIterations, done) {
  const xs = data.xs;
  const ys = data.ys;
  // const maxDataPoints = xs.length;
  const maxDataPoints = 20;

  for (let iter = 0; iter < numIterations; iter++) {
    for (let i = 0; i < maxDataPoints; i++) {
      optimizer.minimize(() => {
        const pred = predict(xs[i]);
        const predLoss = loss(pred, ys[i]);
        return predLoss;
      });
    }

    // UI display
    const interactionsInfo = document.getElementById("interations-info");
    interactionsInfo.innerHTML = iter + " iterations..";

    await dl.nextFrame();
  }

  done();
}

// Wrapper for the trainModel
// TODO: Ideally these type of functions should be in a separated those related to the model iself
function train() {
  const numInteractions = document.getElementById("interactions").value;

  trainModel(numInteractions, () => {
    const appDiv = document.getElementById("app");
    const message = document.createElement("p");
    message.innerHTML = `Parameters after training: a=${a.dataSync()}, b=${b.dataSync()}, c=${c.dataSync()}, d=${d.dataSync()}`;
    appDiv.appendChild(message);
  });
}
