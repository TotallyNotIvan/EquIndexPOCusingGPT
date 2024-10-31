const contentArea = document.getElementById('contentArea');
const currentFolder = document.getElementById('currentFolder');

// Dummy folder and file data
const data = {
  Home: [
    { type: 'folder', name: 'Documents' },
    { type: 'folder', name: 'Photos' },
    { type: 'folder', name: 'Music' },
  ],
  Documents: [
    { type: 'file', name: 'Resume.docx' },
    { type: 'file', name: 'Report.pdf' },
  ],
  Photos: [
    { type: 'file', name: 'Vacation.jpg' },
    { type: 'file', name: 'Family.png' },
  ],
  Music: [
    { type: 'file', name: 'Song.mp3' },
    { type: 'file', name: 'Album.flac' },
  ],
};

// Function to load folder content
function openFolder(folderName) {
  currentFolder.innerText = folderName;
  contentArea.innerHTML = '';

  const folderContent = data[folderName];

  folderContent.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item');

    const icon = document.createElement('div');
    icon.classList.add(item.type === 'folder' ? 'folder-icon' : 'file-icon');
    icon.innerHTML = item.type === 'folder' ? '📁' : '📄';
    
    const name = document.createElement('div');
    name.classList.add('file-name');
    name.innerText = item.name;

    itemDiv.appendChild(icon);
    itemDiv.appendChild(name);

    if (item.type === 'folder') {
      itemDiv.onclick = () => openFolder(item.name);
    }

    contentArea.appendChild(itemDiv);
  });
}

// Load the home folder by default
openFolder('Home');
