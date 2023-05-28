// Load UserID from URL
var pageURL = new URL(document.URL);
var userid = pageURL.searchParams.get('userid');

/**
 * 
 * @param {string} playerUserID 
 * @param {Number} score
 */
function win(playerUserID, score) {
    // Win
    clearAllInterval()
    // Draw "CLEAR"
    ctx.font = Math.floor(0.2 * height) + 'px Ubuntu';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = "#F7F7F7";
    ctx.fillText("CLEAR", width * 0.5, height * 0.5);
    // Draw Score
    ctx.font = Math.floor(0.08 * height) + 'px Ubuntu';
    ctx.fillText(playerUserID + " - Score:" + score, width * 0.5, height * 0.65);
    setTimeout(startGame, 2000);
}