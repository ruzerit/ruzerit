// ✅ 전역 변수 선언
let currentGalleryIndex = 0;  
let currentGallery2Index = 0; 
let galleryModal, galleryImage, gallery2Modal, gallery2Image, gallery2Filename, galleryContainer, galleryItems, gallery2Images;
let isDown = false;
let startX, startScrollLeft;
let scrollTimer;

document.addEventListener("DOMContentLoaded", function () {
    // ✅ 요소 가져오기 및 전역 변수에 할당
    galleryModal = document.getElementById("galleryModal");
    galleryImage = document.getElementById("galleryImage");
    gallery2Modal = document.getElementById("gallery2Modal");
    gallery2Image = document.getElementById("gallery2Image");
    gallery2Filename = document.getElementById("gallery2Filename");

    galleryContainer = document.querySelector(".gallery-container");
    galleryItems = document.querySelectorAll(".gallery-item img");
    gallery2Images = document.querySelectorAll(".gallery2-item img");

    const compCardBtn = document.getElementById("compCardBtn");
    const videoCheckBtn = document.getElementById("videoCheckBtn");

    if (compCardBtn) {
        compCardBtn.addEventListener("click", () => openModal("modalCompCard"));
    }
    if (videoCheckBtn) {
        videoCheckBtn.addEventListener("click", () => openModal("modalVideoCheck"));
    }

    // ✅ 갤러리1 이미지 클릭 이벤트
    galleryItems.forEach((img) => {
        img.addEventListener("click", function () {
            openGalleryModal(this);
        });
    });

    // ✅ 갤러리2 이미지 클릭 이벤트
    if (gallery2Images.length > 0) {
        gallery2Images.forEach((img, index) => {
            img.addEventListener("click", () => openGallery2Modal(index));
        });
    }

    if (galleryContainer) {
        galleryContainer.addEventListener("scroll", function () {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(updateCenterImage, 200);
        });
    }

    if (galleryContainer) {
        galleryContainer.addEventListener("mousedown", (e) => {
            isDown = true;
            startX = e.pageX - galleryContainer.offsetLeft;
            startScrollLeft = galleryContainer.scrollLeft;
        });

        galleryContainer.addEventListener("mouseleave", () => isDown = false);
        galleryContainer.addEventListener("mouseup", () => isDown = false);

        galleryContainer.addEventListener("mousemove", (e) => {
            if (!isDown) return;
            e.preventDefault();
            let x = e.pageX - galleryContainer.offsetLeft;
            let walk = (x - startX) * 2;
            galleryContainer.scrollLeft = startScrollLeft - walk;
        });
    }

    // ✅ 다크 모드 설정
    const darkModeToggle = document.getElementById("darkModeToggle");
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener("click", function () {
            document.body.classList.toggle("dark-mode");
            localStorage.setItem("darkMode", document.body.classList.contains("dark-mode") ? "enabled" : "disabled");
        });
    }

    // ✅ 모달 닫기 버튼(X) 및 ESC 키 닫기
    document.querySelectorAll(".modal").forEach((modal) => {
        modal.addEventListener("click", (event) => {
            if (event.target === modal) closeModal(modal.id);
        });
    });
            }
        });
    });

    document.addEventListener("keydown", (event) => {
        switch (event.key) {
            case "Escape":
                document.querySelectorAll(".modal").forEach(modal => closeModal(modal.id));
                break;
            case "ArrowRight":
                nextGalleryImage();
                break;
            case "ArrowLeft":
                prevGalleryImage();
                break;
        }
    });

// ✅ 모달 열기 함수 (전역)
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "flex";
        modal.style.visibility = "visible";
        modal.style.opacity = "1";
    }
}

// ✅ 모달 닫기 함수 (전역)
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.transition = "opacity 0.3s ease";
        modal.style.opacity = "0";
        modal.style.visibility = "hidden";
        setTimeout(() => { modal.style.display = "none"; }, 300);
        if (modalId === "modalVideoCheck" && modal.querySelector("video")) {
            modal.querySelector("video").pause();
        }
    }
}

// ✅ 중앙 정렬 유지 함수 (전역)
function updateCenterImage() {
    if (!galleryContainer || galleryItems.length === 0) return;

    let containerWidth = galleryContainer.clientWidth;
    let containerCenter = containerWidth / 2;
    let maxScrollLeft = galleryContainer.scrollWidth - containerWidth;
    let closestIndex = 0;
    let closestDistance = Infinity;

    galleryItems.forEach((item, index) => {
        let itemCenter = item.offsetLeft + item.offsetWidth / 2 - galleryContainer.offsetLeft;
        let distance = Math.abs(itemCenter - (galleryContainer.scrollLeft + containerCenter));

        if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
        }
    });

    let selectedItem = galleryItems[closestIndex];
    let targetScrollLeft = selectedItem.offsetLeft - containerCenter + selectedItem.offsetWidth / 2;

    if (closestIndex === 0) targetScrollLeft = 0;
    if (closestIndex === galleryItems.length - 1) targetScrollLeft = maxScrollLeft;

    galleryContainer.scrollTo({
        left: targetScrollLeft,
        behavior: "smooth"
    });

    galleryItems.forEach((item, index) => {
        item.classList.toggle("active", index === closestIndex);
    });
}

// ✅ 전역에서 정의 (어디서든 접근 가능)
function updateGalleryModal() {
    const images = document.querySelectorAll(".gallery-item img");
    if (galleryImage) {
        galleryImage.src = images[currentGalleryIndex].src;
    }
}

function prevGalleryImage() {
    if (currentGalleryIndex > 0) {
        currentGalleryIndex--;
        updateGalleryModal();
    }
}

function nextGalleryImage() {
    const images = document.querySelectorAll(".gallery-item img");
    if (currentGalleryIndex < images.length - 1) {
        currentGalleryIndex++;
        updateGalleryModal();
    }
}

// ✅ 갤러리2 모달 열기 함수 (전역)
function openGallery2Modal(index) {
    currentGallery2Index = index;
    updateGallery2Modal();
    openModal("gallery2Modal");
}

// ✅ 갤러리2 모달 업데이트 (전역)
function updateGallery2Modal() {
    if (!gallery2Image || !gallery2Filename) return;
    const imgEl = gallery2Images[currentGallery2Index];
    gallery2Image.src = imgEl.src;
    gallery2Filename.innerText = imgEl.parentElement.dataset.filename || "";
}

// ✅ 이전/다음 이미지 이동 (전역)
function prevGallery2Image() {
    if (currentGallery2Index > 0) {
        currentGallery2Index--;
        updateGallery2Modal();
    }
}

function nextGallery2Image() {
    if (currentGallery2Index < gallery2Images.length - 1) {
        currentGallery2Index++;
        updateGallery2Modal();
    }
}

