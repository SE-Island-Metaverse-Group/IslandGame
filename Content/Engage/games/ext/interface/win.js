// Load UserID from URL
var pageURL = new URL(document.URL);
var userid = pageURL.searchParams.get('userid');

/**
 * 
 * @param {string} playerUserID 
 * @param {Number} score
 */
function mineWin(playerUserID, score) {
    // Win
    clearAllInterval()
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = "#FFEA61";
    
    // HTTP Request
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://81.68.140.151:7853/api/mining?userid=" + playerUserID + "&amount=" + score, true);
    xhr.onreadystatechange = function () {

        ctx.clearRect(0, 0, width, height);
        drawBackground();

        if (xhr.readyState === 4) {
            if (xhr.status === 201) {
                var info = xhr.responseText;
                // var obj = JSON.parse(info);
                // Document Interface
                // var salary = obj.Transactions.Vout[0].Value;
                ctx.font = Math.floor(0.2 * height) + 'px Ubuntu';
                ctx.fillText("CLEAR", width * 0.5, height * 0.5);
                // Draw Score
                ctx.font = Math.floor(0.1 * height) + 'px Ubuntu';
                ctx.fillText(playerUserID + " Score:" + score, width * 0.5, height * 0.65);
                setTimeout(startGame, 2000);
            } else {
                // Submission failed
                ctx.font = Math.floor(0.07 * height) + 'px Ubuntu';
                ctx.fillText("Error: You has been disconnected from server.", width * 0.5, height * 0.5);
                ctx.fillText("Press F to exit.", width * 0.5, height * 0.6);
            }
        } else {
            // Submitting ...
            ctx.font = Math.floor(0.07 * height) + 'px Ubuntu';
            ctx.fillText("Submitting your score to server ...", width * 0.5, height * 0.5);
        }
    }
    // Send XMLHTTPRequest
    xhr.send(null);
}

/**
 * 
 * @param {string} playerUserID 
 * @param {Number} score
 */
function fishWin(playerUserID, score) {
    // Win
    clearAllInterval()
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = "#B1F5FF";
    
    // HTTP Request
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://81.68.140.151:7853/api/fishing?userid=" + playerUserID + "&amount=" + score, true);
    xhr.onreadystatechange = function () {

        ctx.clearRect(0, 0, width, height);
        drawBackground();

        if (xhr.readyState === 4) {
            if (xhr.status === 200 || xhr.status === 201) {
                var info = xhr.responseText;
                // var obj = JSON.parse(info);
                // Document Interface
                // var salary = obj.Transactions.Vout[0].Value;
                ctx.font = Math.floor(0.2 * height) + 'px Ubuntu';
                ctx.fillText("CLEAR", width * 0.5, height * 0.5);
                // Draw Score
                ctx.font = Math.floor(0.1 * height) + 'px Ubuntu';
                ctx.fillText(playerUserID + " Score:" + score, width * 0.5, height * 0.65);
                setTimeout(startGame, 2000);
            } else {
                // Submission failed
                ctx.font = Math.floor(0.07 * height) + 'px Ubuntu';
                ctx.fillText("Error: You has been disconnected from server.", width * 0.5, height * 0.5);
                ctx.fillText("Press F to exit.", width * 0.5, height * 0.6);
            }
        } else {
            // Submitting ...
            ctx.font = Math.floor(0.07 * height) + 'px Ubuntu';
            ctx.fillText("Submitting your score to server ...", width * 0.5, height * 0.5);
        }
    }
    // Send XMLHTTPRequest
    xhr.send(null);
}