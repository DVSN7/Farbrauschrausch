/////////////// 1 /////////// REview CAt colours
////////////// 2 ////////// size, frequency and position of ellipse two 
// removed rule 44
// check rule 225


// Configuration for cellular grid
const possibleCellSizes = [1, 2, 3, 4];
//const possibleCellSizes = [1.5, 2.5, 3.5, 4.5]; // 2, 3, 4, 5
let cellSize, cells, generation = 0, maxGenerations;
let initialMarginX, initialMarginY;
let initialMarginPercentage = -0.05;
let maxAliveCellsRow = [], maxAliveCellsCount = 0;
let ruleFunction, currentSpecialRuleNumber = null;
let circleEffectActive, colorMode, backgroundChoice;
let gradientColors = [], gradientSet1 = [], gradientSet2 = [];
//const strokeWeightMap = { 1.5: 0.05, 2.5: 0.1, 3.5: 0.15, 4.5: 0.2 };
const strokeWeightMap = {1: 0.05, 2: 0.1, 3: 0.15, 4: 0.2 };
let dividerNoiseScale = [0.5, 0.004, 0.005, 0.006, 0.00005];
let noiseDiv, noiseXOffset = 0, noiseYOffset = 0, noiseOffsetIncrement = 0.5;
let rotationAngle, randomMultiplier;
let amplitudeSine, frequencySine, amplitudeSine2, frequencySine2, phaseSine2;
let waveBvar, piVar, hVar;
let flipPhase, flipFreq, flipSine, flipPhaseF, flipSineF;
let noiseScale;
let octaveN;
let circleWidth, circleHeight;
let canvas;
let circleEffectType;
let p5Seed;
let newCircleCenterX, newCircleCenterY, newCircleWidth, newCircleHeight;
//let hueShift;
//const predefinedSpecialRuleNumbers = [231]; // 127, 225, 227, 229, 230, 231
// CA strong 126
let randomDivisor;
let xOffset;
let yOffset;
let numGradientSets; // Global variable for number of gradient sets
const validColorModes = ['Cat01', 'Cat02', 'Cat03', 'Cat04', 'Cat06', 'Cat07', 'Cat08', 'Cat09', 'Cat10', 'Cat11', 'Cat12'];

const predefinedSpecialRuleNumbers = [1, 3, 5, 7, 9, 11, 12, 13, 15, 17, 18, 19, 21, 22, 23, 25, 27, 28, 29, 30, 31, 33, 35, 37, 39, 41, 43, 45, 47, 49, 50, 51, 53, 54, 55, 57, 58, 59, 60, 61, 62, 63, 65, 67, 69, 70, 71, 73, 75, 76, 77, 78, 79, 81, 83, 85, 86, 87, 89, 90, 91, 92, 93, 94, 95, 97, 99, 101, 103, 105, 107, 108, 109, 110, 111, 113, 114, 115, 117, 118, 119, 121, 123, 124, 125]; 

let sineWaveFunctions = [
  curlingSineWave4,
  curlingSineWave5,
  curlingSineWave6,
  curlingSineWave7,
  curlingSineWave8,
  curlingSineWave9,
  curlingSineWave10
];
let selectedFunctionIndex = 0;

function setup() {
    canvas = createCanvas(504, 896);
    canvas.parent('sketch-container');
    pixelDensity(3);
    frameRate(60);
    smooth();

    p5Seed = $fx.rand() * 99999; // Make p5Seed a global variable
    randomSeed(p5Seed);
    noiseSeed(p5Seed);

    // Initialize offsets for repositioning the waves
    xOffset = $fx.rand() * width;
    yOffset = $fx.rand() * height;
    rotationAngle = Math.random() * TWO_PI;
    console.log("xOffset:", xOffset, "yOffset:", yOffset, "rotationAngle:", rotationAngle);

    initializeMargins();
    initializeCellSize();
    initializeCells();
    setupBackground();
    setupColorMode();

    // Set numGradientSets based on colorMode from 1 to 4
    switch (colorMode) {
        case 'Cat01': 
            numGradientSets = 3;
            break;
            case 'Cat02': 
            numGradientSets = 3;
            break;
            case 'Cat03': 
            numGradientSets = 1;
            break;
            case 'Cat04': 
            numGradientSets = 6;
            break;
            case 'Cat05': 
            numGradientSets = 2;
            break;
            case 'Cat06': 
            numGradientSets = 2;
            break;
        case 'Cat07': 
            numGradientSets = 3;
            break;
        case 'Cat08': 
            numGradientSets = 1;
            break;
            case 'Cat09': 
            numGradientSets = 3;
            break;
        case 'Cat10': 
            numGradientSets = 1;
            break;
            case 'Cat11': 
            numGradientSets = 3;
            break;
        default:
            numGradientSets = 3; // Default 3-color gradient
            break;
    }

    initializeGradientColors(3, numGradientSets); // Pass numGradientSets here

    setupFlippingStates();
    setupRandomValues();
    setupSineWaveProperties();
    setupCurlingVariables();
    setupRuleSettings();

    const circleEffectTypes = ['No circle', 'Clearly defined circle', 'Distorted circle', 'Clearly defined circle with noised width'];
    circleEffectType = floor($fx.rand() * circleEffectTypes.length);
    console.log(`Circle Effect Type for this session: ${circleEffectTypes[circleEffectType]}`);

    selectedFunctionIndex = floor($fx.rand() * sineWaveFunctions.length);
    selectedFunction = sineWaveFunctions[selectedFunctionIndex];

    // Select a second function, ensuring it's different from the first
    let secondFunctionIndex;
    do {
        secondFunctionIndex = floor($fx.rand() * sineWaveFunctions.length);
    } while (secondFunctionIndex === selectedFunctionIndex);
    secondFunction = sineWaveFunctions[secondFunctionIndex];

    console.log("Selected Function Index:", selectedFunctionIndex);
    console.log("Second Function Index:", secondFunctionIndex);

    setBodyBackgroundColor();
    windowResized(); // Initial resize to fit window
}





function initializeMargins() {
  initialMarginX = width * initialMarginPercentage;
  let topMargin = height * initialMarginPercentage * 0.8;
  let bottomMargin = height * initialMarginPercentage * 0.5;
  initialMarginY = topMargin;

  let effectiveHeight = height - topMargin - bottomMargin;
  maxGenerations = Math.floor(effectiveHeight / cellSize);
}

function initializeCellSize() {
  cellSize = random(possibleCellSizes);
  console.log("Cell size:", cellSize);

}

