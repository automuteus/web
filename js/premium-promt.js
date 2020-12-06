function ask(button_id) {
    var guild = prompt("Please provide the Server ID you want premium for:", "754465589958803548");
    if (guild == null || guild == "") return alert("This feild can not be blank.");
    if (guild.length < 17 || guild.length > 20) return alert("Invalid ID. You can get your Server ID with developer tools in discord.");
    if (isNaN(guild)) return alert("Invalid ID. You can get your Server ID with developer tools in discord.");
    if (guild == "754465589958803548") return alert("You can't use example ID");
    alert("You will now be redirected to PayPal")
    var loc = `https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=${button_id}&custom=${guild}`;
    window.location.href = '' + loc + '';
}