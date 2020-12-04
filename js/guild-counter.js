
$.getJSON('https://stats.automute.us/stats/api', function (data) {
    var guilds = `${data.totalGuilds}`
    var activeGames = `${data.activeGames}`
    $("#guilds").html(guilds);
    $("#activeGames").html(activeGames);
  });

setInterval(function(){ 
  //this code runs every 5 seconds
$.getJSON('https://stats.automute.us/stats/api', function (data) {
    var guilds = `${data.totalGuilds}`
    var activeGames = `${data.activeGames}`
    $("#guilds").html(guilds);
    $("#activeGames").html(activeGames);
});
}, 5000);