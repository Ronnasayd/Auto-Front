const universe = document.querySelector(".universe");
const random = (value) => {
  return Math.random() * value;
};
class Star {
  constructor(positionX = random(130), positionY = random(130)) {
    this.positionX = positionX;
    this.positionY = positionY;
    this.element = document.createElement("div");
    this.element.style.left = `${this.positionX}%`;
    this.element.style.top = `${this.positionY}%`;
    this.element.style.height = `${Math.max(1, random(3))}px`;
    this.element.style.animation = `tail ${Math.max(
      2,
      random(6)
    )}s ease-in-out infinite`;
    this.element.style.animationDelay = `${random(8)}s`;
    this.element.classList.add("star");
  }
}
// eslint-disable-next-line no-unused-vars
for (let i of Array(150).keys()) {
  const st = new Star();
  universe.appendChild(st.element);
}
