const container = document.createElement('div');
container.innerHTML = /*html*/ `
<div class="fixed bg-white flex flex-col z-50 top-0 left-0 cursor-move border-black border-2 p-4"></div>
`;
const monitor = container.children[0] as HTMLDivElement;

let offset = [0, 0];
let isDragging = false;

monitor.addEventListener('mousedown', function (e) {
  isDragging = true;
  offset = [monitor.offsetLeft - e.clientX, monitor.offsetTop - e.clientY];
});

document.addEventListener('mouseup', function () {
  isDragging = false;
});

document.addEventListener('mousemove', function (e) {
  e.preventDefault();
  window.requestAnimationFrame(() => {
    if (isDragging) {
      monitor.style.left = e.clientX + offset[0] + 'px';
      monitor.style.top = e.clientY + offset[1] + 'px';
    }
  });
});

let data = {};
export default function Monitor(d: Object = {}) {
  document.body.querySelector('#root')?.appendChild(monitor);
  setData(d);
}

export const setData = (d: Object) => {
  data = d;
  monitor.innerHTML = Object.entries(data)
    .map(
      ([k, v]: [any, any]) =>
        `<span>${k}: ${typeof v === 'object' ? Object.entries(v) : v}</span>`,
    )
    .join('');
};
