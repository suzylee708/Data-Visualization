var currentScrollTop = d3.select('#currentScrollTop');
var panel = 0;
var mt = window.innerWidth / 6;
var ml = window.innerHeight / 3;

var publicData;

var w = 600;
var h = 600;
var barWidth = 60;
var barPadding = 2;
var svg = d3
  .select('#chartAnimation')
  .append('svg')
  .attr('width', w)
  .attr('height', h);

Promise.all([d3.csv('chart-2010.csv'), d3.csv('chart-2022.csv')]).then(
  function (data) {
    publicData = data; // store both datasets

    // Draw the bar chart for Step 0 (chart-2010.csv)
    drawBarChart(0, 'gold');

    // Initially display Step 0
    step0();
  }
);

function drawBarChart(step, color1, color2) {
  svg
    .selectAll('.bar')
    .data(Object.keys(publicData[step][0]))
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', function (d, i) {
      return i * (barWidth + barPadding);
    })
    .attr('y', function (d, i) {
      return h - publicData[step][0][d] * 3;
    })
    .attr('height', function (d, i) {
      return publicData[step][0][d] * 3;
    })
    // .attr('width', function (d, i) {
    //   return barWidth - 10;
    // })
    .attr('fill', function (d, i) {
      if (i % 2 == 0) {
        return color1;
      } else {
        return color2;
      }
    });

  // Create labels for values on top of bars
  svg
    .selectAll('text.value')
    .data(Object.keys(publicData[step][0]))
    .enter()
    .append('text')
    .text(function (d) {
      return publicData[step][0][d];
    })
    .attr('class', 'value')
    .attr('text-anchor', 'middle')
    .attr('x', function (d, i) {
      return i * barWidth + barWidth / 2 + 30;
    })
    .attr('y', function (d) {
      return h - publicData[step][0][d] * 3;
    })
    .attr('font-family', 'sans-serif')
    .attr('font-size', '13px')
    .attr('fill', 'black');
  // Lables
  var groupLabels = ['Uninsured', 'Public Coverage', 'Private Coverage'];
  svg
    .selectAll('.groupLabels')
    .data(groupLabels)
    .enter()
    .append('text')
    .text(function (d) {
      return d;
    })
    .attr('x', function (d, i) {
      return i * barWidth * 2.3 + barWidth; // Positions label between bars
    })

    .attr('y', 595)
    .attr('text-anchor', 'middle') // Align text to its center
    .attr('font-family', 'sans-serif')
    .attr('font-size', '14px')
    .attr('fill', 'black');
}

function updateBarChart(step, color1, color2) {
  d3.selectAll('.bar')
    .data(Object.keys(publicData[step][0]))
    .transition()
    .duration(1000)
    .delay(function (d, i) {
      return i * 200;
    })
    .attr('x', function (d, i) {
      return i * (barWidth + barPadding) + Math.floor(i / 2) * barPadding * 7;
    })
    .attr('y', function (d, i) {
      return h - 20 - publicData[step][0][d] * 3;
    })
    .attr('height', function (d, i) {
      return publicData[step][0][d] * 3;
    })
    .attr('width', function (d, i) {
      return barWidth - 1;
    })
    .attr('fill', function (d, i) {
      if (i % 2 == 0) {
        return color1;
      } else {
        return color2;
      }
    });

  // Update labels for values on top of bars
  svg
    .selectAll('text.value')
    .data(Object.keys(publicData[step][0]))
    .text(function (d) {
      return publicData[step][0][d];
    })
    .transition() // Apply transition to move the text labels
    .duration(1000)
    .attr('x', function (d, i) {
      return (
        i * (barWidth + barPadding) +
        Math.floor(i / 2) * barPadding * 7 +
        barWidth / 2
      );
    })
    .attr('y', function (d) {
      return h - 20 - publicData[step][0][d] * 3 - 5;
    });
}

function step0() {
  console.log('do step0');
  updateBarChart(0, 'LightSteelBlue', 'SteelBlue');
}

function step1() {
  console.log('do step1');
  updateBarChart(1, '#D7BDE2', '#884EA0');
}

var scrollTop = 0;
var newScrollTop = 0;

var listOfStepFunctions = [step0, step1];

d3.select('#container').on('scroll.scroller', function () {
  newScrollTop = d3.select('#container').node().scrollTop;
});

function render() {
  var panelSize = window.innerHeight;

  if (scrollTop !== newScrollTop) {
    if (scrollTop < newScrollTop) {
      scrollTop = newScrollTop;
      var panelNumber = Math.round(scrollTop / panelSize) + 1;
    } else {
      scrollTop = newScrollTop;
      var panelNumber = Math.round(scrollTop / panelSize);
    }

    if (panel != panelNumber) {
      panel = panelNumber;
      listOfStepFunctions[panel]();
    }
    currentScrollTop.text(scrollTop);
  }
  window.requestAnimationFrame(render);
}

window.requestAnimationFrame(render);
