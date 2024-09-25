class Gallery {
  #currentImageIndex;
  #images;
  #galleryRoot;
  #modal;

  constructor({ images, galleryRoot, modalRoot }) {
    this.#images = images;
    this.#currentImageIndex = null;

    this.#createGallery(galleryRoot);
    this.#modal = this.#createModal(modalRoot);
    this.#mountModal(galleryRoot);
  }

  #getCurrentImage() {
    if (this.#currentImageIndex === null) return null;
    return this.#images[this.#currentImageIndex] ?? null;
  }

  #createGallery(galleryRoot) {
    const imgs = this.#images.map(this.#createImage);

    galleryRoot.append(...imgs);
  }

  #createImage({ description, preview, original }, id) {
    const container = document.createElement("article");
    container.id = id;

    const img = document.createElement("img");
    img.src = preview;
    img.alt = description;

    const p = document.createElement("p");
    p.textContent = description;

    container.appendChild(img);
    container.appendChild(p);
    return container;
  }

  #createModal(modalRoot) {
    const onShow = this.#renderModal.bind(this);
    return basicLightbox.create(modalRoot, { onShow });
  }

  #renderModal(lightbox) {
    const currentImage = this.#getCurrentImage();
    if (currentImage === null) return lightbox.close();

    const modal = lightbox.element();

    const img = modal.querySelector("img");
    img.alt = currentImage.description;
    img.src = currentImage.original;

    modal.querySelector("p").textContent = currentImage.description;
    modal.querySelector("button").onclick = lightbox.close;
  }

  #mountModal(galleryRoot) {
    if (!this.#modal) return;

    galleryRoot.addEventListener("click", (event) => {
      if (
        event.target.tagName === "ARTICLE" ||
        event.target.parentNode.tagName === "ARTICLE"
      ) {
        this.#currentImageIndex = event.target.id || event.target.parentNode.id;
        this.#modal.show();
      }
    });

    document.addEventListener("keydown", () => {
      this.#modal.close();
    });
  }
}

const gallery = new Gallery({
  images,
  galleryRoot: document.querySelector("ul.gallery"),
  modalRoot: document.querySelector("template#modal"),
});
