
$.getJSON('https://stats.automute.us/stats/api', function (data) {
    var guilds = `${data.totalGuilds}`
    var activeGames = `${data.activeGames}`
    $("#guilds").html(guilds);
    $("#activeGames").html(activeGames);
  });

setInterval(function(){ 
  //this code runs every 7 seconds
$.getJSON('https://stats.automute.us/stats/api', function (data) {
    var guilds = `${data.totalGuilds}`
    var activeGames = `${data.activeGames}`
    $("#guilds").html(guilds);
    $("#activeGames").html(activeGames);
});
}, 7000);
