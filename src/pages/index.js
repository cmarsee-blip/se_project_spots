import "./index.css";
import {
  enableValidation,
  settings,
  resetValidation,
  disableBtn,
} from "../scripts/validation.js";
import { renderLoading, handleSubmit } from "../utils/helpers.js";
import Api from "../utils/Api.js";

let openedModal;
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__avatar");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "dfa59993-3d44-49c4-9b4f-f8660fe46921",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, userData]) => {
    setUserData(userData);
    cards.forEach(function (item) {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });
  })
  .catch(console.error);

function setUserData(data) {
  profileName.textContent = data.name;
  profileDescription.textContent = data.about;
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
const editModalInputs = document.querySelector("#edit-profile-modal");
const editInputs = [...editModalInputs.querySelectorAll(".modal__input")];

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

function handleLike(evt, card) {
  const isLiked = card.isLiked;
  api
    .changeLikeStatus(card._id, isLiked)
    .then(() => {
      evt.target.classList.toggle("card__like-btn_active");
    })
    .catch(console.error);
}

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  const cardLikeBtnEl = cardElement.querySelector(".card__like-btn");
  cardLikeBtnEl.addEventListener("click", (evt) => handleLike(evt, data));
  if (data.isLiked) {
    cardLikeBtnEl.classList.add("card__like-btn_active");
  }

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
  // console.log("Opening modal:", modal.classList);
  // const form = modal.querySelector(".modal__form");
  // if (form) {
  //   console.log("Form found, resetting validation");
  //   resetValidation(form, editInputs, settings);
  // } else {
  //   console.log("No form found in this modal");
  // }

  // remove else statement after running test

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

const deleteSubmitBtn = deleteModalElement.querySelector(
  ".modal__submit-btn_type_delete",
);

const deleteCancelBtn = deleteModalElement.querySelector(
  ".modal__submit-btn_type_cancel",
);
deleteCancelBtn.addEventListener("click", () => {
  closeModal(deleteModalElement);
  selectedCard = null;
  selectedCardId = null;
});

avatarModalCloseBtn.addEventListener("click", function () {
  closeModal(avatarModal);
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();

  // function makeRequest() {
  //   return editProfileBtn(nameInput.value, jobInput.value).then((userData) => {
  //     userName.textContent = userData.name;
  //     userJob.textContent = userData.about;
  //   });
  // }

  // handleSubmit(makeRequest, evt);

  const cardSubmitBtn = evt.submitter;
  renderLoading(true, cardSubmitBtn, "Delete", "Deleting");

  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((data) => {
      profileNameEl.textContent = data.name;
      profileDescriptionEl.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      renderLoading(true, cardSubmitBtn, "Save");
      cardSubmitBtn.textContent = "Save";
    });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  console.log(avatarInputEl.value);
  api
    .setUserAvatar({
      avatar: avatarUrl,
    })
    .then((data) => {
      profileImage.src = userData.avatar;
    })
    .catch(console.error);
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  renderLoading(true, deleteSubmitBtn, "Deleting...");
  api
    .removeCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModalElement);
    })
    .catch(console.error)
    .finally(() => {
      renderLoading(false, deleteSubmitBtn, "Yes");
    });
}

previewModalCloseBtn.addEventListener("click", function () {
  closeModal(previewModal);
});

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

function handleNewPostSubmit(evt) {
  evt.preventDefault();
  api
    .addCard({ name: captionInputEl.value, link: linkInputEl.value })
    .then((newCardData) => {
      const cardElement = getCardElement({
        name: captionInputEl.value,
        link: linkInputEl.value,
      });

      cardsList.prepend(cardElement);
      evt.target.reset();
      disableBtn(cardSubmitBtn, settings);
      closeModal(newPostModal);
    })
    .catch(console.error);
}

addCardFormEl.addEventListener("submit", handleNewPostSubmit);

const cardElement = getCardElement({
  name: captionInputEl.value,
  link: linkInputEl.value,
});

enableValidation(settings);
