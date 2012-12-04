function acceptEntity(){
    var entity = new passgen.Entity();
    entity.name = $('#newentity-name').val();
    entity.id = $('#newentity-id').val();
    entity.password = $('#newentity-password').val();
    entitylist.push(entity);
    
    $('#newentity').remove();
    $('#add-entity').show();
    updateEntity();
}

function cancelEntity(){
    $('#newentity').remove();
    $('#add-entity').show();
}

function changeGenerationRule(e){
    console.log(e);
}

function updateEntity(){
    $('#entities tbody *').remove();
    for(var i = 0;i < entitylist.length;i++){
        var tr = $(document.createElement('tr'));
        var td = $(document.createElement('td'));
        td.text(entitylist[i].name);
        tr.append(td);
        
        td = $(document.createElement('td'));
        td.text(entitylist[i].id);
        tr.append(td);
        
        td = $(document.createElement('td'));
        var str = '';
        for(var j= 0;j < entitylist[i].password.length;j++){
            str += '*';
        }
        td.text(str);
        tr.append(td);
        
        td = $(document.createElement('td'));
        td.attr({style: 'white-space: nowrap;'});
        td.append(' <a class="btn" title="show-password"><i class="icon-eye-open"></i></a>');
        td.append(' <a class="btn" title="copy password to clipboard"><i class="icon-list-alt"></i></a>');
        td.append(' <a class="btn" title="edit-entity"><i class="icon-pencil"></i></a>');
        tr.append(td);
        
        $('#entities tbody').append(tr);
    }
}

entitylist = [new passgen.Entity(), new passgen.Entity()];
$(document).ready(function(){
    // Sampel data
    entitylist[0].name = 'Amazon';
    entitylist[0].id = 'id@example.com'
    entitylist[0].password = 'password';
    entitylist[1].name = 'Google';
    entitylist[1].id = 'id2@example.com'
    entitylist[1].password = 'password';
    
    updateEntity();
    
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
                }else{
                    $('#newentity-password').replaceWith('<input id="newentity-password" class="span8" type="text">');
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
});
