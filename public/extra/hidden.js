document.getElementById('login').addEventListener('click', function() {
    document.querySelector('.main-box').classList.add('active');
});
document.getElementById('register').addEventListener('click', function() {
    document.querySelector('.main-box').classList.remove('active');
    document.querySelector('.main-box').classList.remove('active-guest');
});
document.getElementById('guest').addEventListener('click', function() {
    document.querySelector('.main-box').classList.add('active-guest');
});