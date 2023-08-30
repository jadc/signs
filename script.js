function createBox(value = null){
    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("inputmode", "numeric");
    input.setAttribute("pattern", "[0-9]*");
    input.setAttribute("maxlength", 9)
    input.addEventListener("input", boxHandler);
    if(value) input.value = value;
    return input;
}

function boxHandler(e){
    const box = e.target;

    // Write to localStorage
    let memory = [];
    const category = box.parentElement.parentElement.id;
    const boxes = box.parentElement.children;
    for(let box of boxes) {
        if(box.value) memory.push(box.value);
    }
    localStorage.setItem(category, memory);

    // Spawn new box if needed
    if(!box.nextElementSibling && box.value){
        box.parentElement.appendChild(createBox());
    }
}

function readStorage(){
    const categories = document.querySelectorAll("section");
    categories.forEach(c => {
        let memory = localStorage.getItem(c.id);
        if(!memory) memory = "";
        for(let sign of memory.split(",")){
            c.lastElementChild.appendChild(createBox(sign))
        }
    });
}

function clearBoxes(){
    // Clear localStorage
    const categories = document.querySelectorAll("section");
    categories.forEach(c => {
        localStorage.setItem(c.id, [""]);
        c.lastElementChild.textContent = "";
    });

    // Recreate boxes
    readStorage();
}

function cacheForOffline(){
    // Service worker registration
    if("serviceWorker" in navigator) {
        window.addEventListener("load", function() {
            navigator.serviceWorker.register("worker.js")
                .then(registration => {
                    console.log("Service worker registered, scope:", registration.scope);
                })
                .catch(err => {
                    console.log("Service worker failed:", err);
                });
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const boxes = document.querySelectorAll("input");

    // Text boxes can spawn new boxes when used
    boxes.forEach(box => {
        box.addEventListener("input", boxHandler);
    });

    // Read localStorage
    readStorage();

    // Clear button
    document.querySelector("#clear-btn").addEventListener("click", () => {
        if( window.confirm("Are you sure you want to clear your history?") ){
            clearBoxes();
        }
    })

    cacheForOffline();
});
