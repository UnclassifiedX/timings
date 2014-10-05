/**
 * Spigot Timings Parser
 *
 * Written by Aikar <aikar@aikar.co>
 *
 * @license MIT
 */

$(document).ready(function () {
  $('#paste_toggle').click(function () {
    $('#paste').toggle();
  });
  $('.show_rest').click(function () {
    $(this).parent().find('.hidden').toggle();
  });
  var data = window.timingsData || {
    ranges:[],
    start: 1,
    end: 1
  };
  var values = data.ranges;
  var start = data.start;
  var end = data.end;

  $('#time-selector').slider({
    min: 0,
    max: values.length - 1,
    values: [values.indexOf(start), values.indexOf(end)],
    range: true,
    slide: function(event, ui) {
      start = values[ui.values[0]];
      end = values[ui.values[1]];
      updateRanges();
      goRange();
    }
  });

  updateRanges();

  var labels = [];
  var lagArray = [];
  var lagKeys = Object.keys(data.lagData);
  lagKeys.forEach(function(k, i) {
    lagArray.push(data.lagData[k]);
  });
  var maxLag = getMax(lagArray);
  console.log(maxLag);
  var keys = Object.keys((data.tpsData));
  var tpsData = [];
  var lagData = [];
  var lastLag = -1;
  keys.forEach(function(k, i) {
    var tps = data.tpsData[k];
    console.log(tps, k);
    tpsData.push(tps / 20 * maxLag);
    if (data.lagData[k] != undefined) {
      lastLag = data.lagData[k];
    }
    lagData.push(lastLag);
    var d = new Date(k*1000);
    labels.push(d.getHours()+":"+ d.getMinutes());
  });


  chart('#tps-graph').Line({
    labels:labels,
    datasets: [
      {
        fillColor: "rgba(220,220,220,0.2)",
        strokeColor: "rgba(220,220,220,1)",
        pointColor: "rgba(220,220,220,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)",
        data: tpsData
      },{
        fillColor: "rgba(200,50,50,0.4)",
        strokeColor: "rgba(151,187,205,1)",
        pointColor: "rgba(151,187,205,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(151,187,205,1)",
        data: lagData
      }
    ]
  }, {
    legendTemplate: "",
    showScale: false
  });
  console.log(tpsData, lagData);

  /*chart('#xlag-graph').Line({
    labels:labels,
    datasets: [
      {
        label:"Lag",

      }
    ]
  });*/


  var redirectTimer = 0;
  $('#time-selector').click(function(){
    if (redirectTimer) {
      clearTimeout(redirectTimer);
      redirectTimer = 0;
    }
  });
  function goRange() {
    if (redirectTimer) {
      clearTimeout(redirectTimer);
    }
    redirectTimer = setTimeout(function() {
      window.location = "?id=" + data.id + "&start=" + start + "&end=" + end;
    }, 1000);
  }
  function updateRanges() {
    var startDate = new Date(start*1000);
    var endDate = new Date(end*1000);

    $('#start-time').text(startDate.toLocaleString());
    $('#end-time').text(endDate.toLocaleString());
  }

  $('.button').button();

  setTimeout(function() {
    var adCount = $('.adsbygoogle').length;
    if (adCount) {
      $('<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js">').appendTo("body");

      for (var i = 0; i < adCount; i++) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    }
  }, 1000);

  function chart(id) {
    return new Chart($(id).get(0).getContext("2d"));
  }
  function getMin(array){
    return Math.min.apply(Math,array);
  }

  function getMax(array){
    return Math.max.apply(Math,array);
  }
});


function showInfo(btn) {
  $("#info-" + $(btn).attr('info')).dialog({width: "80%", modal: true});
}
