window.addEventListener('load', () => {
	let droppers = document.querySelectorAll('.dropper');
	let draggables = document.querySelectorAll('.draggable');

	let init_draggable = draggable => {
		draggable.addEventListener('dragstart', e => {
			let element = e.target;
			let href = element.nodeName.toLowerCase() === 'a' ? element.getAttribute('href') : null;
			if(!element.getAttribute('id')) {
				let sentence = 'abcdefghijklmnopqrstuvwxyz0123456789';
				element.setAttribute('id', `id_random_${element.nodeName.toLowerCase()}_${sentence.charCodeAt(Math.floor(Math.random() * Math.floor(sentence.length - 1)))}`);
			}
			e.dataTransfer.setData('content', JSON.stringify({
				tag: element.nodeName.toLowerCase(),
				innerHTML: element.innerHTML,
				id: element.getAttribute('id'),
				classList: element.classList,
				href: href
			}));
		});
	};

	let init_dropper = dropper => {
		let dropper_content = dropper.innerHTML;
		dropper.innerHTML = `<div class="dropper_init">${dropper_content}</div>`;

		dropper.addEventListener('dragover', e => {
			e.preventDefault(); // Annule l'interdiction de "drop"
		}, false);

		dropper.addEventListener('drop', e => {
			e.preventDefault(); // Cette méthode est toujours nécessaire pour éviter une éventuelle redirection inattendue

			dropper.style.borderStyle = 'solid';
			let tag_object = JSON.parse(e.dataTransfer.getData('content'));
			let classList = [];
			for(let i in tag_object.classList) {
				if(tag_object.classList[i] !== 'draggable') {
					classList.push(tag_object.classList[i]);
				}
			}
			document.querySelectorAll(`#${tag_object.id} + br`).forEach(br_tag => {
				br_tag.remove();
			});
			document.querySelector(`#${tag_object.id}`).remove();
			let element = e.target;
			let lastChild = element.classList.contains('dropper') ? element.lastChild : element.parentNode.lastChild;
			if(lastChild.nodeName.toLowerCase() === 'div' && lastChild.classList.contains('dropper_init')) {
				if (lastChild.style.display !== 'none') {
					lastChild.style.display = 'none';
				}
			}
			dropper.innerHTML += `${tag_object.tag !== 'div'
			&& lastChild.nodeName.toLowerCase() !== 'br'
			&& lastChild.nodeName.toLowerCase() !== 'div' ? '<br>' : ''}<${tag_object.tag} ${classList.length ? `class="${classList.join(' ')}"` : ''} ${tag_object.tag === 'a' ? `href="${tag_object.href}" target="_blank"` : ''}>${tag_object.innerHTML}</${tag_object.tag}>`;
			console.log(tag_object);
		}, false);

		dropper.addEventListener('dragenter', () => {
			dropper.style.borderStyle = 'dashed';
		}, false);

		dropper.addEventListener('dragleave', () => {
			dropper.style.borderStyle = 'solid';
		}, false);
	};

	draggables.forEach(init_draggable);
	droppers.forEach(init_dropper);

});