function initializeCells() {
  let effectiveWidth = Math.max(width - 2 * initialMarginX, 0);
  let effectiveHeight = Math.max(height - initialMarginY - (height * initialMarginPercentage * 0.7), 0);
  let numCellsX = Math.floor(effectiveWidth / cellSize);
  let numCellsY = Math.max(Math.floor(effectiveHeight / cellSize), 0);

  cells = new Array(numCellsX).fill(0).map(() => $fx.rand() < 0.5 ? 0 : 1);
  maxGenerations = numCellsY;
  ruleFunction = generateRandomRules();
}

function setupColorMode() {
    //colorMode = random(['Cat07']);  // CAT4 is the benckmark OK //
    
    //  CAT1 too washed and vivid CAT2 review darkness grading CAT3 reviwe dark tipsCAT4 ok CAT5 better than 6and7 CAT6 color too washed CAT7 too flat
    colorMode = random(['Cat01', 'Cat02', 'Cat03', 'Cat04','Cat06','Cat07', 'Cat083', 'Cat09', 'Cat10','Cat11']);
  console.log("Color Mode for this session:", colorMode);
}

function setupRandomValues() {
  rotationAngle = $fx.rand()*999 * TWO_PI;
  noiseDiv = random(dividerNoiseScale);
  randomMultiplier = random([1.2, 0.8, -0.8, -1.2]);
  noiseScale = random([0.1, 0.2, 0.3, 0.4]);
}

function setupCurlingVariables() {
  randomDivisor = [15, 30, 14, 60][Math.floor($fx.rand() * 4)];
  // Initialize offsets for repositioning the waves
  xOffset = $fx.rand() * width;
  yOffset = $fx.rand() * height;

  console.log("xOffset:", xOffset, "yOffset:", yOffset);
  waveBvar = 1;
  piVar =  random(0.3, 0.03);
  hVar = 2;
  console.log("Pi value:", piVar);
  console.log("Height value:", hVar);
  console.log("Wave value:", waveBvar);
}

function setupFlippingStates() {
  flipPhase = $fx.rand() < 0.5;
  flipFreq = $fx.rand() < 0.5;
  flipSine = $fx.rand() < 0.5;
  flipPhaseF = $fx.rand() < 0.5;
  flipSineF = $fx.rand() < 0.5;
}

function setupRuleSettings() {
    currentSpecialRuleNumber = 11;

    currentSpecialRuleNumber = predefinedSpecialRuleNumbers[Math.floor($fx.rand() * predefinedSpecialRuleNumbers.length)];
    console.log("Special Rule Number for this generation:", currentSpecialRuleNumber);

    // Original ellipse properties
    circleWidth = $fx.rand() * (width * 1.8) + width * 0.2;
    circleHeight = circleWidth;

    console.log(`Circle Width: ${circleWidth}, Circle Height: ${circleHeight}`);
    
    let verticalCenterOffset = width / 26;

    const positions = [
        { x: width / 2 + verticalCenterOffset, y: height / 2 },
        { x: width / 2 + verticalCenterOffset, y: 0 },
        { x: width / 2 + verticalCenterOffset, y: height },
        { x: verticalCenterOffset, y: height / 2 },
        { x: width - verticalCenterOffset, y: height / 2 }
    ];
    const chosenPosition = positions[Math.floor($fx.rand() * positions.length)];
    circleCenterX = chosenPosition.x;
    circleCenterY = chosenPosition.y;
    console.log(`Circle Center: (${circleCenterX}, ${circleCenterY})`);

    // New ellipse properties
    newCircleWidth = $fx.rand() * (width * 1.5) + width * 0.1;
    newCircleHeight = newCircleWidth;

    console.log(`New Circle Width: ${newCircleWidth}, New Circle Height: ${newCircleHeight}`);

    const newChosenPosition = positions[Math.floor($fx.rand() * positions.length)];
    newCircleCenterX = newChosenPosition.x;
    newCircleCenterY = newChosenPosition.y;
    console.log(`New Circle Center: (${newCircleCenterX}, ${newCircleCenterY})`);

    ruleFunction = generateRandomRules(currentSpecialRuleNumber);
}


//function seededRandomColor() {
    // Generate a base hue with reduced probability for green hues
   // let baseHue;
  //  const randValue = $fx.rand();
  //  if (randValue < 0.45) {
  //      // Adjust the range to exclude some green hues
  //      baseHue = randValue * 0.9 * 360; // 0 to 162 degrees
  //  } else if (randValue < 0.55) {
   //     // Skip the green hues range
   //     baseHue = 162 + (randValue - 0.45) * 0.1 * 360; // 162 to 198 degrees
   // } else {
   //     baseHue = 198 + (randValue - 0.55) * 0.9 * 360; // 198 to 360 degrees
  //  }
    
  //  const baseSaturation = 0.5 + $fx.rand() * 0.5; // 50% to 100%
  //  const baseLightness = 0.4 + $fx.rand() * 0.4; // 40% to 80%

   // const baseColor = chroma.hsl(baseHue, baseSaturation, baseLightness);

    // Generate complementary color
    //const complementaryColor = baseColor.set('hsl.h', (baseHue + 180) % 360);

    // Generate analogous colors
  //  const analogousColor1 = baseColor.set('hsl.h', (baseHue + 30) % 360);
   // const analogousColor2 = baseColor.set('hsl.h', (baseHue - 30 + 360) % 360);

    // Generate triadic colors
   // const triadicColor1 = baseColor.set('hsl.h', (baseHue + 120) % 360);
   // const triadicColor2 = baseColor.set('hsl.h', (baseHue - 120 + 360) % 360);

    // Combine all colors into a palette and return one randomly
   // const colorPalette = [baseColor, complementaryColor, analogousColor1, analogousColor2, triadicColor1, triadicColor2];
   // return colorPalette[Math.floor($fx.rand() * colorPalette.length)];
//}




//function seededRandomColor() {
    // Generate a base color using seeded random values
  //  const baseHue = $fx.rand() * 360;
  // const baseSaturation = 0.5 + $fx.rand() * 0.5; // 50% to 100%
  // const baseLightness = 0.4 + $fx.rand() * 0.4; // 40% to 80%

   // const baseColor = chroma.hsl(baseHue, baseSaturation, baseLightness);

    // Generate complementary color
  //  const complementaryColor = baseColor.set('hsl.h', (baseHue + 180) % 360);

    // Generate analogous colors
   // const analogousColor1 = baseColor.set('hsl.h', (baseHue + 30) % 360);
  //  const analogousColor2 = baseColor.set('hsl.h', (baseHue - 30 + 360) % 360);

    // Generate triadic colors
   // const triadicColor1 = baseColor.set('hsl.h', (baseHue + 120) % 360);
   // const triadicColor2 = baseColor.set('hsl.h', (baseHue - 120 + 360) % 360);

    // Combine all colors into a palette and return one randomly
  //  const colorPalette = [baseColor, complementaryColor, analogousColor1, analogousColor2, triadicColor1, triadicColor2];
   // return colorPalette[Math.floor($fx.rand() * colorPalette.length)];
