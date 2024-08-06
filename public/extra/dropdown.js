console.log("hello");
    document.querySelector('.dropdown-button').addEventListener('click', () =>{
        console.log("hello");
        const content = document.querySelector('.dropdown-content');
        
        if (content.style.display === "block") {
            content.style.display = "none";
            content.style.maxHeight = null;
        } else {
            content.style.display = "block";
            content.style.maxHeight = content.scrollHeight + 'px';
        }
    });