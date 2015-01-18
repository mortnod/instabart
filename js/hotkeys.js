var Hotkeys = function () {
   
    var keypress = function (event) {
        var cardUrl = getCardLink(extractKey(event));
        if (cardUrl !== undefined)
            window.location.href = cardUrl;
    }
       
    var getCardLink = function (index) {
        var link = data.cards[index - 1].link;

        if (link.indexOf('ntnu.1024.no') !== -1
        &&  localStorage.schedule_name   !== undefined) 
            return link + localStorage.schedule_name;
        else
            return link;
    }

    var extractKey = function (event) {
        var keyCode = event.keyCode || event.which;                
        
        if (keyCode > 48 && keyCode < 58) /* 1-9 */
            return keyCode - 48; 
        else if (keyCode === 48)          /*  0  */
            return 10;
        else if (keyCode === 81)          /*  q  */
            return 11;
        else if (keyCode === 87)          /*  w  */
            return 12;
        else
            return false;
    } 
    
    $(document).keydown(keypress);
};