//}

function seededRandomColor() {
    const r = $fx.rand();
    const g = $fx.rand();
    const b = $fx.rand();
    return chroma(r * 255, g * 255, b * 255);
}

function initializeGradientColors(count, numGradientSets = 3) {
    gradientColors = [];
    if (!count) count = 2 + Math.floor($fx.rand() * 2);  
    if ($fx.rand() < 0.5) {
        generateSimpleRandomColors(count);
    } else {
        generateNoiseModifiedColors(count);
    }
    initializeGradientSets(numGradientSets);
}

function initializeGradientSets(numColors) {
    gradientSet1 = [];
    gradientSet2 = [];
    for (let i = 0; i < numColors; i++) {
        gradientSet1.push(seededRandomColor());
        gradientSet2.push(seededRandomColor());
    }
}


//function initializeGradientSets(numColors) {
 //   gradientSet1 = [];
 //   gradientSet2 = [];
 //   for (let i = 0; i < numColors; i++) {
  //      gradientSet1.push(chroma($fx.rand() * 255, $fx.rand() * 255, $fx.rand() * 255));
  //      gradientSet2.push(chroma($fx.rand() * 255, $fx.rand() * 255, $fx.rand() * 255));
  //  }
//}

function generateSimpleRandomColors(count) {
    for (let i = 0; i < count; i++) {
        gradientColors.push(seededRandomColor());
    }
}

//function generateSimpleRandomColors(count) {
   // for (let i = 0; i < count; i++) {
   //     gradientColors.push(chroma($fx.rand() * 255, $fx.rand() * 255, $fx.rand() * 255));
   // }
//}

function generateNoiseModifiedColors(count) {
    //noiseScale = amplitudeSine === 1 ? 0 : 0.1;
    let noiseIntensity = 255;
    noiseSeed($fx.rand() * 99999);

    for (let i = 0; i < count; i++) {
        let baseColor = chroma.random(); // Ensure baseColor is a chroma object
        console.log('baseColor:', baseColor); // Debugging line
        let noiseValue = noise((i + noiseXOffset) * noiseScale, noiseYOffset);

        if (noiseValue > 0.1) {
            let splotchColor = chroma(baseColor.hex()) // Convert baseColor to hex and back to chroma object
                .set("rgb.r", (chroma(baseColor.hex()).get("rgb.r") + noiseValue) % 255)
                .set("rgb.g", (chroma(baseColor.hex()).get("rgb.g") + noiseIntensity * noiseValue) % 255)
                .set("rgb.b", (chroma(baseColor.hex()).get("rgb.b") + noiseIntensity * noiseValue) % 255);
            gradientColors.push(splotchColor);
        } else {
            gradientColors.push(baseColor.hex());
        }
    }
}


function setupBackground() {
    backgroundChoice = chooseBackground();
    console.log("Background Choice:", backgroundChoice);

    if (backgroundChoice && typeof backgroundChoice.css === 'function') {
        background(backgroundChoice.css());
        //document.body.style.backgroundColor = backgroundChoice.css();
        // document.body.style.backgroundColor = 'white'; 
    } else {
        console.error("backgroundChoice is not defined or does not have a css method.");
        background(255); // Default background color in case of error
        // document.body.style.backgroundColor = 'rgb(255, 255, 255)';
    }
}

function chooseBackground() {
    if (gradientColors.length > 0) {
        return chroma(gradientColors[Math.floor($fx.rand() * gradientColors.length)]).brighten(0.3);
    }
    return chroma.random(); // Fallback to a completely random color if gradientColors is empty
}

function setBodyBackgroundColor() {
    let sketchBgColor = backgroundChoice.css();
    let desaturatedColor = chroma(sketchBgColor).desaturate(1).brighten(1.6).hex(); // Adjust the desaturation level as needed

    document.body.style.backgroundColor = desaturatedColor;
    document.body.style.borderColor = desaturatedColor;
    document.body.style.borderStyle = "solid";
    document.body.style.borderWidth = "10px";
}

function setupSineWaveProperties() {
    amplitudeSine = random([7, 8, 9, 10]);

    //amplitudeSine = random([4, 5, 6, 8, 9, 10]);
    frequencySine = random([0.01, 0.001]);
    amplitudeSine2 = random([0.01, 0.001, 0.0001]);
    frequencySine2 = random([0.01, 0.001]);
    phaseSine2 = random([TWO_PI, TWO_PI / 2, TWO_PI / 4]);
    octaveN = random([1, 2, 3, 4]); // Initialize octaveN here
    console.log("Amplitude Sine for this session:", amplitudeSine);
}

function selectCurlingFunction() {
    const functions = [curlingSineWave4, curlingSineWave5, curlingSineWave6, curlingSineWave7, curlingSineWave8, curlingSineWave9, curlingSineWave10];

    //const functions = [curlingSineWave1, curlingSineWave2, curlingSineWave3, curlingSineWave4, curlingSineWave5, curlingSineWave6, curlingSineWave7, curlingSineWave8, curlingSineWave9, curlingSineWave10];
    return random(functions);
}



function curlingSineWave4(x, y, xOffset = 0, yOffset = 0) {    // variation of 3
    // Apply offsets to x and y
    x += xOffset;
    y += yOffset;

    let invertedX = width - x;
    let phaseShift = amplitudeSine === 1 ? 0 : (flipPhase ? y : invertedX) / height * TWO_PI * 12;
    let localFrequency = frequencySine + (flipFreq ? y : invertedX) / height * 0.05;
    return amplitudeSine * sin(localFrequency * (flipSine ? invertedX : y) + phaseShift) + amplitudeSine;
}

function curlingSineWave5(x, y, xOffset = 0, yOffset = 0) {
    // Apply offsets to x and y
    x += xOffset;
    y += yOffset;

    // Calculate the phase shift and return the sine wave value
    let phaseShift = amplitudeSine * cos((flipPhase ? x : -y) / height * TWO_PI) * TWO_PI * piVar;
    return amplitudeSine * sin(frequencySine * (flipSine ? y : -x) + phaseShift) + amplitudeSine;
}



function curlingSineWave6(x, y, xOffset = 0, yOffset = 0) {
    // Apply offsets to x and y
    x += xOffset;
    y += yOffset;

    let invertedX = width - x;
    let phaseShift = amplitudeSine === 1 ? 0 : noise(y / height * TWO_PI) * TWO_PI*1.5;
    return amplitudeSine * sin(frequencySine * x + phaseShift) + amplitudeSine;
}



