const vehicleConsumption = {
    'A': 3,
    'B': 3.5,
    'C': 4
};
const consumptionIncrease = 1.009;

// Runs once the DOM is loaded
(function() {
   const landscape = document.getElementById('landscape');
   const tree = document.querySelector('.tree');
   for(var i = 0; i < 20; ++i) {
        const newTree = tree.cloneNode(true);
        const top = Math.floor(Math.random() * 50) + 20;
        const left = Math.floor(Math.random() * 70);
        newTree.style.top = top + '%';
        newTree.style.left = left + '%';
        newTree.style.zIndex = top;
        landscape.appendChild(newTree);
   }

})();

function animateCar(elem, duration) {
    return elem?.animate([
        { transform: 'translateX(0px)' },
        { transform: 'translateX(100%) translateX(-50px)' }        
    ], 
    {
        duration: duration,
        iterations: 1,
        delay: 500,
        easing: 'ease-in-out',
        fill: 'forwards'
    });
}

function getDuration(distance, speed) {
    const mins = (distance / speed) * 60;
    const hours = (mins / 60);
    const rhours = Math.floor(hours);
    const minutes = (hours - rhours) * 60;
    const rminutes = Math.round(minutes);
    return rhours + "h, " + rminutes + " min"
}

function getConsumption(baseConsumption, speed, distance) {
    const consumption = baseConsumption * Math.pow(consumptionIncrease, (speed - 1)); 
    const totalConsumption = (distance / 100) * consumption;
    return totalConsumption.toFixed(2) + " liters";
}

function drive(consumption, distance, speed1, speed2) {
    const lane1Duration = Math.min(speed2 / speed1 * 1500, 10000);
    const lane2Duration = Math.min(speed1 / speed2 * 1500, 10000);

    const anim1 = animateCar(document.querySelector('#lane1'), lane1Duration);
    const anim2 = animateCar(document.querySelector('#lane2'), lane2Duration);

    const car1Duration = getDuration(distance, speed1);
    const car1Consumption = getConsumption(consumption, speed1, distance);
    const car2Duration = getDuration(distance, speed2);
    const car2Consumption = getConsumption(consumption, speed2, distance);

    anim1.onfinish = function(e) {
        document.querySelector('#car1results').innerHTML = 'Duration: ' + car1Duration + 
        '<br>Consumption: ' + car1Consumption +
        '<br>Speed: ' + speed1 + ' km/h';
    };
    anim2.onfinish = function(e) {
        document.querySelector('#car2results').innerHTML = 'Duration: ' + car2Duration + 
        '<br>Consumption: ' + car2Consumption +
        '<br>Speed: ' + speed2 + ' km/h';
    }
}

// Resets results
function resetState() {
    const elems = document.querySelectorAll('.results');
    [].forEach.call(elems, function(elem) {
        elem.innerHTML = '';
    });
}

// Changing of car model
const vehicleInputs = document.getElementsByName('vehicle');
[].forEach.call(vehicleInputs, function(elem) {
    elem.addEventListener('change', (event) => {
        [].forEach.call(document.getElementsByClassName('car'), function(carElem) {
            carElem.classList.remove('carA');
            carElem.classList.remove('carB');
            carElem.classList.remove('carC');
            carElem.classList.add('car' + event.target.value);
        });
    });
});

// Submit form, start driving
document.querySelector("#carForm").addEventListener("submit", function(e) {
    e.preventDefault();
    resetState();

    // Input should be validated on HTML side, required and min value
    const distance = document.querySelector('input[name="distance"]');
    const vehicle = document.querySelector('input[name="vehicle"]:checked');
    const speed1 = document.querySelector('input[name="speed1"]');
    const speed2 = document.querySelector('input[name="speed2"]');

    const distanceValue = parseFloat(distance.value);
    const speed1Value = parseFloat(speed1.value);
    const speed2Value = parseFloat(speed2.value);

    drive(vehicleConsumption[vehicle.value], distanceValue, speed1Value, speed2Value);    
});