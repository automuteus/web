function askGuildId() {
var guild = prompt("Please provide the Server ID you want premium for:", "754465589958803548");
    if (guild == null || guild == "") {
      alert("Invalid ID")
    } else {
      if(isNaN(guild)){
          alert("Please make sure you have the correct Server ID.");
      } else {
          if (guild=="754465589958803548"){
              alert("You can't have example ID");
          } else {
              var loc = "https://crewmate.xyz/donate/amu?guildid="+guild; 
              window.location.href = '' + loc + ''; 
          }
      }
    }
}