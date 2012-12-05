function dump(password){
    var dumpData = {};
    dumpData.generationRule = passgen.generationRule;
        dumpData.entityList = entitylist;
        localStorage.passgen = sjcl.encrypt(password, JSON.stringify(dumpData));
}

function load(password){
    if(localStorage.passgen){
        var json = sjcl.decrypt(password, localStorage.passgen);
        entitylist = JSON.parse(json).entityList;
        passgen.generationRule = JSON.parse(json).generationRule;
    }
}

var passgen = (function(passgen){
    passgen.generationRule = {
        passwordLength: 16,
        useUpperCase: true,
        useLowerCase: true,
        useDigit: true,
        useSpecialChars: false,
        specialChars: '!"#$%&\'()*+,-./:;<=>?@[\]^_`{|}~'
    };
    
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
    }
    return passgen;
})({})