function curlingSineWave7(x, y, xOffset = 0, yOffset = 0, rotationAngle = 0) {
    // Apply offsets to x and y
    x += xOffset;
    y += yOffset;

    // Rotate the coordinates around the origin (0, 0)
    let rotatedX = x * cos(rotationAngle) - y * sin(rotationAngle);
    let rotatedY = x * sin(rotationAngle) + y * cos(rotationAngle);

    // Calculate the phase shift and return the sine wave value
    let phaseShift = amplitudeSine === 1 ? 0 : (rotatedX / height) * TWO_PI * 0.001;
    return amplitudeSine * sin(frequencySine * rotatedY + phaseShift * height) + amplitudeSine;
}


function curlingSineWave8(x, y, xOffset = 0, yOffset = 0) {
    // Apply offsets to x and y
    x += xOffset;
    y += yOffset;

    let invertedX = width - x;
    let phaseShift = amplitudeSine === 1 ? 0 : noise((flipPhase ? -x : x) / height * TWO_PI) * TWO_PI*2.5;
    return amplitudeSine * sin(frequencySine * (flipPhase ? y : -y) + phaseShift) + amplitudeSine;
}

function curlingSineWave9(x, y) {
    // Apply offsets to x and y
    x += xOffset;
    y += yOffset;

    // Calculate phase shift based on amplitudeSine and flipPhase
    let phaseShift;
    if (amplitudeSine === 1) {
        phaseShift = 0;
    } else {
        let baseValue = flipPhase ? x : width - y;
        phaseShift = (baseValue / width) * TWO_PI * 2.5;
    }

    // Calculate local frequency based on frequencySine and flipFreq
    let baseFrequencyValue = flipFreq ? y : width - x;
    let localFrequency = frequencySine + (baseFrequencyValue / width) * 1.1;

    // Calculate sine wave value with phase shift and local frequency
    let baseSineValue = flipSine ? y : x;
    let sineValue = amplitudeSine * sin((localFrequency * baseSineValue / randomDivisor) + phaseShift);

    // Return the sine value adjusted by amplitudeSine
    return sineValue + amplitudeSine;
}


function curlingSineWave10(x, y) {
    // Apply offsets to x and y
    x += xOffset;
    y += yOffset;

    // Calculate phase shift based on amplitudeSine and flipPhase
    let phaseShift;
    if (amplitudeSine === 1) {
        phaseShift = 0;
    } else {
        let baseValue = flipPhase ? width - x : y;
        phaseShift = (baseValue / height) * TWO_PI * 2;
    }

    // Calculate local frequency based on frequencySine and flipFreq
    let baseFrequencyValue = flipFreq ? width - x : y;
    let localFrequency = frequencySine + (baseFrequencyValue / height)*1.1;   //add *0.5 to increase wave height

    // Calculate sine wave value with phase shift and local frequency
    let baseSineValue = flipSine ? x : height - y;
    let sineValue = amplitudeSine * sin((localFrequency * baseSineValue / randomDivisor) + phaseShift);

    // Return the sine value adjusted by amplitudeSine
    return sineValue + amplitudeSine;
}





function draw() {
    if (generation < maxGenerations) {
        if (generation == 0) {
            selectedFunction = sineWaveFunctions[selectedFunctionIndex];
            console.log("Selected Function Index:", selectedFunctionIndex);
            console.log("Selected Function:", selectedFunction.name);
        }
        renderGeneration();
        generate(ruleFunction, cells.length);
        generation++;
    } else {
        noLoop();
    }
}

function curlingSineWaveK(x, y) {
    let phaseShift = amplitudeSine === 1 ? 0 : (flipPhase ? height - y : x) / height * TWO_PI * 3.5;
    let localFrequency = frequencySine + (flipFreq ? height - y : x) / height * 2.1;
    return amplitudeSine * cos(localFrequency * (flipSine ? width - x : y) + phaseShift) + amplitudeSine;
}

function renderGeneration() {
    translate(initialMarginX, initialMarginY);

    const dividerYPositions = calculateDividerYPositions();
    // Calculate random circle size
    newCircleWidth = $fx.rand() * (width * 1.5) + width * 0.5;
    //newCircleWidth = $fx.rand() * (width * 0.5 - width * 0.05) + width * 0.05;

    newCircleHeight = newCircleWidth;

    cells.forEach((cellState, i) => {
        if (cellState === 1) {
            const cellX = i * cellSize;
            const cellY = generation * cellSize;
            let isInsideEllipse = false;
            let newIsInsideEllipse = false;

            switch (circleEffectType) {
                case 0:
                    // No circle
                    break;
                case 1:
                    // Clearly defined circle
                    isInsideEllipse = ellipseContainsPoint(circleCenterX, circleCenterY, circleWidth, circleHeight, cellX, cellY);
                    newIsInsideEllipse = newEllipseContainsPoint(newCircleCenterX, newCircleCenterY, newCircleWidth, newCircleHeight, cellX, cellY);
                    break;
                case 2:
                    // Distorted circle
                    const noiseValueWidth = noise((cellX + p5Seed) * 0.1, (cellY + p5Seed) * 0.1);
                    const noiseValueHeight = noise((cellX + p5Seed + 100) * 0.1, (cellY + p5Seed + 100) * 0.1);
                    if (isNaN(noiseValueWidth) || isNaN(noiseValueHeight)) {
                        console.error(`Invalid noise values: Noise Width: ${noiseValueWidth}, Noise Height: ${noiseValueHeight}`);
                        return;
                    }
                    const distortedCircleWidth = circleWidth + noiseValueWidth * 1500;
                    const distortedCircleHeight = circleHeight + noiseValueHeight * 1500;
                    isInsideEllipse = ellipseContainsPoint(circleCenterX, circleCenterY, distortedCircleWidth, distortedCircleHeight, cellX, cellY);
                    newIsInsideEllipse = newEllipseContainsPoint(newCircleCenterX, newCircleCenterY, newCircleWidth, newCircleHeight, cellX, cellY);
                    break;
                case 3:
                    // Clearly defined circle with noise only in width
                    const noiseValueWidthOnly = noise((cellX + p5Seed) * 0.1, (cellY + p5Seed) * 0.1);
                    const noiseValueHeightOnly = noise((cellX + p5Seed) * 0.1, (cellY + p5Seed) * 0.1);
                    if (isNaN(noiseValueWidthOnly)) {
                        console.error(`Invalid noise value: Noise Width: ${noiseValueWidthOnly}`);
                        return;
                    }
                    if (isNaN(noiseValueHeightOnly)) {
                        console.error(`Invalid noise value: Noise Width: ${noiseValueHeightOnly}`);
                        return;
                    }
                    const noisedCircleWidth = circleWidth + noiseValueWidthOnly * 4000;
                    const noiseCircleHeight = circleHeight + noiseValueHeightOnly * 200;
                    isInsideEllipse = ellipseContainsPoint(circleCenterX, circleCenterY, noisedCircleWidth, noiseCircleHeight, cellX, cellY);
                    newIsInsideEllipse = newEllipseContainsPoint(newCircleCenterX, newCircleCenterY, newCircleWidth, newCircleHeight, cellX, cellY);
                    break;
            }

            const isAboveDivider = cellY < dividerYPositions[i];
            renderCell(i, generation, isInsideEllipse, newIsInsideEllipse, isAboveDivider, circleEffectType !== 0);
        }
    });
}



