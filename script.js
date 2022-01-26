const form = document.getElementById("form");
// Dom här innehåller de olika inputsen på hemsidan. Jag använder dom är för att komma åt värderna.
const fname = document.getElementById("fname");
const lname = document.getElementById("lname");
const email = document.getElementById("email");
// Dom här innehåller error elementen på hemsidan. Dom skriver ut i röd färg vad som är fel.
const fnameError = document.getElementById("fnameError");
const lnameError = document.getElementById("lnameError");
const emailError = document.getElementById("emailError");

const divlist = document.getElementById("divlist");

const submitBtn = document.getElementById("submitBtn");

// Array som kommer innehålla userObjects
let userList = [];

let userListElements = [];
// Variable för att avgöra ifall man är i editing mode eller inte
let editMode = false;
// Variable som används för att specifisera vilken Userobject som ska editas
let EditingUserId = 0;
// Lägger in den editmode mailen för att "godkänna" att den redigerande objektets email får collida
let EditingUserEmail = "";

form.addEventListener('submit',(e)=>{

let messagesFname = [];
let messagesLname = [];
let messagesEmail = [];


// Den här funktionen validerar ifall input argumentet är tomt eller inte samt kollar ifall den innehåller några special characters.
function validateifLettersOrEmpty(input,message){

    input.classList.add("isValid")
    if(input.value === '' || input.value == null){
        message.push('Cant be empty')
        input.classList.add("isInvalid")
        input.classList.remove("isValid")
    }
    else if(input.value.length < 2){
        message.push('Cant be less then 2 letters')
        input.classList.add("isInvalid")
        input.classList.remove("isValid")
    }
    var letters = /^[A-Öa-ö]+$/;
    // let regEx = /\d/

    // if(regEx.test(input.value))

    if((!input.value.match(letters)) && input.value !== '')
    {
        message.push('Only letters are allowed')
        input.classList.add("isInvalid")
        input.classList.remove("isValid")
    }
    
}

// Kollar ifall array har en längd på mer än 0 och isåfall tar först bort all text som kanske var där innan från ett tidigare fel och sen skriver ut medeleandet i errorelementet
function pushOutErrors(message,errorElement){
    if(message.length>0)
    {
        errorElement.innerText = "";
        errorElement.innerText = message.join(', ');
        message = [];
        e.preventDefault();

    }

}
// En function för att ta bort texten i error elementen
function clearErrors(){
    fnameError.innerText = "";
    lnameError.innerText = "";
    emailError.innerText = "";

    // messagesEmail.innerText = "";
}
// Validerar emailen. Kollar ifall det är tomt / är en valid email / Ifall mailen redan används pushar in sedan en string i message arrayn 
function emailValidation(input,message,editmode = false){
    
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    input.classList.add("isValid")
    if(input.value === '' || input.value == null){
        message.push('Cant be empty')
        input.classList.add("isInvalid")
        input.classList.remove("isValid")
    }
    else if((!input.value.match(mailformat)) && input.value !== ''){
        message.push('Must be a valid email adress')
        input.classList.add("isInvalid")
        input.classList.remove("isValid")
    }
    if(collidingEmailAdress(input.value)) {
        message.push('email already in use')
        input.classList.add("isInvalid")
        input.classList.remove("isValid")
    }

}
// Kollar ifall argumentens input value colliderar med någon av dom inlagda usersen emails samt returnerar ett true/false ifall det gör det eller inte.
function collidingEmailAdress(email){

    for (let i = 0; i < userList.length; i++) {
        if(email == userList[i].email)
        {
            if(editMode == false){
                return true;
            }
            else{
                if(EditingUserEmail == userList[i].email){

                    return false;
                }
                else return true;
            }
            

        }
    }
    return false;
}
// Kollar ifall det är tillåtet att submitta infon och skapa en ny user. Detta görs genom att returna ett true ifall är som det ska. 
// Det här gemför alltså alla input värden ifall dom är korrekta
function returnIfValid(input1,input2,input3,editmode = false){


    var letters = /^[A-Öa-ö]+$/;
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    // Kollar ifall förnamn är tomt/null eller ifall förnamnet innhåller några otillåtna tecken och inte är tomt. Returnerar att "valid" är false ifall något av det här stämde.
    if((input1.value === '' || input1.value == null) || ((!input1.value.match(letters)) && input1.value !== '') || input1.value.length < 2){
        return false;
    }
     // Kollar ifall efternamnetnamn är tomt/null eller ifall efternamnet innhåller några otillåtna tecken och inte är tomt. Returnerar att "valid" är false ifall något av det här stämde.
    else if((input2.value === '' || input2.value == null) || ((!input2.value.match(letters)) && input2.value !== '')|| input2.value.length < 2){
        return false;
    }
     // Kollar ifall emailen är tomt/null eller ifall emailen ser ut som en email ska göra och inte är tomt. Returnerar att "valid" är false ifall något av det här stämde.
    else if((input3.value === '' || input3.value == null) || (!input3.value.match(mailformat)) &&  input3.value !== ''){
        return false;
    }
    // Kollar ifall emailen som inputtas redan finns inlagd inom något av user objecten. collidingEmailAdress() returnerar sedan tillbaka true/false. 
    // Kollar också ifall man är i editing mode eller inte då man ska kunna ändra object å fortfarande skicka tillbaka samma email som kanske redan finns inlagd. 
    else if(collidingEmailAdress(input3.value)){
        return false;
    }
    else return true;
}
// Tar bort alla classer som kanske lagts på inputsen i formet för att gå tillbaka till grått. Så att det inte fastnar på t.ex grönt eller rött.
function removeClasslist(input){
    input.value = "";
    input.classList.remove("isValid")
    input.classList.remove("isInvalid")
}
// Kollar ifall alla inputs är valid via returnIfValid samt lägger in tempUser Objectet i userlist Arrayen.
function createUser(){

    if(returnIfValid(fname,lname,email))
    {
        let tempUser = {
        id: Date.now().toString(),
        firstname: fname.value,
        lastname: lname.value,
        email: email.value
        }
        userList.push(tempUser);
        console.log(tempUser);

        removeClasslist(fname);
        removeClasslist(lname);
        removeClasslist(email);
        // Ändrar tillbaka submit texten till Submit
        submitBtn.value = "Submit";
    }
    e.preventDefault();

}

// Skapar ett user element på hemsidan genom att skapa divsen, paragraferna med argumenten värden som skickas in samt knapparna.
function createUserElement(fname,lname,email,userlistId)
{

    // Skapar hela user elementet med card diven som grunden
    let card = document.createElement("div");
    card.classList.add("user");

    // Diven som ska ha för och efternamn i sig
    let combinedNameDiv = document.createElement("div");
    combinedNameDiv.classList.add("combinedName");
    // Förnamn
    let fnamePara = document.createElement("p");
    fnamePara.innerHTML = fname
    // Efternamn
    let lnamePara = document.createElement("p");
    lnamePara.innerHTML = lname
    // Email paragrafen
    let emailPara = document.createElement("p");
    emailPara.classList.add("mailpara");
    emailPara.innerHTML = email
    // Diven som ska innehåla deleten button och edit button
    let buttonDiv = document.createElement("div");
    buttonDiv.classList.add("buttonDiv");
    
    // Delete button
    let deleteButton = document.createElement('button');
    deleteButton.classList.add("deleteBtn");
    deleteButton.innerText = 'Delete';

    let editButton = document.createElement('button');
    editButton.classList.add("editBtn");
    editButton.innerText = "Edit";

    
    


    // Kopplar ihop name diven med card samt kopplar ihop fname och lname 
    card.appendChild(combinedNameDiv);
    combinedNameDiv.appendChild(fnamePara);
    combinedNameDiv.appendChild(lnamePara);
    // Kopplar ihop emailparagrafen med card
    card.appendChild(emailPara);
    // Kopplar ihop button div med card samt buttons med button div
    card.appendChild(buttonDiv);
    buttonDiv.appendChild(deleteButton);
    buttonDiv.appendChild(editButton);
    // Lägger delete functionen på delete button
    deleteButton.addEventListener('click', () => removeUser(userlistId))
    // Lägger edit functionen på edit button
    editButton.addEventListener('click', () => editUserInformation(userlistId))
    userListElements.push(card)

    // Retunerar cardet så att det kan enkelt kopplas ihop med userlistan
    return card;
}
// Jämför argument value med värden i arrayen och sedan vid en match tar bort värdet via splice
function removeUser(user)
{
    // Söker efter matchen i arrayen 
    for (let i = 0; i < userList.length; i++) {
       if(userList[i] == user)
       {
           userList.splice(i,1);
           // Stänga av editmode fixade en bugg som existerade tidigare. Detta avbryter alltså edit mode ifall man skulle ta bort någon object under tiden man editar
           editMode = false;
           submitBtn.value = "Submit";
       }
    }
    // Kallar på listusers funktionen för att ta bort alla user elements och sen "rita" ut dom igen.
    listUsers();

}
// Tar först bort alla userelement på hemsidan och sen skapar dom igen. Den här kallas när man skapar en ny user samt tar bort en.
function listUsers()
{
    // Tar bort alla element först
    for (let i = 0; i < userListElements.length; i++) {
        userListElements[i].remove()
    }
     // Skriver sedan ut dom igen.
    for (let i = 0; i < userList.length; i++) {
        divlist.appendChild(createUserElement(userList[i].firstname,userList[i].lastname,userList[i].email,userList[i]));
    }
    // Skrev detta för att slippa skriva om mycket av min kod. Inget vacker med den löste problemet.
}
// Ändrar input värderna till user objectets värden som man tänker ändra. Submit knappen ändras till edit för att försöka göra det lite tydligare att man redigerar en users information.
function editUserInformation(user){

    fname.value = user.firstname;
    lname.value = user.lastname;
    email.value = user.email;

    EditingUserId = user.id;
    EditingUserEmail = user.email;
    submitBtn.value = "Edit";

    editMode = true;

}

// Det här är kopplat till Edit user information funktionen. Kollar ifall allt är valid, och ifall det är det så sätter den input värderna till det objektet som man ville ändra.
function updateUserInformation(userlist){
    
    if(returnIfValid(fname,lname,email,true))
    {
        userlist.firstname = fname.value;
        userlist.lastname = lname.value;
        userlist.email = email.value;
        // Ändrar tillbaka editinguserId till sitt orginal värde så att det iallafall inte råkar behålla det tidigare värdet.
        EditingUserId = 0;
        EditingUserEmail = "";
        // "Stänger" av editmode
        editMode = false;

        removeClasslist(fname);
        removeClasslist(lname);
        removeClasslist(email);
        // Ändrar tillbaka knappens text till submit. Ifrån Edit
        submitBtn.value = "Submit";
        
    }
    e.preventDefault();

}

// Clear errors fixar ifall det skulle finnas någon text som fastnar efter ett tidigare försök att submita
clearErrors();
// Kollar ifall man är i edit mode eller inte.
// Ifall man är i edit mode så validerar den allting och kollar ifall input information är giltig för att skickas in först.
// Sen så ändrar den objectets värden ifall allt stämmer
if (editMode == true){

    for (let i = 0; i < userList.length; i++) {
        if(userList[i].id == EditingUserId)
        {

            validateifLettersOrEmpty(fname,messagesFname);
            pushOutErrors(messagesFname,fnameError);

            validateifLettersOrEmpty(lname,messagesLname);
            pushOutErrors(messagesLname,lnameError);
            
            emailValidation(email,messagesEmail,true);
            pushOutErrors(messagesEmail,emailError);
            // Skickar userlist objectet som stämmde överens med id som man ville edita.
            updateUserInformation(userList[i]);

        }
        
     }
    

    e.preventDefault();
}
else{
    // Ifall man inte är i edit mode så försöker man skapa ett nytt user object samt skapa ett element efter objektet.
    // Validerar förnamn, efternamn, samt email. Skriver åt felen i ett error element som är inglagt på hemsidan. 
    // Det kollas också i create User ifall allting är valid yttligare en gång. 
    validateifLettersOrEmpty(fname,messagesFname);
    pushOutErrors(messagesFname,fnameError);

    validateifLettersOrEmpty(lname,messagesLname);
    pushOutErrors(messagesLname,lnameError);

    emailValidation(email,messagesEmail);
    pushOutErrors(messagesEmail,emailError);
    createUser();
}
// Funktionen kallas igen ifall det skulle lagts till någon user eller någonting ändrats
listUsers();

})