entitylist = [];
function dump(password){
        var json = JSON.stringify(entitylist);
}

function load(password){
    var json = '';
    entitylist = JSON.parse(json);
}

var passgen = (function(passgen){
    this.Entity = function(){
        this.name = '';
        this.id = '';
        this.password = '';
        
        this.generatePassword = function(){
            this.password = 'abc';
        }
    }
})({})