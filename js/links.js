var Links = {
    
    init: function () {
        this.router();
    },

    router: function () {
        var cardUrl = this.getCardLink(this.parseHashUrl());
        if (window.location.hash && cardUrl !== undefined) 
            this.redirect(cardUrl);
    },

    redirect: function (link) {
        window.location.href = link;          
    }, 

    parseHashUrl: function () {
        return window.location.hash.substr(1);
    },

    getCardLink: function (index) {
        var link = data.cards[index - 1].link;

        if (link.indexOf('ntnu.1024.no') !== -1
        &&  localStorage.schedule_name   !== undefined) 
            return link + localStorage.schedule_name;
        else
            return link;
    }
};
