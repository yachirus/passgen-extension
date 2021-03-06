var passgen = (function(passgen){
    passgen.generationRule = {
        passwordLength: 16,
        useUpperCase: true,
        useLowerCase: true,
        useDigit: true,
        useSpecialChars: false,
        specialChars: '!"#$%&\'()*+,-./:;<=>?@[\]^_`{|}~'
    };
    
    passgen.entitylist = [];
    passgen.save = function(name, password){
        var dumpData = {
            entitylist: passgen.entitylist,
            generationRule: passgen.generationRule
        };
        
        localStorage.setItem('database.' + name, sjcl.encrypt(password, JSON.stringify(dumpData)));
    };
    
    passgen.load = function(name, password){
        if(localStorage.getItem('database.' + name)){
            var json = sjcl.decrypt(password, localStorage.getItem('database.' + name));
            passgen.entitylist = JSON.parse(json).entitylist;
            passgen.generationRule = JSON.parse(json).generationRule;
        }
    }
    
    passgen.dump = function(){
        var dumpList = [];
        for(var i = 0;i < localStorage.length;i++){
            var key = localStorage.key(i);
            var dumpData = { name: key, data: localStorage.getItem(key) };
            dumpList.push(dumpData);
        }
        return JSON.stringify(dumpList);
    }
    
    passgen.generateNewPassword = function(base){
        var result = base ? base : '';
        var randomArray = new Uint8Array(1024);
        window.crypto.getRandomValues(randomArray);
        
        for(var i = 0;i < randomArray.length;i++){
            if(passgen.generationRule.passwordLength <= result.length){
                return result;
            }
            
            if(passgen.generationRule.useUpperCase){
                if(0x41 <= randomArray[i] && randomArray[i] <= 0x5A){
                    result += String.fromCharCode(randomArray[i]);
                    continue;
                }
            }
            if(passgen.generationRule.useLowerCase){
                if(0x61 <= randomArray[i] && randomArray[i] <= 0x7A){
                    result += String.fromCharCode(randomArray[i]);
                    continue;
                }
            }
            if(passgen.generationRule.useDigit){
                if(0x30 <= randomArray[i] && randomArray[i] <= 0x39){
                    result += String.fromCharCode(randomArray[i]);
                    continue;
                }
            }
            if(passgen.generationRule.useSpecialChars){
                var value = String.fromCharCode(randomArray[i]);
                if(passgen.generationRule.specialChars.indexOf(value) != -1){
                    result += value;
                    continue;
                }
            }
        }
        
        if(passgen.generationRule.passwordLength <= result.length){
            return result;
        }else{
            return passgen.generateNewPassword(result);
        }
    }
    
    passgen.Entity = function(){
        this.group = '';
        this.title = '';
        this.account = '';
        this.password = '';
        this.note = '';
    }
    return passgen;
})({})