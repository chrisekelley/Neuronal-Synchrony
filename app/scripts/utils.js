function rainbowPastel(numOfSteps, step) {
  // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
  // Adam Cole, 2011-Sept-14
  // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript

  var r, g, b;
  var h = step / numOfSteps;
  var i = ~~(h * 6);
  var f = h * 6 - i;
  var q = 1 - f;
  switch(i % 6){
    case 0: r = 1, g = f, b = 0; break;
    case 1: r = q, g = 1, b = 0; break;
    case 2: r = 0, g = 1, b = f; break;
    case 3: r = 0, g = q, b = 1; break;
    case 4: r = f, g = 0, b = 1; break;
    case 5: r = 1, g = 0, b = q; break;
  }
//  console.log("numOfSteps: " + numOfSteps + " step: " + step + "h: " + h + " i: " + i +" f: " + f +" q: " + q + " i%6: " + i%6 + " r: " + r + " g: " + g + " b: " + b)
//  var c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
  var red = ~ ~(r * 255);
  var green = ~ ~(g * 255);
  var blue = ~ ~(b * 255);
  // pastel kudos: http://stackoverflow.com/questions/43044/algorithm-to-randomly-generate-an-aesthetically-pleasing-color-palette
  // mix the color - in this case, white (255,255,255)

    red = (red + 255) / 2;
    green = (green + 255) / 2;
    blue = (blue + 255) / 2;

  var c = "#" + ("00" + (~~red).toString(16)).slice(-2) + ("00" + (~~green).toString(16)).slice(-2) + ("00" + (~~blue).toString(16)).slice(-2);
  return (c);
}

function updateSlider(newTempo) {
  var currentTempo = $('#bpmChosen').html();
  NeuronalSynchrony.clock.timeStretch(NeuronalSynchrony.clock._events, currentTempo / newTempo)
  console.log("setting tempo from " +currentTempo + " to " + newTempo + " value / bpm: " + currentTempo / newTempo)
//  bpm = bpmInput.html();
  $('#bpmChosen').html(newTempo);

}