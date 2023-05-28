// Load UserID from URL
var pageURL = new URL(document.URL);
var userid = pageURL.searchParams.get('userid');
if (userid == null) userid = "Gold Miner";

/**
 * 
 * @param {string} playerUserID 
 * @param {Number} score
 */
function win(playerUserID, score) {
    // Win
    clearAllInterval()
    ctx.font = Math.floor(0.2 * height) + 'px Ubuntu';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = "#FFEA61";
    
    // HTTP Request
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://81.68.140.151:7853/api/mining?userid=" + playerUserID + "&amount=" + score, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 201) {
                var info = xhr.responseText;
                var obj = JSON.parse(info);
                // Document Interface
                var salary = obj.Transactions.Vout[0].Value;
                ctx.fillText("CLEAR", width * 0.5, height * 0.5);
                // Draw Score
                ctx.font = Math.floor(0.1 * height) + 'px Ubuntu';
                ctx.fillText(playerUserID + " Balance+" + salary, width * 0.5, height * 0.65);
                setTimeout(startGame, 2000);
            }
        }
    }
    // Send XMLHTTPRequest
    xhr.send(null);
}