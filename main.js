function acceptEntity(){
    var entity = new passgen.Entity();
    entity.title = $('#newentity-title').val();
    entity.account = $('#newentity-account').val();
    entity.password = $('#newentity-password').val();
    passgen.entitylist.push(entity);
    
    passgen.save("default", masterPassword);

    $('#newentity').remove();
    $('#add-entity').show();
    updateEntity();
}

function cancelEntity(){
    $('#newentity').remove();
    $('#add-entity').show();
}

function updateEntity(){
    $('#entities tbody *').remove();
    for(var i = 0;i < passgen.entitylist.length;i++){
        var tr = $(document.createElement('tr'));
        var td = $(document.createElement('td'));
        td.text(passgen.entitylist[i].title);
        tr.append(td);
        
        td = $(document.createElement('td'));
        td.text(passgen.entitylist[i].account);
        tr.append(td);
        
        td = $(document.createElement('td'));
        var str = '';
        for(var j= 0;j < passgen.entitylist[i].password.length;j++){
            str += '*';
        }
        td.text(str);
        tr.append(td);
        
        td = $(document.createElement('td'));
        td.attr({style: 'white-space: nowrap;'});
        var showPassword = $('<a class="btn" title="show-password"></a>');
        showPassword.append('<i class="icon-eye-open"></i>');
        showPassword.attr({'data-index': i});
        showPassword.on('click', function(){
            var index = parseInt($(this).attr('data-index'));
            if($(this).find('i').is('.icon-eye-open')){
                $('#entities tr:eq(' + (index + 1) + ') td:eq(2)').text(passgen.entitylist[index].password);
                $(this).find('i').removeClass('icon-eye-open').addClass('icon-eye-close');
            }else{
                var str = '';
                for(var j= 0;j < passgen.entitylist[index].password.length;j++){
                    str += '*';
                }
                $('#entities tr:eq(' + (index + 1) + ') td:eq(2)').text(str);
                $(this).find('i').removeClass('icon-eye-close').addClass('icon-eye-open');
            }
        });
        
        var copyToClipboard = $('<a class="btn" title="copy password to clipboard"></a>');
        copyToClipboard.append('<i class="icon-list-alt"></i>');
        copyToClipboard.attr({'data-index': i});
        copyToClipboard.on('click', function(){
            var index = parseInt($(this).attr('data-index'));
            var copyDiv = document.createElement('div');
            copyDiv.contentEditable = true;
            document.body.appendChild(copyDiv);
            copyDiv.innerHTML = passgen.entitylist[index].password;
            copyDiv.unselectable = "off";
            copyDiv.focus();
            document.execCommand('SelectAll');
            document.execCommand("Copy", false, null);
            document.body.removeChild(copyDiv);
        });
        
        var editEntity = $('<a class="btn" title="edit-entity"></a>')
        editEntity.append('<i class="icon-pencil"></i>');
        editEntity.attr({'data-index': i});
        editEntity.on('click',function(){
            var index = parseInt($(this).attr('data-index'));
            var entity = $('#entities tbody tr:eq(' + index + ')');
            entity.children().remove();
            
            $('#add-entity').hide();
            
            entity.attr({id: 'newentity'});
            entity.load('addentityform.html', function(){
                entity.find('#newentity-title').val(passgen.entitylist[index].title);
                entity.find('#newentity-account').val(passgen.entitylist[index].account);
                entity.find('#newentity-password').val(passgen.entitylist[index].password);
                entity.find('#newentity-regenerate').on('click', function(){
                    $('#newentity-password').val(passgen.generateNewPassword());
                });
                entity.find('#newentity-show-password').on('click', function(){
                    var password = $('#newentity-password').val();
                    if($('#newentity-password').attr('type') == 'text'){
                        $('#newentity-password').replaceWith('<input id="newentity-password" class="span8" type="password">');
                        $('#newentity-show-password i').removeClass('icon-eye-close').addClass('icon-eye-open');
                    }else{
                        $('#newentity-password').replaceWith('<input id="newentity-password" class="span8" type="text">');
                        $('#newentity-show-password i').removeClass('icon-eye-open').addClass('icon-eye-close');
                    }
                    $('#newentity-password').val(password);
                });
                entity.find('#newentity-accept').on('click', function(){
                    passgen.entitylist[index].title = $('#newentity-title').val();
                    passgen.entitylist[index].account = $('#newentity-account').val();
                    passgen.entitylist[index].password = $('#newentity-password').val();
                    
                    passgen.save("default", masterPassword);
                    
                    $('#newentity').remove();
                    $('#add-entity').show();
                    updateEntity();
                });
                entity.find('#newentity-cancel').on('click', function(){
                    $('#newentity').remove();
                    $('#add-entity').show();
                    updateEntity();
                });
            });
        });
        
        var removeEntity = $('<a class="btn" title="remove-entity"></a>')
        removeEntity.append('<i class="icon-trash"></i>');
        removeEntity.attr({'data-index': i});
        removeEntity.on('click', function(){
            var index = parseInt($(this).attr('data-index'));
            passgen.entitylist.splice(index, 1);
            passgen.save("default", masterPassword);
            updateEntity();
        });
        
        td.append(showPassword).append(' ')
        .append(copyToClipboard).append(' ')
        .append(editEntity).append(' ').append(removeEntity);
        tr.append(td);
        
        $('#entities tbody').append(tr);
    }
}

