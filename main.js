function showPasswordRule(){
    if($('div.generation-rule').is(':hidden')){
        $('#show-password-rule').text('Hide generation rule');
        $('div.generation-rule').slideDown();
    }else{
        $('#show-password-rule').text('Show generation rule');
        $('div.generation-rule').slideUp();
    }
}

function changeGenerationRule(e){
    console.log(e);
}

function updateEntity(){
    for(var i = 0;i < entitylist.length;i++){
        var tr = $(document.createElement('tr'));
        var name = $(document.createElement('td'));
        name.text(entitylist[i].name);
        var id = $(document.createElement('td'));
        id.text(entitylist[i].id);
        var password = $(document.createElement('td'));
        var passwordInput = $(document.createElement('input'));
        passwordInput.attr({type: 'password'});
        passwordInput.attr({style: 'margin-bottom: 0px;'});
        passwordInput.val(entitylist[i].password);
        password.append(passwordInput);
        password.append(' <a class="btn btn-mini"><i class="icon-eye-open"></i></a>');
        password.append(' <a class="btn btn-mini"><i class="icon-list-alt"></i></a>');
        
        tr.append(name).append(id).append(password);
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
    
    $('#show-password-rule').on('click', showPasswordRule);
    $('#entity-dialog div.generation-rule input').on('change', changeGenerationRule);
    $('#entity-dialog').on('show', function(){
        $(this).find('div.modal-header h3').text('Add entity');
        $('div.generation-rule').hide();
    });
});