function calculateDividerYPositions() {
    return new Array(Math.floor(width / cellSize)).fill(0).map((_, i) => {
        const x = i * cellSize;
        const rotatedX = cos(rotationAngle) * (x + noiseXOffset) * noiseScale - sin(rotationAngle) * (noiseYOffset * noiseDiv);
        const rotatedY = sin(rotationAngle) * (x + noiseXOffset) * noiseScale + cos(rotationAngle) * (noiseYOffset * noiseDiv);
        const noiseValue = fbm(rotatedX, rotatedY, octaveN, 0.0005, 0.00005);
        return map(noiseValue, 0, 1, -height * 4, 4 * height);
    });
}

function fbm(x, y, octaves, persistence, lacunarity) {
    let total = 0, amplitude = 1, frequency = 1, maxValue = 0;
    for (let i = 0; i < octaves; i++) {
        total += noise(x * frequency, y * frequency) * amplitude;
        maxValue += amplitude;
        amplitude *= persistence;
        frequency *= lacunarity;
    }
    return total / maxValue;
}

function updateSineWaveWithNoise() {
    amplitudeSine = noise(noiseXOffset) * 10;
    frequencySine = 0.001 + noise(noiseYOffset) * 0.001;
}

function renderCell(i, gen, isInsideEllipse, newIsInsideEllipse, isLeftOfDivider, affectCellColor) {
    const { cellX, cellY, cellHeight, alphaValue, currentStrokeWeight } = setupCellEnvironment(i, gen);
    const { zeroColor, oneColor, twoColor, threeColor, fourColor, strokeColor } = calculateColorSettings(gen, cellHeight, isInsideEllipse, newIsInsideEllipse, isLeftOfDivider, affectCellColor);
    setupDrawing(strokeColor, alphaValue, currentStrokeWeight);
    drawCellShapes(cellX, cellY, cellHeight, zeroColor, oneColor, twoColor, threeColor, fourColor, currentStrokeWeight);
}


function setupCellEnvironment(i, gen) {
    const cellX = i * cellSize, cellY = gen * cellSize, maxY = (maxGenerations - 1) * cellSize;

    // Calculate cell height using both functions
    const cellHeight = (secondFunction(cellX, cellY) + selectedFunction(cellX, cellY)) * 0.5;

    const alphaValue = random(205, 245);
    const currentStrokeWeight = strokeWeightMap[Math.round(cellSize)] || 1;

    return { cellX, cellY, cellHeight, alphaValue, currentStrokeWeight };
}




