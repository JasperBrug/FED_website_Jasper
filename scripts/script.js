const hamburgerIcon = document.querySelector('header nav:nth-of-type(2) button')
const menu = document.getElementById('menuList');
 
function hamburger() {
    menu.classList.toggle('active');
 
    if (menu.classList.contains('active')) {
        hamburgerIcon.src = './images/random-icons/close.svg';
    } else {
        hamburgerIcon.src = './images/random-icons/hamburger.svg';
    }
}

 
hamburgerIcon.addEventListener("click", hamburger);


/* Met behulp van de studenten-assistent gemaakt*/