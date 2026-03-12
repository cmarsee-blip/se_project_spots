import "./index.css";
import {
  enableValidation,
  settings,
  resetValidation,
  disableBtn,
} from "../scripts/validation.js";
import { setBtnText } from "../utils/helpers.js";
import Api from "../utils/Api.js";

let openedModal;
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__avatar");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
// const initialCards = [
//   {
//     name: "Golden Gate Bridge",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
//   },
//   {
//     name: "Val Thorens",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
//   {
//     name: "Restaurant terrace",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
//   },
//   {
//     name: "An outdoor cafe",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
//   },
//   {
//     name: "A very long bridge, over the forest and through the trees",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
//   },
//   {
//     name: "Tunnel with morning light",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
//   },
//   {
//     name: "Mountain house",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
// ];

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "dfa59993-3d44-49c4-9b4f-f8660fe46921",
    "Content-Type": "application/json",
  },
});

// Destructure the second item in the callback of the .then()
api
  .getAppInfo()
  .then(([cards, userData]) => {
    setUserData(userData);
    cards.forEach(function (item) {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });

    // Handle the user's information
    // - set the src of the avatar image
    // - set the textContent of both the Text elements
  })
  .catch(console.error);

function setUserData(data) {
  profileName.textContent = data.name;
  profileDescription.textContent = data.description;
  profileAvatar.src = data.avatar;
}

// Edit form elements
const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input",
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input",
);

// Card form elements
const newPostBtn = document.querySelector(".profile__new-post-btn");
const newPostModal = document.querySelector("#new-post-modal");
const cardSubmitBtn = newPostModal.querySelector(".modal__submit-btn");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const addCardFormEl = newPostModal.querySelector(".modal__form");
const captionInputEl = newPostModal.querySelector("#card-caption-input");
const linkInputEl = newPostModal.querySelector("#card-image-input");

// Avatar form elements
const avatarModal = document.querySelector("#avatar-modal");
const avatarFormEl = avatarModal.querySelector(".modal__form");
const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-btn");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarInputEl = avatarModal.querySelector("#profile-avatar-input");

// Delete form elements
const deleteModalElement = document.querySelector("#delete-modal");
const deleteForm = deleteModalElement.querySelector(".modal__form");

// Preview image popup elements
const previewModal = document.querySelector("#preview-modal");
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn");
const previewImageEl = previewModal.querySelector(".modal__image");
const previewCaptionEl = previewModal.querySelector(".modal__caption");

// Card related elements
const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");

const cardsList = document.querySelector(".cards__list");

let selectedCard, selectedCardId;

function deleteModal(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModalElement);
}

function handleLike(evt, cardId) {
  const isLiked = evt.target.classList.toggle("card__like-btn_active");
  api
    .changeLikeStatus(data._id, isLiked)
    .then(() => {
      evt.target.classList.toggle("card__like-btn_active");
    })
    .catch(console.error);
  // 1. check whether card is currently liked or not
  //      const isLiked = ???;
  // 2. call the changLikeStatus method, passing it the appropriate arguments
  // 3. handle the response (.then and .catch)
  // 4. in the .then, toggle active class
}

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");

  // TODO - if the card is liked, set the active class on the card

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  const cardLikeBtnEl = cardElement.querySelector(".card__like-btn");
  cardLikeBtnEl.addEventListener("click", (evt) => handleLike(evt, data._id));

  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-btn");

  cardDeleteBtnEl.addEventListener("click", (evt) =>
    deleteModal(cardElement, data._id, evt),
  );

  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewCaptionEl.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");

function handleEscape(evt) {
  if (evt.key === "Escape") {
    closeModal(openedModal);
  }
}

function handleOverlayClick(evt) {
  if (evt.target.classList && evt.target.classList.contains("modal")) {
    closeModal(openedModal);
  }
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  openedModal = modal;

  document.addEventListener("keydown", handleEscape);
  modal.addEventListener("click", handleOverlayClick);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  openedModal = null;

  document.removeEventListener("keydown", handleEscape);
  modal.removeEventListener("click", handleOverlayClick);
}

editProfileBtn.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  resetValidation(
    editProfileForm,
    [editProfileNameInput, editProfileDescriptionInput],
    settings,
  );
  openModal(editProfileModal);
});

editProfileCloseBtn.addEventListener("click", function () {
  closeModal(editProfileModal);
});

newPostBtn.addEventListener("click", function () {
  openModal(newPostModal);
});

newPostCloseBtn.addEventListener("click", function () {
  closeModal(newPostModal);
});

avatarModalBtn.addEventListener("click", function () {
  openModal(avatarModal);
});

avatarFormEl.addEventListener("submit", handleAvatarSubmit);

deleteForm.addEventListener("submit", handleDeleteSubmit);

avatarModalCloseBtn.addEventListener("click", function () {
  closeModal(avatarModal);
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();

  // Change text content to "Saving..."
  const cardSubmitBtn = evt.submitter;
  // cardSubmitBtn.textContent = "Saving...";
  setBtnText(cardSubmitBtn, true);

  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((data) => {
      // TODO - Use data argument instead of the input values
      profileNameEl.textContent = data.name;
      profileDescriptionEl.textContent = data.description;
      // profileNameEl.textContent = editProfileNameInput.value;
      // profileDescriptionEl.textContent = editProfileDescriptionInput.value;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      // Call setBtnText instead
      cardSubmitBtn.textContent = "Save";
      // Change text content back to "Save"
    });
}

// TODO - implement loading text for all other form submissions

// TODO - Finish avatar submission handler
function handleAvatarSubmit(evt) {
  evt.preventDefault();
  console.log(avatarInputEl.value);
  api
    .setUserAvatar({
      avatar: avatarInputEl.value,
    })
    .then((data) => {
      avatarInputEl = data.avatar;
    })
    .catch(console.error);
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  api
    .removeCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModalElement);
    })
    .catch(console.error);
}

previewModalCloseBtn.addEventListener("click", function () {
  closeModal(previewModal);
});

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

function handleNewPostSubmit(evt) {
  evt.preventDefault();

  const cardElement = getCardElement({
    name: captionInputEl.value,
    link: linkInputEl.value,
  });

  cardsList.prepend(cardElement);
  evt.target.reset();
  disableBtn(cardSubmitBtn, settings);
  closeModal(newPostModal);
}

addCardFormEl.addEventListener("submit", handleNewPostSubmit);

const cardElement = getCardElement({
  name: captionInputEl.value,
  link: linkInputEl.value,
});

enableValidation(settings);