function calculateColorSettings(gen, cellHeight, isInsideEllipse, newIsInsideEllipse, isLeftOfDivider, affectCellColor) {
    let colorSet = isLeftOfDivider ? gradientSet1 : gradientSet2;
    const hueShiftOptions = [0, 30, 60, 150, 180, 210]; 
    const hueShift = hueShiftOptions[Math.floor($fx.rand() * hueShiftOptions.length)];
    const hueShift2 = $fx.rand() < 0.5 ? 60 : 210;
    const hueShift3 = 180; 
    if (isInsideEllipse && affectCellColor) {
      colorSet = getComplementaryColor(gradientSet2); // Original logic
    }
  
    if (newIsInsideEllipse && affectCellColor) {
      colorSet = getNewComplementaryColor(gradientSet2); // New logic
    }
  
    const chromaCellColor = getGradientColor(gen, maxGenerations, colorSet);
  
    let zeroColor, oneColor, twoColor, threeColor, fourColor;
    switch (colorMode) {

        case 'Cat01': // Checker color Soft 1
        zeroColor = $fx.rand() < 0.5 ? chromaCellColor.darken(-cellHeight * 0.15).desaturate(cellHeight * 0.3) : chromaCellColor.darken(cellHeight * 0.15).desaturate(cellHeight * 0.3);
        oneColor = $fx.rand() < 0.5 ? chromaCellColor.darken(-cellHeight * 0.05).desaturate(cellHeight * 0.2) : chromaCellColor.darken(cellHeight * 0.05).desaturate(cellHeight * 0.2);
        twoColor = chromaCellColor.brighten(cellHeight * 0.2).desaturate(cellHeight * 0.1);
        threeColor = chromaCellColor.darken(cellHeight * 0.1);
        fourColor = chromaCellColor.darken(cellHeight * 0.2);
        strokeColor = backgroundChoice.set('hsl.h', (backgroundChoice.get('hsl.h') + hueShift3) % 360);
        break;

        

            case 'Cat02': // Checker color Soft 2
        zeroColor = $fx.rand() < 0.5 ? chromaCellColor.darken(-cellHeight * 0.15).desaturate(cellHeight * 0.3) : chromaCellColor.darken(cellHeight * 0.15).desaturate(cellHeight * 0.3);
        oneColor = $fx.rand() < 0.5 ? chromaCellColor.darken(-cellHeight * 0.05).desaturate(cellHeight * 0.2) : chromaCellColor.darken(cellHeight * 0.05).desaturate(cellHeight * 0.2);
        twoColor = chromaCellColor.brighten(cellHeight * 0.2).desaturate(cellHeight * 0.3);
        threeColor = chromaCellColor.desaturate(cellHeight * 0.3).darken(cellHeight * 0.15);
        fourColor = chromaCellColor.desaturate(cellHeight * 0.1).darken(cellHeight * 0.2);
        strokeColor = backgroundChoice.set('hsl.h', (backgroundChoice.get('hsl.h') + hueShift) % 360);
        break;
            
        case 'Cat03': //Checker color TO KEEP 1   USE 1 COLORS HERE
        zeroColor = $fx.rand() < 0.5 ? chromaCellColor.darken(-cellHeight * 0.3).desaturate(cellHeight * 0.3) : chromaCellColor.darken(cellHeight * 0.3).desaturate(cellHeight * 0.3);
        oneColor = $fx.rand() < 0.5 ? chromaCellColor.darken(-cellHeight * 0.15).desaturate(cellHeight * 0.2) : chromaCellColor.darken(cellHeight * 0.15).desaturate(cellHeight * 0.2);
        twoColor = chromaCellColor.brighten(cellHeight * 0.1).desaturate(cellHeight * 0.3);
        threeColor = chromaCellColor.desaturate(cellHeight * 0.3);
        fourColor = chromaCellColor.desaturate(cellHeight * 0.1);
        strokeColor = backgroundChoice.set('hsl.h', (backgroundChoice.get('hsl.h') + hueShift3) % 360);
        break;

       
    
        case 'Cat04':  // Full color Soft 1
        zeroColor = chromaCellColor.brighten(cellHeight * 0.09); //0.12
        oneColor = chromaCellColor.brighten(cellHeight * 0.02)  //0.04
        twoColor = chromaCellColor.darken(cellHeight * 0.04)  //0.12
        threeColor = chromaCellColor.darken(cellHeight * 0.09)
        fourColor = chromaCellColor.saturate(0.1)  //0.1
        strokeColor = backgroundChoice.set('hsl.h', (backgroundChoice.get('hsl.h') + hueShift) % 360);
        break;

        case 'Cat05': // Smooth color 1
            zeroColor = chromaCellColor.brighten(cellHeight * 0.05).saturate(cellHeight * 0.05);
            oneColor = chromaCellColor.brighten(cellHeight * 0.01);
            twoColor = chromaCellColor.darken(cellHeight * 0.05);
            threeColor = chromaCellColor.darken(cellHeight * 0.08);
            fourColor = chromaCellColor.darken(cellHeight * 0.1).saturate(cellHeight * 0.1);
            strokeColor = backgroundChoice.set('hsl.h', (backgroundChoice.get('hsl.h') + hueShift3) % 360);
            break;

            case 'Cat06':   // DArk and Vivid 1
        zeroColor = adjustColor(chromaCellColor.luminance(cellHeight * 0.003)).darken(cellHeight * 0.01).saturate(0.2);
        oneColor = adjustColor(chromaCellColor.luminance(cellHeight * 0.0025)).darken(cellHeight * 0.03);
        twoColor = adjustColor(chromaCellColor.luminance(cellHeight * 0.002)).darken(cellHeight * 0.05);
        threeColor = adjustColor(chromaCellColor.luminance(cellHeight * 0.0015)).darken(cellHeight * 0.07);
        fourColor = adjustColor(chromaCellColor.luminance(cellHeight * 0.001)).darken(cellHeight * 0.09);
        strokeColor = backgroundChoice.set('hsl.h', (backgroundChoice.get('hsl.h') + hueShift2) % 360).saturate(1.1);
        break;

        case 'Cat07':  // Monochrome1
       zeroColor = chromaCellColor.desaturate(cellHeight * 2).luminance(cellHeight * 0.01).darken(cellHeight * 0.1);   // Black
       oneColor = chromaCellColor.desaturate(cellHeight * 2.2).luminance(cellHeight * 0.03).darken(cellHeight * 0.02); // Dark gray
       twoColor = chromaCellColor.desaturate(cellHeight * 2.4).luminance(cellHeight * 0.06).darken(cellHeight * 0.06);  // Medium gray
       threeColor = chromaCellColor.desaturate(cellHeight * 2.6).luminance(cellHeight * 0.1).darken(cellHeight * 0.04); // Light gray
       fourColor = chromaCellColor.desaturate(cellHeight * 2.8).luminance(cellHeight * 0.15).darken(cellHeight * 0.02);   // White
       strokeColor = backgroundChoice.desaturate(0.15).luminance(0.5); // Medium gray for stroke
       //strokeColor = chromaCellColor.desaturate(cellHeight * 3).luminance(cellHeight * 0.05).darken(cellHeight * 0.1); // Medium gray for stroke
        break;

      case 'Cat08':   // Vivid color 1
        zeroColor = chromaCellColor.luminance(cellHeight * 0.05);
        oneColor = adjustColor(chromaCellColor.luminance(cellHeight * 0.04));
        twoColor = adjustColor(chromaCellColor.luminance(cellHeight * 0.03));
        threeColor = adjustColor(chromaCellColor.luminance(cellHeight * 0.02));
        fourColor = chromaCellColor.luminance(cellHeight * 0.01);
        strokeColor = backgroundChoice.set('hsl.h', (backgroundChoice.get('hsl.h') + hueShift2) % 360);
        break;

        case 'Cat09':   // Vivid color 1
        zeroColor = chromaCellColor.luminance(cellHeight * 0.05);
        oneColor = adjustColor(chromaCellColor.luminance(cellHeight * 0.04));
        twoColor = adjustColor(chromaCellColor.luminance(cellHeight * 0.03));
        threeColor = adjustColor(chromaCellColor.luminance(cellHeight * 0.02));
        fourColor = chromaCellColor.luminance(cellHeight * 0.01);
        strokeColor = backgroundChoice.set('hsl.h', (backgroundChoice.get('hsl.h') + hueShift2) % 360);
        break;

        case 'Cat10':  // White tip Bright 1
        zeroColor = chromaCellColor.luminance(cellHeight * 0.3); 
        oneColor = chromaCellColor.luminance(cellHeight * 0.04); 
        twoColor = chromaCellColor.luminance(cellHeight * 0.05);
        threeColor = chromaCellColor.luminance(cellHeight * 0.07);
        fourColor = chromaCellColor.luminance(cellHeight * 0.07);
        strokeColor = backgroundChoice.set('hsl.h', (backgroundChoice.get('hsl.h') + hueShift2) % 360);
        break;

        case 'Cat11':  // White tip Bright 1
        zeroColor = chromaCellColor.luminance(cellHeight * 0.3); 
        oneColor = chromaCellColor.luminance(cellHeight * 0.04); 
        twoColor = chromaCellColor.luminance(cellHeight * 0.05);
        threeColor = chromaCellColor.luminance(cellHeight * 0.07);
        fourColor = chromaCellColor.luminance(cellHeight * 0.07);
        strokeColor = backgroundChoice.set('hsl.h', (backgroundChoice.get('hsl.h') + hueShift2) % 360);
        break;
        

        

        
    }
  

    //const strokeColor = getStrokeColor(backgroundChoice); // Use the new function here


    //let hueShiftCalc = map(cellHeight, 0, maxGenerations, 1, 360); 
    //let strokeColor = backgroundChoice.set('hsl.h', (backgroundChoice.get('hsl.h') + hueShift) % 360);

    //let strokeColor = backgroundChoice.set('hsl.h', (backgroundChoice.get('hsl.h') + 180) % 360);
    //adjustLuminance(strokeColor);
  
    return { zeroColor, oneColor, twoColor, threeColor, fourColor, strokeColor };
  }
  
  //function getStrokeColor(baseColor) {
    //const hueShiftOptions = [0, 30, 60, 150, 180, 210]; 
    //const hueShift = 180; 
    //const hueShift = $fx.rand() < 0.5 ? 60 : 210;

    //const hueShift = hueShiftOptions[Math.floor($fx.rand() * hueShiftOptions.length)];
    //return baseColor.set('hsl.h', (baseColor.get('hsl.h') + hueShift) % 360);
