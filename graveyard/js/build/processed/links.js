var Links = {
    
    init: function () {
        this.router();
    },

    router: function () {
        var cardUrl = this.getCardLink(this.parseHashUrl());
        if (window.location.hash && cardUrl) 
            this.redirect(cardUrl);
    },

    redirect: function (link) {
        window.location.href = link;          
    }, 

    parseHashUrl: function () {
        return window.location.hash.substr(1);
    },

    getCardLink: function (index) {
        if (data.cards[index - 1] !== undefined)
            return data.cards[index - 1].link;              
        else
            return false;
    }
};
