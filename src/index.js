let addToy = false;

document.addEventListener('DOMContentLoaded', () => {
   const addBtn = document.querySelector('#new-toy-btn');
   const toyFormContainer = document.querySelector('.container');
   const toyCollection = document.getElementById('toy-collection');
   const BASE_URL = 'http://localhost:3000';
   const toyForm = document.querySelector('.add-toy-form');

   const renderToy = (toyObj) => {
      const toyCard = document.createElement('div');
      const toyName = document.createElement('h2');
      const toyImg = document.createElement('img');
      const toyLikes = document.createElement('p');
      const toyBtn = document.createElement('button');

      toyCard.className = 'card';
      toyName.textContent = toyObj.name;
      toyImg.src = toyObj.image;
      toyImg.alt = `a pic of a toy named ${toyObj.name}`;
      toyImg.className = 'toy-avatar';
      toyLikes.textContent = `${toyObj.likes} likes`;
      toyBtn.className = 'like-btn';
      toyBtn.id = `${toyObj.id}`;
      toyBtn.textContent = 'Like';
      toyCard.append(toyName, toyImg, toyLikes, toyBtn);
      toyCollection.appendChild(toyCard);
   };

   const getToys = async () => {
      try {
         const response = await fetch(`${BASE_URL}/toys`);
         if (response.ok) {
            const returnedToysArr = await response.json();
            returnedToysArr.forEach((toyObj) => renderToy(toyObj));
         } else {
            throw new Error(
               `Uh oh.. ${response.status}: ${response.statusText}`
            );
         }
      } catch (err) {
         alert(err);
      }
   };

   addBtn.addEventListener('click', () => {
      // hide & seek with the form
      addToy = !addToy;
      if (addToy) {
         toyFormContainer.style.display = 'block';
      } else {
         toyFormContainer.style.display = 'none';
      }
   });

   toyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newToy = Object.fromEntries(new FormData(e.target).entries());
      newToy.likes = 0;

      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      const raw = JSON.stringify({
         name: `${newToy.name}`,
         image: `${newToy.image}`,
         likes: `${newToy.likes}`,
      });

      const requestOptions = {
         method: 'POST',
         headers: myHeaders,
         body: raw,
      };

      const postToy = async () => {
         try {
            const response = await fetch(`${BASE_URL}/toys`, requestOptions);
            if (response.ok) {
               const returnedToy = await response.json();
               renderToy(newToy);
               alert(`${newToy.name} was created!`);
            } else {
               throw new Error(
                  `Uh oh.. ${response.status} ${response.statusText}`
               );
            }
         } catch (err) {
            alert(err);
         }
      };

      postToy(newToy);
      toyForm.reset();
   });

   getToys();
});
