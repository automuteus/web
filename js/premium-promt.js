const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const guild = urlParams.get('guild')

function ask(button_id) {
    // alert("This is currently not working at the momment, please come back another time");
    if (urlParams.get('guild') != null) {
        if (urlParams.get('guild') == null || urlParams.get('guild') == "") return window.location.href = '/premium';
        if (urlParams.get('guild').length < 17 || urlParams.get('guild').length > 20) return window.location.href = '/premium';
        if (isNaN(urlParams.get('guild'))) return  alert("Invalid ID. You can get your Server ID with developer tools in discord.") & (window.location.href = '/premium'); 
        //if (urlParams.get('guild') == '754465589958803548') return alert("Thats the AutoMuteUs server you silly goose!");
        var loc = `https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=${button_id}&custom=${urlParams.get('guild')}`;
        window.location.href = '' + loc + '';
    } else {
        var guild = prompt("Please provide the Server ID you want premium for:", "754465589958803548");
        if (guild == null || guild == "") return alert("This feild can not be blank.");
        if (guild.length < 17 || guild.length > 20) return alert("Invalid ID. You can get your Server ID with developer tools in discord.");
        if (isNaN(guild)) return alert("Invalid ID. You can get your Server ID with developer tools in discord.");
        if (guild == "754465589958803548") return alert("You can't use example ID");
        var loc = `https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=${button_id}&custom=${guild}`;
        window.location.href = '' + loc + '';
    }
}