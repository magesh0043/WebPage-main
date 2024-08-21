$(document).ready(function () {
    const token = localStorage.getItem('session_token');
    const email = localStorage.getItem('email');
    console.log(token);
    console.log(email);
    let data = `email=${email}&token=${token}`;
    console.log(data);
    if (token) {
        // Fetch user information
        $.ajax({
            url: '../Php/profile.php',
            type: 'GET',
            data: data,
            success: function (data) {
                data = JSON.parse(data);
                if (data.error) {
                    console.log(data.error);
                    window.location.href = 'login.html';
                } else {
                    console.log(data);
                    $('#fname').text(data.fname);
                    $('#lname').text(data.lname);
                    $('#age').text(data.age);
                    $('#gender').val(data.gender);
                    $('#mailid').val(data._id);
                    $('#mobile').val(data.mobile);
                    $('#dob').val(data.dob);
                }
            },
            error: function () {
                console.log('An error occurred while fetching user information.');
            }
        });

        // Update user information
        $('#edit-btn').click(function () {
            $('#status').text(" ");
            const fname = $('#fname').text();
            const lname = $('#lname').text();
            const dob = $('#dob').val();
            var year = new Date(dob).getFullYear();
            var curryear = new Date().getFullYear();
            const age = curryear - year;
            const userEmail = $('#mailid').val();
            const gender = $('#gender').val();
            const mobile = $('#mobile').val();

            // Validate mobile number length
            if (mobile.length != 10) {
                $('#status').text('Mobile number must be exactly 10 digits long.').css('color', 'red');
                return;
            }
            if (age < 12) {
                $('#status').text('user must be atleast 12 years old').css('color', 'red');
                return;
            }

            $.ajax({
                type: 'POST',
                url: '../Php/update.php',
                data: {
                    id: userEmail,
                    fname: fname,
                    lname: lname,
                    dob: dob,
                    age: age,
                    gender: gender,
                    mobile: mobile
                },
                success: function (data) {
                    data = JSON.parse(data);
                    if (data.error) {
                        console.log(data.error);
                    } else {
                        // Update the DOM elements immediately
                        $('#fname').text(data.fname);
                        $('#lname').text(data.lname);
                        $('#age').text(data.age);
                        $('#gender').val(data.gender);
                        $('#mailid').text(data._id);
                        $('#mobile').text(data.mobile);
                        $('#dob').val(data.dob);
                        $('#status').text('Profile updated successfully.').css('color', 'green');
                    }
                },
                error: function (xhr, status, error) {
                    $('#status').text('');
                    console.error('AJAX Error: ' + status + error);
                }
            });
        });
    } else {
        console.log('No user logged in.');
    }
});