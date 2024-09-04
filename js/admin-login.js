window.addEventListener('load', () => {
    Swal.fire({
        icon: "info",
        html: `use your index number as your admin ID <br/><strong>Note</strong> Only group members can login`,
    })
})

btn = document.querySelector('.btn').addEventListener('click', (e) => {

    e.preventDefault()
    const AdminIDs = [
        'UEB3211422', 'UEB3261222', 'UEB3201022', 'UEB3207522', 'UEB3235022', 'UEB3238122',
        'UEB3202622', 'UEB3246822', 'UEB32563', 'UEB3229022'
    ]

    adminInput = document.getElementById('adminInput').value;
    if (adminInput.trim() !== '') {
        if (AdminIDs.includes(adminInput)) {
            window.location.href = "admin.html";

        } else {
            Swal.fire({
                icon: 'error',
                html: `Invalid AdminID<b> you must be part of ITA group2 before you can login </b>`,
            })
        }

    } else {
        Swal.fire('Admin Id required', 'info')
    }
    adminInput.value = "";
})
