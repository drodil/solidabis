const vehicleConsumption = {
    'A': 3,
    'B': 3.5,
    'C': 4
};
const consumptionIncrease = 1.009;

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
    console.log(consumption);
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
        document.querySelector('#car1duration').innerHTML = car1Duration;
        document.querySelector('#car1consumption').innerHTML = car1Consumption;
    };
    anim2.onfinish = function(e) {
        document.querySelector('#car2duration').innerHTML = car2Duration;
        document.querySelector('#car2consumption').innerHTML = car2Consumption;
    }
}

function resetState() {
    const elems = document.querySelectorAll('.duration, .consumption');
    [].forEach.call(elems, function(elem) {
        elem.innerHTML = '';
    });
}

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