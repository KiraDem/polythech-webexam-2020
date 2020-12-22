function showMsg (msg, category='success'){
    let msgContainer = document.querySelector('.messages');
    msgElement = document.createElement('div');
    msgElement.innerHTML = msg;
    msgElement.classList.add('msg');
    msgElement.classList.add(Category);
    msgContainer.append(msgElement);
}