document.querySelectorAll('.menu-item').forEach((item, index) => {
    item.addEventListener('click', () => {
      switch (index) {
        case 0:
          alert('Clássico: adivinhe o personagem!');
          break;
        case 1:
          alert('Respiração: adivinhe a respiração!');
          break;
        case 2:
          alert('Katana: adivinhe a katana!');
          break;
        case 3:
          alert('Olhos: adivinhe os olhos!');
          break;
        default:
          break;
      }
    });
  });