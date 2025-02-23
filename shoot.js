// Get references to the scene and camera elements.
var myScene = document.getElementById('myScene');
var myCamera = document.getElementById('myCamera');
// Define the next level to load upon completion.
let nextLevel = 'index.html';

/**
 * Calculates the direction vector based on the camera's rotation.
 *
 * This function takes the camera element and a speed value as input, and calculates
 * a direction vector representing the direction the camera is facing. The direction
 * vector is then scaled by the speed value.
 *
 * @param {HTMLElement} camera - The camera element in the A-Frame scene.  Must have a 'rotation' attribute.
 * @param {number} speed - The speed of movement, used to scale the direction vector.
 * @returns {object} - An object containing the x, y, and z components of the direction vector.
 *                   Example: `{ x: 0.5, y: 0, z: -0.866 }`
 */
function getDirection(camera, speed) {
    var y = camera.getAttribute('rotation').y + 90;
    var x = camera.getAttribute('rotation').x;

    var moveX = Math.cos(y / 360 * (Math.PI * 2));
    var moveY = Math.sin(x / 360 * (Math.PI * 2));
    var moveZ = Math.sin(y / 360 * (Math.PI * 2));
    var moveXRatio = (Math.pow(moveX, 2)) / (Math.pow(moveX, 2) + Math.pow(moveZ, 2));
    var moveZRatio = (Math.pow(moveZ, 2)) / (Math.pow(moveX, 2) + Math.pow(moveZ, 2));

    if (moveX <= 0) {
        moveX = -Math.sqrt((1 - Math.pow(moveY, 2)) * moveXRatio);
    } else {
        moveX = Math.sqrt((1 - Math.pow(moveY, 2)) * moveXRatio);
    }

    if (moveZ <= 0) {
        moveZ = -Math.sqrt((1 - Math.pow(moveY, 2)) * moveZRatio);
    } else {
        moveZ = Math.sqrt((1 - Math.pow(moveY, 2)) * moveZRatio);
    }

    return { x: moveX * speed, y: moveY * speed, z: -moveZ * speed };
}

/**
 * Creates and launches a bullet from the camera's position.
 *
 * This function creates an A-Frame sphere entity representing a bullet, sets its
 * initial position to the camera's position, assigns it a velocity based on the
 * camera's direction, and adds it to the scene.  It also attaches a collision
 * listener to the bullet.
 */
const shoot = () => {
  const bullet = document.createElement("a-sphere");
  let pos = myCamera.getAttribute("position");
  bullet.setAttribute("position", pos);
  bullet.setAttribute("velocity", getDirection(myCamera, 30));
  bullet.setAttribute("dynamic-body", true);
  bullet.setAttribute("radius", 0.5);
  bullet.setAttribute("src", "https://i.imgur.com/H8e3Vnu.png");
  myScene.appendChild(bullet);
  bullet.addEventListener('collide', shootCollided);
};

/**
 * Handles bullet collision events.
 *
 * This function is called when a bullet collides with another entity in the scene.
 * It checks if the bullet collided with the floor or a target. If it hits the floor,
 * the bullet is removed. If it hits a target, both the bullet and the target are
 * removed. If all targets are destroyed, the player is redirected to the next level.
 *
 * @param {object} event - The collision event object.  Contains `detail.body.el` which is the element the bullet collided with, and `detail.target.el` which is the bullet element.
 */
const shootCollided = event => {
    if (event.detail.body.el.id === 'floor') {
      console.log('Hit the floor');
      event.detail.target.el.removeEventListener('collide', shootCollided);
      myScene.removeChild(event.detail.target.el);
    } else if (event.detail.body.el.className === 'target') {
      console.log('Hit the target!');
      event.detail.target.el.removeEventListener('collide', shootCollided);
      myScene.removeChild(event.detail.target.el);
      myScene.removeChild(event.detail.body.el);
    }
    if (document.querySelectorAll('.target').length === 0) {
      console.log('You win!');
      location.href = nextLevel;
    }
  };

  /**
   * Event listener for spacebar key press to trigger shooting.
   *
   * This event listener is attached to the document and listens for the 'keydown' event.
   * When the spacebar key (key code 32) is pressed, the `shoot` function is called.
   *
   * @param {KeyboardEvent} event - The keyboard event object.
   */
  document.onkeydown = event => {
    if (event.which == 32) {
      shoot();
    }
};