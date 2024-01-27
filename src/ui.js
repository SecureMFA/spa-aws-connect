// Select DOM elements to work with
const signInButton = document.getElementById('signIn');
const signOutButton = document.getElementById('signOut');
const titleDiv = document.getElementById('title-div');
const welcomeDiv = document.getElementById('welcome-div');
const tableDiv = document.getElementById('table-div');
const tableBody = document.getElementById('table-body-div');
const infoDiv = document.getElementById('centered-text-info');
const toDoForm = document.getElementById('form');
const textInput = document.getElementById('textInput');
const toDoListDiv = document.getElementById('groupDiv');
const todoListItems = document.getElementById('toDoListItems');

function welcomeUser(username) {
    signInButton.classList.add('d-none');
    signOutButton.classList.remove('d-none');
    titleDiv.classList.add('d-none');
    infoDiv.classList.remove('d-none');
    welcomeDiv.classList.remove('d-none');
    welcomeDiv.innerHTML = `SSO Authenticated user: ${username}`;
    //Get Widget JWT for chat session
    getWidgetJWT();

}

function widget(jwt) {

    // ----------- Replace the AWS widget script only below --------- Do not include <script type="text/javascript"> &  </script> values	
    (function(w, d, x, id){
    s=d.createElement('script');
    s.src='https://d2zasqxhmd6ne4.cloudfront.net/amazon-connect-chat-interface-client.js';
    s.async=1;
    s.id=id;
    d.getElementsByTagName('head')[0].appendChild(s);
    w[x] =  w[x] || function() { (w[x].ac = w[x].ac || []).push(arguments) };
    })(window, document, 'amazon_connect', '16ac5395-77ac-4b36-bca3-c56ec92993e7');
    amazon_connect('styles', { iconType: 'CHAT', openChat: { color: '#ffffff', backgroundColor: '#123456' }, closeChat: { color: '#ffffff', backgroundColor: '#123456'} });
    amazon_connect('snippetId', 'QVFJREFIajB2ZWh0V0phclVpYUZ6M3pLNlhsbzI5ZENWTXp0dUl0L20zMmpCN0ltRGdHL0VXN2t1Wk9OellRVnFEOHc2d3liQUFBQWJqQnNCZ2txaGtpRzl3MEJCd2FnWHpCZEFnRUFNRmdHQ1NxR1NJYjNEUUVIQVRBZUJnbGdoa2dCWlFNRUFTNHdFUVFNMUFocjN4WTE1Vm1HVVJhYUFnRVFnQ3VVWUh2cVNCTHprR0FSVmJpVWJYWGFjT1NoZmk0RnJjQ1l1NUdjOTFnT0ZUQ2pURkZsSWYrWEZqNlY6OjNmR3kzNUhMMVRETTdTNThrKzZqNjNzWitJa1l6Z1hxMGlGOHBsUVR1YnozNlg2NlczaFY5ZG5FalpCN3QvcENCRHFUK2UyY2QrV2xEdTdBc0pWc1pnRjBEZktxbndZZUw2d252eGxMcjR1QlJkVWdpV3h5Z1lmNCtabVdWSXdwTkZkOXlPR0NaUlFjTTdHQmxWTWU3TnR3amNDUlc4UT0=');
    amazon_connect('supportedMessagingContentTypes', [ 'text/plain', 'text/markdown' ]);
    // ----------- Replace the AWS widget script only above ---------	Do not include <script type="text/javascript"> &  </script> values
           
     amazon_connect('customerDisplayName', function(callback) {const displayName = `${username}`; callback(displayName);});
     amazon_connect('authenticate', function(callback) {  callback(jwt)});
     //Comment out below in production
     console.log('jwtaudit:' + jwt);
};

function showJWTItems(response) {    
    
    const promise = response.text();    
    promise.then((yourJWT) => {
        //console.log('widget jwt:' + yourJWT);
        widget(yourJWT);
    });
    
}

function updateTable(account) {
    tableDiv.classList.remove('d-none');
    const tokenClaims = createClaimsTable(account.idTokenClaims);    
    
    Object.keys(tokenClaims).forEach((key) => {
        if (tokenClaims[key][0] == 'name') {
            let row = tableBody.insertRow(0);
            let cell1 = row.insertCell(0);
            let cell2 = row.insertCell(1);
            let cell3 = row.insertCell(2);
            cell1.innerHTML = tokenClaims[key][0];
            cell2.innerHTML = tokenClaims[key][1];
            cell3.innerHTML = tokenClaims[key][2];
          }
        else if (tokenClaims[key][0] == 'preferred_username') {
            let row = tableBody.insertRow(0);
            let cell1 = row.insertCell(0);
            let cell2 = row.insertCell(1);
            let cell3 = row.insertCell(2);
            cell1.innerHTML = tokenClaims[key][0];
            cell2.innerHTML = tokenClaims[key][1];
            cell3.innerHTML = tokenClaims[key][2];
        } 
        else if (tokenClaims[key][0] == 'email') {
            let row = tableBody.insertRow(0);
            let cell1 = row.insertCell(0);
            let cell2 = row.insertCell(1);
            let cell3 = row.insertCell(2);
            cell1.innerHTML = tokenClaims[key][0];
            cell2.innerHTML = tokenClaims[key][1];
            cell3.innerHTML = tokenClaims[key][2];
          }

        
    });

}

function showToDoListItems(response) {
    todoListItems.replaceChildren();
    tableDiv.classList.add('d-none');
    toDoForm.classList.remove('d-none');
    toDoListDiv.classList.remove('d-none');
    if (!!response.length) {
        response.forEach((task) => {
            AddTaskToToDoList(task);
        });
    }
}

function AddTaskToToDoList(task) {
    let li = document.createElement('li');
    let button = document.createElement('button');
    button.innerHTML = 'Delete';
    button.classList.add('btn', 'btn-danger');
    button.addEventListener('click', () => {
        handleToDoListActions(task, 'DELETE', protectedResources.fqdnWebAPI.endpoint + `/${task.id}`);
    });
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    li.innerHTML = task.description;
    li.appendChild(button);
    todoListItems.appendChild(li);
}
