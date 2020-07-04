export const PANO_ID_REG = /^[0-9]{25}[0-9A-Z]{2}$/
export const PANO_ID_REG_G = /[0-9]{25}[0-9A-Z]{2}/g

export const LEVEL_OFFSETS = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
  0.01024,  // 13
  0.00512,  // 14
  0.00256,  // 15
  0.00128,  // 16
  0.00064,  // 17
  0.00032,  // 18
  0.00016,  // 19
]

export const GET_PANO_ID_CODE = 
`;(function(){
  let monitor = document.createElement('textarea');
  document.body.appendChild(monitor);

  monitor.value = 'Ready, click the direction-guide-button now, double click to copy the value.';
  monitor.style = 
    \`position: fixed; z-index: 999999; top: 80px; left: 20px;
    width: 210px; height: 320px; padding: 4px; overflow-y: auto;
    font-family: monospace, consolas; font-size: 12px; text-align: center;
    color: #3ddc84; background: #0a1d1a; border: 1px solid #0a1d1a; border-radius: 4px;\`;

  monitor.onclick = (event) => {event.stopPropagation();}
  monitor.ondblclick = (event) => {
    monitor.select();
    document.execCommand('Copy');
    alert('Copied')
  }

  let idList = [];
  window.onclick = () => {
    const match = location.href.match(/^[0-9]{25}[0-9A-Z]{2}$/);
    const id = match ? match[0] : '';
    const can = id && !idList.includes(id);
    if (can) idList.unshift(id);

    monitor.value = idList.join(',\\n') + ',';
  }
}());`