//}



function seededRandom() {
    const x = Math.sin($fx.rand() * 99999) * 10000;
    return x - Math.floor(x);
}

function adjustColor(color) {
    let lightnessAdjustment = 0.02;
    let saturationAdjustment = -0.02;
    let newLuminance = Math.min(0.9, color.luminance() + lightnessAdjustment);
    color = color.luminance(newLuminance);
    if (saturationAdjustment < 0) {
        color = color.desaturate(-saturationAdjustment);
    } else if (saturationAdjustment > 0) {
        color = color.saturate(saturationAdjustment);
    }
    return color;
}

function adjustLuminance(color) {
    const luminance = color.luminance();
    if (luminance < 0.1) {
        color.brighten(0.1); // was 0.1
    } else if (luminance > 0.9) {
        color.darken(0.1);  // was 0.1
    }
}

function setupDrawing(strokeColor, alphaValue, currentStrokeWeight) {
    stroke(strokeColor.rgb());
    strokeWeight(currentStrokeWeight);
    blendMode(SOFT_LIGHT);
}

function drawCellShapes(cellX, cellY, cellHeight, zeroColor, oneColor, twoColor, threeColor, fourColor, currentStrokeWeight) {
    const baseAngle = calculateBaseAngle(cellX, cellY, cellHeight);
    const angles = [0, 1.1, 1.2, 1.3, 1.4].map(increment => baseAngle + PI / 180 * (10 + increment));
    const heights = [3, 2.5, 2, 1.5, 1].map(h => cellSize + (cellHeight * h));
    const colors = [zeroColor, oneColor, twoColor, threeColor, fourColor];

    colors.forEach((color, index) => {
        push();
        translate(cellX + cellSize / 2, cellY - cellHeight + cellSize / 2);
        rotate(angles[index]);

        blendMode(BLEND);
        noStroke();
        fill(color.rgb());
        drawTriangle(0, 0, cellSize, heights[index]);

        blendMode(SOFT_LIGHT);
        stroke(strokeColor.rgb());
        strokeWeight(currentStrokeWeight);
        drawTriangleOutline(0, 0, cellSize, heights[index]);

        pop();
    });
}



function drawTriangle(baseX, baseY, originalWidth, height) {
    let width = map(height, 0, maxGenerations * cellSize, originalWidth * 1.5, originalWidth);

    let x1 = baseX - width / 2;
    let y1 = baseY + height / 2;
    let x2 = baseX + width / 2;
    let y2 = y1;
    let x3 = baseX;
    let y3 = baseY - height / 2;

    triangle(x1, y1, x2, y2, x3, y3);
}

function drawTriangleOutline(baseX, baseY, originalWidth, height) {
    let width = map(height, 0, maxGenerations * cellSize, originalWidth * 1.5, originalWidth);

    noFill();
    beginShape();
    vertex(baseX - width / 2, baseY + height / 2);
    vertex(baseX + width / 2, baseY + height / 2);
    vertex(baseX, baseY - height / 2);
    endShape(CLOSE);
}

function calculateBaseAngle(cellX, cellY, cellHeight) {
    const noiseValue = noise(cellX * 0.005, cellY * 0.005) * TWO_PI;
    return noiseValue + map(cellHeight, 2, 10, 0, TWO_PI / 2);
}

function getComplementaryColor(colors) {
    return colors.map(color => color.set('hsl.h', (color.get('hsl.h') + 180) % 360));
}

function getNewComplementaryColor(colors) {
    return colors.map(color => color.set('hsl.h', (color.get('hsl.h') + 30) % 360).saturate(2)); 
    ////////////////////////////////return colors.map(color => color.set('hsl.h', (color.get('hsl.h') + 30) % 360)); ////////////////
  }

function getGradientColor(position, totalPositions, chromaColors) {
    let scale = chroma.scale(chromaColors).mode("lch").correctLightness();
    let ratio = position / totalPositions;
    return scale(ratio);
}

function generate(rules, numCells) {
    let newCells = generateNewCellStates(rules, numCells);
    updateAliveCellsTracking(newCells);
    maybeResetCells(newCells);
    cells = newCells;
}

function generateNewCellStates(rules, numCells) {
    let newCells = new Array(numCells).fill(0);
    for (let i = 0; i < numCells; i++) {
        newCells[i] = (i === 0 || i === numCells - 1) ? generateEdgeCellState(i, numCells) : rules(cells[i - 1], cells[i], cells[i + 1]);
    }
    return newCells;
}

function updateAliveCellsTracking(newCells) {
    let aliveCellsCount = countAliveCellsInRow(newCells);
    if (aliveCellsCount > maxAliveCellsCount) {
        maxAliveCellsCount = aliveCellsCount;
        maxAliveCellsRow = [...newCells];
    }
}

function maybeResetCells(newCells) {
    let aliveCellsCount = countAliveCellsInRow(newCells);
    if (aliveCellsCount < 5) {
        newCells = [...maxAliveCellsRow];
    }
}

function generateEdgeCellState(index, numCells) {
    let neighborLeft = index > 0 ? cells[index - 1] : cells[numCells - 1];
    let neighborRight = index < numCells - 1 ? cells[index + 1] : cells[0];
    let neighborSum = neighborLeft + neighborRight;
    let activationThreshold = random(1, 3);
    return neighborSum >= activationThreshold ? 1 : 0;
}

function countAliveCellsInRow(row) {
    return row.reduce((count, cell) => count + (cell === 1 ? 1 : 0), 0);
}

function generateRandomRules(ruleNumber) {
    return (left, me, right) => {
        let binaryString = ("00000000" + ruleNumber.toString(2)).slice(-8);
        let index = (left << 2) | (me << 1) | right;
        return binaryString[7 - index] === "1" ? 1 : 0;
    };
}

function saveCurrentCanvas() {
    let colorHexes = gradientColors.map(color => color.hex().replace('#', ''));
    let colorString = colorHexes.join('_');
    if (colorString.length > 50) {
        colorString = colorString.substring(0, 47) + 'etc';
    }
    let filename = `GenerativeArt_Rule${currentSpecialRuleNumber}_${p5Seed}_Colors_${colorString}`;
    saveCanvas(filename, 'png');
}


function keyPressed() {
    if (key === "s" || key === "S") {
        saveCurrentCanvas();
    } else if (key >= '1' && key <= '5') {
        const densities = [1, 2, 3, 4, 5];
        const density = densities[parseInt(key) - 1];
        redrawGraphics(density);
    }
}

function reinitializeSketch() {
    generation = 0;
    clear();
    setup();
    loop();
}

