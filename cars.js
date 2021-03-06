// Different vehicle base consumption in 1km/h speed
const vehicleConsumption = {
  A: 3,
  B: 3.5,
  C: 4,
};

// Increase in fuel consumption when speed is increased 1km/h
const consumptionIncrease = 1.009;

class Duration {
  constructor(mins) {
    this.negative = mins < 0;
    if (this.negative) {
      mins = -mins;
    }
    const hours = mins / 60;
    const rhours = Math.floor(hours);
    const minutes = (hours - rhours) * 60;
    const rminutes = Math.round(minutes);
    this.hours = rhours;
    this.minutes = rminutes;
  }

  compare(other) {
    const totalMinutes = this.hours * 60 + this.minutes;
    const otherminutes = other.hours * 60 + other.minutes;
    return new Duration(totalMinutes - otherminutes);
  }

  toString(compare) {
    return (
      (this.negative ? "-" : compare ? "+" : "") +
      (this.hours > 0 ? this.hours + "h, " : "") +
      this.minutes +
      "min"
    );
  }
}

class Consumption {
  constructor(consumption) {
    this.negative = consumption < 0;
    this.consumption = consumption;
  }

  compare(other) {
    return new Consumption(this.consumption - other.consumption);
  }

  toString(compare) {
    if (Math.abs(this.consumption) === Infinity) {
      return "TOO MUCH!";
    }

    return (
      (compare && !this.negative ? "+" : "") +
      this.consumption.toFixed(2) +
      " l"
    );
  }
}

// Runs once the DOM is loaded
(function () {
  const landscape = document.getElementById("landscape");

  // Generate trees
  const tree = document.querySelector(".tree");
  for (var i = 0; i < 15; ++i) {
    const newTree = tree.cloneNode(true);
    const top = Math.floor(Math.random() * 60) + 30;
    const left = Math.floor(Math.random() * 70);
    const width = Math.floor(Math.random() * 100) + 60;
    const height = width * 1.666666;
    Object.assign(newTree.style, {
      width: width + "px",
      height: height + "px",
      top: top + "%",
      left: left + "%",
      zIndex: top,
    });
    landscape.appendChild(newTree);
  }

  // Generate clouds
  const cloud = document.querySelector(".cloud");
  for (var j = 0; j < 10; ++j) {
    const newCloud = cloud.cloneNode(true);
    const top = Math.floor(Math.random() * 20) - 10;
    const left = Math.floor(Math.random() * 140) - 40;
    const height = Math.floor(Math.random() * 100) + 50;
    const width = height * 2;
    Object.assign(newCloud.style, {
      width: width + "px",
      height: height + "px",
      top: top + "%",
      left: left + "%",
      zIndex: top,
    });
    landscape.appendChild(newCloud);
    newCloud.animate(
      [
        { transform: "translateX(-200%)" },
        { transform: "translateX(200%)" },
        { transform: "translateX(-200%)" },
      ],
      {
        duration: Math.floor(Math.random() * 20000) + 60000,
        iterations: Infinity,
      }
    );
  }
})();

// Animates car on the road
function animateCar(elem, duration) {
  return elem.animate(
    [
      { transform: "translateX(0px)" },
      { transform: "translateX(100%) translateX(-50px)" },
    ],
    {
      duration: duration,
      iterations: 1,
      delay: 500,
      easing: "ease-in-out",
      fill: "forwards",
    }
  );
}

// Gets duration to cover given distance with given speed
function getDuration(distance, speed) {
  const mins = (distance / speed) * 60;
  return new Duration(mins);
}

// Gets consumption for base consumption, speed for given distance
function getConsumption(baseConsumption, speed, distance) {
  const consumption =
    baseConsumption * Math.pow(consumptionIncrease, speed - 1);
  const totalConsumption = (distance / 100) * consumption;
  return new Consumption(totalConsumption);
}

// Starts driving
function drive(consumption, distance, speed1, speed2) {
  // Calculate relative speed to another car
  const lane1Duration = Math.max(500, Math.min((speed2 / speed1) * 1500, 5000));
  const lane2Duration = Math.max(500, Math.min((speed1 / speed2) * 1500, 5000));

  const anim1 = animateCar(document.querySelector("#lane1"), lane1Duration);
  const anim2 = animateCar(document.querySelector("#lane2"), lane2Duration);

  const car1Duration = getDuration(distance, speed1);
  const car1Consumption = getConsumption(consumption, speed1, distance);
  const car2Duration = getDuration(distance, speed2);
  const car2Consumption = getConsumption(consumption, speed2, distance);

  anim1.onfinish = function (e) {
    document.querySelector("#car1results").innerHTML =
      "Duration: " +
      car1Duration.toString() +
      " (" +
      car1Duration.compare(car2Duration).toString(true) +
      ")" +
      "<br>Consumption: " +
      car1Consumption.toString() +
      " (" +
      car1Consumption.compare(car2Consumption).toString(true) +
      ")" +
      "<br>Speed: " +
      speed1 +
      " km/h";
  };
  anim2.onfinish = function (e) {
    document.querySelector("#car2results").innerHTML =
      "Duration: " +
      car2Duration.toString() +
      " (" +
      car2Duration.compare(car1Duration).toString(true) +
      ")" +
      "<br>Consumption: " +
      car2Consumption.toString() +
      " (" +
      car2Consumption.compare(car1Consumption).toString(true) +
      ")" +
      "<br>Speed: " +
      speed2 +
      " km/h";
  };
}

// Resets results
function resetState() {
  const elems = document.querySelectorAll(".results");
  [].forEach.call(elems, function (elem) {
    elem.innerHTML = "";
  });
}

// Changing of car model
const vehicleInputs = document.getElementsByName("vehicle");
[].forEach.call(vehicleInputs, function (elem) {
  elem.addEventListener("change", (event) => {
    [].forEach.call(document.getElementsByClassName("car"), function (carElem) {
      carElem.classList.remove("carA");
      carElem.classList.remove("carB");
      carElem.classList.remove("carC");
      carElem.classList.add("car" + event.target.value);
    });
  });
});

// Submit form, start driving
document.querySelector("#carForm").addEventListener("submit", function (e) {
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

  drive(
    vehicleConsumption[vehicle.value],
    distanceValue,
    speed1Value,
    speed2Value
  );
});