masterPassword = undefined;
$(document).ready(function(){
    var validateMasterPassword = function(){
        try{
            var password = $('#master-password-dialog input[name="master-password"]').val();
            password = sjcl.hash.sha256.hash(password);
            password = sjcl.codec.base64.fromBits(password);
            passgen.load('default', password);
            masterPassword = password;
            $('#master-password-dialog').modal('hide');
        }catch(e){
            alert('invalid password');
        }
        
        updateEntity();
        return false;
    }
    $('#submit-master-password').on('click', validateMasterPassword);
    $('#master-password-dialog')
    .on('submit', validateMasterPassword)
    .on('shown', function(){
        $(this).find('input[name="master-password"]').focus();
    }).modal('show');
    
    $('#add-entity').on('click', function(){
        $('#add-entity').hide();
        var newEntity = $(document.createElement('tr'));
        newEntity.attr({id: 'newentity'});
        newEntity.load('addentityform.html', function(){
            newEntity.find('#newentity-password').val(passgen.generateNewPassword());
            newEntity.find('#newentity-regenerate').on('click', function(){
                $('#newentity-password').val(passgen.generateNewPassword());
            });
            newEntity.find('#newentity-show-password').on('click', function(){
                var password = $('#newentity-password').val();
                if($('#newentity-password').attr('type') == 'text'){
                    $('#newentity-password').replaceWith('<input id="newentity-password" class="span8" type="password">');
                    $('#newentity-show-password i').removeClass('icon-eye-close').addClass('icon-eye-open');
                }else{
                    $('#newentity-password').replaceWith('<input id="newentity-password" class="span8" type="text">');
                    $('#newentity-show-password i').removeClass('icon-eye-open').addClass('icon-eye-close');
                }
                $('#newentity-password').val(password);
            });
            newEntity.find('#newentity-accept').on('click', acceptEntity);
            newEntity.find('#newentity-cancel').on('click', cancelEntity);
            $('#entities tbody').append(newEntity); 
        });
    });
    
    $('#generation-rule-dialog').on('show', function(){
        var dialog = $(this);
        dialog.find('input[name="password-length"]').val(passgen.generationRule.passwordLength);
        
        if(passgen.generationRule.useUpperCase){
            dialog.find('input[name="use-upper-case"]').attr({checked: 'checked'});
        }else{
            dialog.find('input[name="use-upper-case"]').removeAttr('checked');
        }
        
        if(passgen.generationRule.useLowerCase){
            dialog.find('input[name="use-lower-case"]').attr({checked: 'checked'});
        }else{
            dialog.find('input[name="use-lower-case"]').removeAttr('checked');
        }
        
        if(passgen.generationRule.useDigit){
            dialog.find('input[name="use-digit"]').attr({checked: 'checked'});
        }else{
            dialog.find('input[name="use-digit"]').removeAttr('checked');
        }
        
        if(passgen.generationRule.useSpecialChars){
            dialog.find('input[name="use-special-characters"]').attr({checked: 'checked'});
            dialog.find('input[name="special-characters"]').removeAttr('disabled');
        }else{
            dialog.find('input[name="use-special-characters"]').removeAttr('checked');
            dialog.find('input[name="special-characters"]').attr({disabled: 'disabled'});
        }
    });
    $('#generation-rule-dialog input[name="use-special-characters"]').on('change', function(){
        if($(this).is(':checked')){
            $('#generation-rule-dialog input[name="special-characters"]').removeAttr('disabled');
        }else{
            $('#generation-rule-dialog input[name="special-characters"]').attr({disabled: 'disabled'});
        }
    });
    $('#change-generation-rule').on('click', function(){
        var dialog = $('#generation-rule-dialog');
        passgen.generationRule.passwordLength = parseInt(dialog.find('input[name="password-length"]').val());
        passgen.generationRule.useUpperCase = dialog.find('input[name="use-upper-case"]').is(':checked');
        passgen.generationRule.useLowerCase = dialog.find('input[name="use-lower-case"]').is(':checked');
        passgen.generationRule.useDigit = dialog.find('input[name="use-digit"]').is(':checked');
        passgen.generationRule.useSpecialChars = dialog.find('input[name="use-special-characters"]').is(':checked');
        passgen.generationRule.specialChars = dialog.find('input[name="special-characters"]').val();
        $('#generation-rule-dialog').modal('hide');
    });
    
    $('#dump').on('click',function(){
        var bb = new WebKitBlobBuilder();
        bb.append(passgen.dump());
        var blob_url = window.webkitURL.createObjectURL(bb.getBlob());
        $("#dump").attr({"href": blob_url, "download": "dumpdata.psg"});
    });
});
