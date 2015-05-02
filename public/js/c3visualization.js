(function() {
  var spinnerVisible = false;
  if (!spinnerVisible) {
    $("div#spinner").fadeIn("fast");
    spinnerVisible = true;
  }
  $.getJSON( '/igMediaCounts')
    .done(function( data ) {
      if (spinnerVisible) {
        var spinner = $("div#spinner");
        spinner.stop();
        spinner.fadeOut("fast");
        spinnerVisible = false;
      }
      var users = data.users;
      users.sort(function(a,b){
        return a.counts.followed_by - b.counts.followed_by;
      });
      var followsCounts = users.map(function(item){
        return item.counts.follows;
      });
      var followedByCounts = users.map(function(item){
        return item.counts.followed_by;
      });
      followsCounts.unshift('Follows');
      followedByCounts.unshift('Followed By');

      var chart = c3.generate({
        data: {
          columns: [
            followsCounts,
            followedByCounts
          ],
          type: 'scatter'
        },
        tooltip: {
          format: {
            title: function (d) { return users[d].username; }
          }
        }
      });
      setTimeout(function repeat() {
        setTimeout(function () {
            chart.transform('spline');
        }, 2500);
        setTimeout(function () {
            chart.transform('bar');
        }, 5000);
        setTimeout(function () {
            chart.transform('scatter');
            repeat();
        }, 7500);
      }, 0);
    });
})();