function resetGeneration() {
    generation = 0;
    clear();
    setup();
    loop();
}

function windowResized() {
    let canvasAspectRatio = 600 / 900;
    let windowAspectRatio = windowWidth / windowHeight;

    if (windowAspectRatio > canvasAspectRatio) {
        let newHeight = windowHeight;
        let newWidth = newHeight * canvasAspectRatio;
        resizeCanvas(newWidth, newHeight);
    } else {
        let newWidth = windowWidth;
        let newHeight = newWidth / canvasAspectRatio;
        resizeCanvas(newWidth, newHeight);
    }

    console.log("Window resized to: " + windowWidth + " x " + windowHeight);
    console.log("Background Choice on Resize:", backgroundChoice);

    if (backgroundChoice && typeof backgroundChoice.css === 'function') {
        background(backgroundChoice.css());
    } else {
        console.error("backgroundChoice is not defined or does not have a css method.");
        background(255); // Default background color in case of error
    }

    initializeMargins();
    let numCellsX = floor((width - 2 * initialMarginX) / cellSize);
    maxGenerations = floor((height - 2 * initialMarginY) / cellSize);
    generation = 0;
    cells = new Array(numCellsX).fill(0).map(() => $fx.rand() < 0.5 ? 0 : 1);
    loop();
}

function renderImage(w, h) {
    let cnv = createCanvas(w, h);
    pixelDensity(1);
    clear();
    setup();
    loop();
    setTimeout(() => {
        saveCanvasWithRuleNumber();
    }, 1000);
}

function clearCanvasAndReinitialize() {
    clear();
    setup();
}

function simpleHash(data) {
    let hash = 0, i, chr;
    for (i = 0; i < data.length; i++) {
        chr = data.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return hash.toString();
}

function ellipseContainsPoint(cx, cy, w, h, x, y) {
    const dx = x - cx;
    const dy = y - cy;
    const normX = (2 * dx / w) ** 2;
    const normY = (2 * dy / h) ** 2;
    return normX + normY <= 1;
}

function newEllipseContainsPoint(cx, cy, w, h, x, y) {
    const dx = x - cx;
    const dy = y - cy;
    const normX = (2 * dx / w) ** 2;
    const normY = (2 * dy / h) ** 2;
    return normX + normY <= 1;
  }

// Added Functions

function redrawGraphics(density) {
    const canvasWidth = 600;
    const canvasHeight = 900;

    // Create a secondary canvas with the same size but we will scale the content
    const secondaryCanvas = createGraphics(canvasWidth * density, canvasHeight * density);
    secondaryCanvas.pixelDensity(1);
    secondaryCanvas.background(255);

    // Set background on the secondary canvas
    secondaryCanvas.background(backgroundChoice.css());

    // Copy the setup to the secondary canvas
    secondaryCanvas.push();
    secondaryCanvas.scale(density, density);

    // Render the image on secondary canvas
    for (let gen = 0; gen < maxGenerations; gen++) {
        cells.forEach((cellState, i) => {
            if (cellState === 1) {
                const cellX = i * cellSize;
                const cellY = gen * cellSize;
                const isInsideEllipse = ellipseContainsPoint(circleCenterX, circleCenterY, circleWidth, circleHeight, cellX, cellY);
                const isAboveDivider = cellY < calculateDividerYPositions()[i];
                renderCellOnGraphics(secondaryCanvas, i, gen, isInsideEllipse, isAboveDivider, circleEffectActive);
            }
        });
    }
    secondaryCanvas.pop();

    // Save the secondary canvas
    const filename = `GenerativeArt_Rule${currentSpecialRuleNumber}_${p5Seed}_HighRes_${density}x.png`;
    save(secondaryCanvas, filename);
}

function renderCellOnGraphics(g, i, gen, isInsideCircle, isLeftOfDivider, affectCellColor) {
    const { cellX, cellY, cellHeight, alphaValue, currentStrokeWeight } = setupCellEnvironment(i, gen);
    const { zeroColor, oneColor, twoColor, threeColor, fourColor, strokeColor } = calculateColorSettings(gen, cellHeight, isInsideCircle, isLeftOfDivider, affectCellColor);

    g.stroke(strokeColor.rgb());
    g.strokeWeight(currentStrokeWeight);
    g.blendMode(SOFT_LIGHT);

    drawCellShapesOnGraphics(g, cellX, cellY, cellHeight, zeroColor, oneColor, twoColor, threeColor, fourColor, currentStrokeWeight);
}


function drawCellShapesOnGraphics(g, cellX, cellY, cellHeight, zeroColor, oneColor, twoColor, threeColor, fourColor, currentStrokeWeight) {
    const baseAngle = calculateBaseAngle(cellX, cellY, cellHeight);
    const angles = [0, 1.1, 1.2, 1.3, 1.4].map(increment => baseAngle + PI / 180 * (10 + increment));
    const heights = [3, 2.5, 2, 1.5, 1].map(h => cellSize + (cellHeight * h));
    const colors = [zeroColor, oneColor, twoColor, threeColor, fourColor];
    const strokeColor = backgroundChoice.set('hsl.h', (backgroundChoice.get('hsl.h') + 120) % 360);

    colors.forEach((color, index) => {
        g.push();
        g.translate(cellX + cellSize / 2, cellY - cellHeight + cellSize / 2);
        g.rotate(angles[index]);

        g.blendMode(BLEND);
        g.noStroke();
        g.fill(color.rgb());
        drawTriangleOnGraphics(g, 0, 0, cellSize, heights[index]);

        g.blendMode(SOFT_LIGHT);
        g.stroke(strokeColor.rgb());
        g.strokeWeight(currentStrokeWeight);
        drawTriangleOutlineOnGraphics(g, 0, 0, cellSize, heights[index]);

        g.pop();
    });
}


function drawTriangleOnGraphics(g, baseX, baseY, originalWidth, height) {
    let width = map(height, 0, maxGenerations * cellSize, originalWidth * 1.5, originalWidth);

    let x1 = baseX - width / 2;
    let y1 = baseY + height / 2;
    let x2 = baseX + width / 2;
    let y2 = y1;
    let x3 = baseX;
    let y3 = baseY - height / 2;

    g.triangle(x1, y1, x2, y2, x3, y3);
}

function drawTriangleOutlineOnGraphics(g, baseX, baseY, originalWidth, height) {
    let width = map(height, 0, maxGenerations * cellSize, originalWidth * 1.5, originalWidth);

    g.noFill();
    g.beginShape();
    g.vertex(baseX - width / 2, baseY + height / 2);
    g.vertex(baseX + width / 2, baseY + height / 2);
    g.vertex(baseX, baseY - height / 2);
    g.endShape(CLOSE);
}
