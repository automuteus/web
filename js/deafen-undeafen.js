let isDeafened = false;
function toggleSound() {
  const deafenElem = document.getElementById("deafen");
  const undeafenElem = document.getElementById("undeafen");
  if (isDeafened) {
    // isDeafened so we will play undeafen
    undeafenElem.play();
  } else {
    //isDeafened is false so we will deafen
    deafenElem.play();
  }
  isDeafened = !isDeafened;
}
