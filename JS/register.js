document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    let isEmailValid = false;

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        registerUser();
    });

    $("#setpassword, #confirmpassword").on('input', function () {
        validatePasswords();
    });

    $("#mail").on('input', function () {
        validateEmail();
    });

    function registerUser() {
        const fname = $("#fname").val();
        const lname = $("#lname").val();
        const email = $("#mail").val();
        const setpass = $("#setpassword").val();
        const confirmpass = $("#confirmpassword").val();

        document.getElementById('password-status').innerHTML = "";

        if (!fname || !lname || !email || !setpass || !confirmpass) {
            document.getElementById('password-status').innerHTML = "All fields must be filled.";
            return;
        }

        if (setpass !== confirmpass) {
            document.getElementById('password-status').innerHTML = "Passwords do not match.";
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        if (!passwordRegex.test(setpass)) {
            document.getElementById('password-status').innerHTML = "Password must contain at least:<br> one special character<br>one uppercase letter<br>one lowercase letter<br>one digit<br>and be at least 8 characters long.";
            return;
        }

        if (!isEmailValid) {
            document.getElementById('mail-status').innerHTML = "Please enter a valid email.";
            return;
        }

        $.ajax({
            type: 'POST',
            url: '../Php/register.php',
            data: { mail: email, password: confirmpass, fname: fname, lname: lname },
            success: function (data) {
                localStorage.setItem('userEmail', data);
                window.location.href = '../login.html';
            }
        });
    }

    function validatePasswords() {
        const setPassword = $("#setpassword").val();
        const confirmPassword = $("#confirmpassword").val();
        const passwordStatus = document.getElementById('password-status');

        passwordStatus.innerHTML = "";

        if (setPassword !== confirmPassword) {
            passwordStatus.innerHTML = "Passwords do not match.";
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        if (!passwordRegex.test(setPassword)) {
            passwordStatus.innerHTML = "Password must contain at least:<br> one special character<br>one uppercase letter<br>one lowercase letter<br>one digit<br>and be at least 8 characters long.";
        }
    }

    function validateEmail() {
        const email = $("#mail").val();
        const mailStatus = document.getElementById('mail-status');
        mailStatus.innerHTML = "";

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email === "") {
            mailStatus.innerHTML = "Email is required.";
            isEmailValid = false;
            return;
        } else if (!emailRegex.test(email)) {
            mailStatus.innerHTML = "Invalid email format.";
            isEmailValid = false;
            return;
        }

        // url = '../Php/idvalidate.php';
        // option = {
            // method: POST,
            // body: { mail: email }
        //}

        // fetch(url, option).then((res)=> res.json()).then(fun)

        $.ajax({
            type: 'POST',
            url: '../Php/idvalidate.php',
            data: { mail: email },
            success: function (data) {
                if (data === "true") {
                    mailStatus.innerHTML = "User with this mailId already exists";
                    isEmailValid = false;
                } else {
                    mailStatus.innerHTML = "";
                    isEmailValid = true;
                }
            }
        });
    }
});
