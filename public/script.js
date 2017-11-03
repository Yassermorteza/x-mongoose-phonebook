var table = document.querySelector('.table');
var mailField = document.querySelector('.mail-field');
var mailTo = document.getElementById('mailto');
var hobby = document.querySelector('.list-group');
var bgBlur = document.querySelector('.bg-blur');
var sendBtn = document.querySelector('.btn-send');
var closeBtn = document.querySelectorAll('#close');
var mailSucMsg = document.querySelector('.email-success-msg');
var formContact = document.querySelector('.contact_form-show');
var addContact = document.querySelector('.addContact');
var newUser = document.querySelector('#contactForm');
var deleteWindow = document.querySelector('.delete-window');
var confirmBtn = document.querySelector('.confirmBtn');
var cancelBtn = document.querySelector('.cancelBtn');

function loadData(){ 
  fetch('get_contacts')
  .then(response=> response.json())
  .then(renderTable)
  .catch(err=> console.log(err));
}

loadData();

function renderTable(data){

   data.forEach(el=> {
    var tr = document.createElement('tr');
   	tr.innerHTML = `<td><img class="avatar" src="/upload/${el.avatar}"></td><td>${el.name}</td><td>${el.lastname}</td><td>${el.email}</td><td>${el.phone}</td><td class="mail">&#9993;</td><td id=${el._id} onClick="sendId(event)" class="hobby" data-toggle="modal" data-target="#myModal">&#8258;
    </td><td class="delete" id=${el._id}>&#10007;</td>`;
    tr.classList.add('row');
    table.appendChild(tr);
   }); 
   getMail();
   deleteItem();
}

formContact.addEventListener('click',()=>{
  addContact.style.display = 'block';
  bgBlur.style.display = 'block';
});

newUser.addEventListener('submit',e=>{
  e.preventDefault();
  var data = new FormData(newUser);
  fetch('add_contact',{
    method: 'POST',
    body: data
  }).catch(err=> console.log(err));
  displayNone();
  location.reload();
});

function getMail(){
	var mails = document.querySelectorAll('.mail');
  mails.forEach(el => el.addEventListener('click',(e)=>{
     var email = e.target.parentElement.childNodes[3].textContent;
     mailField.style.display = "block"; 
     bgBlur.style.display = "block";
     mailTo.value = email;   
  }));
}

sendBtn.addEventListener('click', (e)=>{
   e.preventDefault();
   var formData = new formData();

   fetch('send-mail', {
         method: 'POST',
         body: JSON.stringify(mail),
         headers:{'Content-Type': 'text/plain'}
   }).then(res=> res.json()).then(emailMsg).catch(err=> console.log(err));
});

function emailMsg(data){
  mailSucMsg.innerHTML = data.feedback;
  mailSucMsg.style.display = "block";
  display();
  var displayTime = setTimeout(()=>{mailSucMsg.style.display = "none"; },3500)
}

bgBlur.addEventListener('click', displayNone);
closeBtn.forEach(el=> el.addEventListener('click', displayNone));
cancelBtn.addEventListener('click', displayNone);

function displayNone(){
   mailField.style.display = "none";
   bgBlur.style.display = "none";
   addContact.style.display = "none";
   deleteWindow.style.display = "none";
}

function sendId(event){
  var id = event.target.id;
  var url = `hobby/${id}`;
  fetch(url, {method: 'POST'})
  .then(res=> res.json()).then(loadHobbies).catch(err=> console.log(err)); 
}

function loadHobbies(data){
   hobby.style.display = "block";
   var spinner = "<i class='fa fa-circle-o-notch fa-spin' style='font-size:24px'></i>";
   hobby.innerHTML = spinner;
   var timeOut = setTimeout(()=>{
                  hobby.innerHTML=''; 
                  data.hobbies.forEach(el=> hobby.innerHTML +=`<li class="list-group-item">${el.hobby}</li>` );
                },700);
}

function deleteItem(){
  var deleteBtn = document.querySelectorAll('.delete');
  deleteBtn.forEach(el=>{ el.addEventListener('click', e=>{
        deleteWindow.style.display = 'block';
        bgBlur.style.display = 'block';
        var id = e.target.id;
        var url = `delete/${id}`;
        confirmBtn.addEventListener('click',()=>{
          fetch(url, { method: 'delete'})
          .catch(err=> console.log(err));
          displayNone();
        });
    });
  });

}
