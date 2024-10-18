const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const upload = document.getElementById('upload');
let isDrawing = false;
let image = new Image();

// Set canvas size for mobile devices
canvas.width = window.innerWidth - 40;
canvas.height = canvas.width * 0.75; // Maintain aspect ratio

// Handle image upload
upload.addEventListener('change', (event) => {
  const reader = new FileReader();
  reader.onload = () => {
    image.src = reader.result;
  };
  reader.readAsDataURL(event.target.files[0]);
});

// Draw uploaded image on canvas
image.onload = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
};

// Drawing functionality (red lines)
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('touchstart', startDrawing);

canvas.addEventListener('mousemove', draw);
canvas.addEventListener('touchmove', draw);

canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('touchend', stopDrawing);

function startDrawing(event) {
  isDrawing = true;
  ctx.beginPath();
  ctx.moveTo(getX(event), getY(event));
  ctx.strokeStyle = 'red'; // Set line color to red
  ctx.lineWidth = 3;       // Set line thickness
}

function draw(event) {
  if (!isDrawing) return;
  ctx.lineTo(getX(event), getY(event));
  ctx.stroke();
}

function stopDrawing() {
  isDrawing = false;
}

function getX(event) {
  return (event.clientX || event.touches[0].clientX) - canvas.offsetLeft;
}

function getY(event) {
  return (event.clientY || event.touches[0].clientY) - canvas.offsetTop;
}

// Save Image functionality
document.getElementById('saveBtn').addEventListener('click', () => {
  const link = document.createElement('a');
  link.href = canvas.toDataURL();
  link.download = 'edited-image.png';
  link.click();
  document.getElementById('shareBtn').style.display = 'inline'; // Enable sharing
});

// Share Image functionality (via Web Share API)
document.getElementById('shareBtn').addEventListener('click', () => {
  canvas.toBlob(blob => {
    const file = new File([blob], 'edited-image.png', { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({
        files: [file],
        title: 'Edited Image',
        text: 'Check out this image I edited!',
      })
      .then(() => console.log('Image shared successfully!'))
      .catch(error => console.error('Error sharing image:', error));
    } else {
      alert('Sharing not supported on this device.');
    }
  });
});
