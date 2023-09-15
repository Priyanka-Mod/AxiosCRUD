const urlIntance = axios.create({
    baseURL: 'https://dummyapi.io/data/v1/user/',
    headers: {
        'app-id': '64ff080a30fdb6fb1c516d6e',
    },
    params: {
        limit: 6
    }
});
let users = [];
let selectedUserId = null;

const userFirstName = document.getElementById('firstname');
const userLastName = document.getElementById('lastname');
const userEmail = document.getElementById("email");
const userAvatar = document.getElementById('avatar--link');

const submitButton = document.getElementById('submit')
submitButton.addEventListener("click", (event) => {
    event.preventDefault();
    if(selectedUserId) {
        editUser(selectedUserId);
    } else {
        addUser();
    }
});

async function getUser() {
    try {
        const response = await urlIntance.get();
        document.getElementById("table__body").innerHTML = ""
        for (let i = 0; i < response.data.data.length; i++) {
            document.getElementById("table__body").innerHTML += `<tr class="row"> 
                <td class="table__column" onclick="editForm('${response.data.data[i]['id']}')"><img src='${response.data.data[i]['picture']}'/></td>
                <td class="table__column" onclick="editForm('${response.data.data[i]['id']}')">${response.data.data[i]['firstName']} </td>
                <td class="table__column" onclick="editForm('${response.data.data[i]['id']}')">${response.data.data[i]['lastName']}</td>
                <td class="table__column" ><button class="delete_button" onclick="delUser(this)" value="${response.data.data[i]['id']}"><i class="fa fa-trash"></i></button></td>
                </tr>`;
        }
    } catch (error) {
        console.log(error);
    }
}
getUser();

function delUser(id) {
    let delId = id.value;
    urlIntance.delete(`/${delId}`);
    alert('user deleted sucessfully')
    getUser()
}

function editForm(id) {
    let form = document.getElementById("form__container");
    if (window.getComputedStyle(form).display === "none") {
        form.style.display = "block";
        form.style.width = "30%";
    }
    document.getElementById('form__header').innerHTML = "Update User";
    document.getElementById('add__user').style.display = 'block';
    urlIntance.get(`/${id}`)
        .then((res) => {
            selectedUserId = res.data.id;
            userFirstName.value= res.data.firstName;
            userLastName.value = res.data.lastName;
            userEmail.value = res.data.email;
            userAvatar.value = res.data.picture;
        })

        .catch(err => { console.log(err) })
}

function editUser(userID) {
    const updateFirstname = userFirstName.value;
    const updateLastname = userLastName.value;
    const updateEmail = userEmail.value;
    const updateAvatar = userAvatar.value;
    const imageUrlPattern = /^(http|https):\/\/\S+\.(jpg|jpeg|png)$/i;
    const validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/i;

    if (updateFirstname.trim() === "" || updateLastname.trim() === "" || updateAvatar.trim() === "" || updateEmail === "") {
        alert('Please fill all fields.');
        return false
    }
    else if (!imageUrlPattern.test(updateAvatar)) {
        alert('Invalid image URL');
        return false
    }
    else if (!validEmail.test(updateEmail)) {
        alert("Invalid email")
        return false
    }
    else alert("User updated sucessfully")
    document.getElementById('form__container').style.display = 'none';
    document.getElementById('add__user').style.display = 'block';
    urlIntance.put(`/${userID}`, {
        firstName: userFirstName.value,
        lastName: userLastName.value,
        email: userEmail.value,
        picture: userAvatar.value
    })
        .then((res) => {
            userFirstName.value = "";
            userLastName.value = "";
            userEmail.value = "";
            userAvatar.value = "";
            getUser();
            selectedUserId = null;
            
        })
        .catch(err => { 
            console.log(err);
            selectedUserId = null;
        });
}

document.getElementById("add__user").addEventListener("click", () => newUserForm())

function newUserForm() {
    selectedUserId = null;
    const add = document.getElementById("add__user")
    add.style.display = 'none';
    let form = document.getElementById("form__container");

    document.getElementById('form__header').innerHTML = "Add User";
    userFirstName.value = "";
    userLastName.value = "";
    userEmail.value = "";
    userAvatar.value = "";
    if (window.getComputedStyle(form).display === "none") {
        form.style.display = "block";
        form.style.width = "30%";
    }
}

function addUser() {
    selectedUserId = null;
    const newFirstname = userFirstName.value;
    const newLastname = userLastName.value;
    const newEmail = userEmail.value;
    const newAvatar = userAvatar.value;
    const imageUrlPattern = /^(http|https):\/\/\S+\.(jpg|jpeg|png)$/i;
    const validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/i;
    if (newFirstname.trim() === "" || newLastname.trim() === "" || newAvatar.trim() === "" || newEmail === "") {
        alert('Please fill all fields.');
        return false
    }
    else if (!imageUrlPattern.test(newAvatar)) {
        alert('Invalid image URL');
        return false
    }
    else if (!validEmail.test(newEmail)) {
        alert("Invalid email")
        return false
    }
    else alert("User created sucessfully")

    document.getElementById("form__container").style.display = 'none'
    document.getElementById("form__container").style.width = '0%'
    document.getElementById('add__user').style.display = 'block';
    urlIntance.post('/create', {
        firstName: newFirstname,
        lastName: newLastname,
        email: newEmail,
        picture: newAvatar
    })
        .then((res) => {
            getUser()
        })
        .catch(err => { console.log(err) })
}