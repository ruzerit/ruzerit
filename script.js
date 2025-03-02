// ✅ 전역 변수 선언
let currentGalleryIndex = 0;  
let currentGallery2Index = 0; 
let galleryModal, galleryImage, gallery2Modal, gallery2Image, gallery2Filename, galleryContainer, galleryItems, gallery2Images;
let isDown = false;
let startX, startScrollLeft;

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

    // ✅ 갤러리1 이미지 클릭 이벤트 (모달 열기)
    galleryItems.forEach((img) => {
        img.addEventListener("click", function () {
            openGalleryModal(this);
        });
    });

    // ✅ 갤러리2 이미지 클릭 이벤트
    gallery2Images.forEach((img, index) => {
        img.addEventListener("click", () => openGallery2Modal(index));
    });

    // ✅ 중앙 정렬 유지
    function updateCenterImage() {
        if (!galleryContainer) return; // galleryContainer가 null이면 실행하지 않음.

        let containerCenter = galleryContainer.clientWidth / 2;
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

        galleryItems.forEach((item, index) => {
            item.classList.toggle("active", index === closestIndex);
        });

        let selectedItem = galleryItems[closestIndex];
        galleryContainer.scrollTo({
            left: selectedItem.offsetLeft - containerCenter + selectedItem.offsetWidth / 2,
            behavior: "smooth"
        });
    }

    if (galleryContainer) {
        galleryContainer.addEventListener("scroll", function () {
            clearTimeout(window.scrollTimer);
            window.scrollTimer = setTimeout(updateCenterImage, 100);
        });
    }

    // ✅ 스크롤 시 갤러리2 이미지 등장 애니메이션
    function revealGallery2Items() {
        document.querySelectorAll(".gallery2-item").forEach(item => {
            const rect = item.getBoundingClientRect();
            if (rect.top < window.innerHeight - 50) {
                item.classList.add("visible");
            }
        });
    }
    
    window.addEventListener("scroll", revealGallery2Items);
    revealGallery2Items();

    // ✅ 모달 닫기 버튼(X) 이벤트 공통 처리
    document.querySelectorAll(".modal .close").forEach((btn) => {
        btn.addEventListener("click", () => {
            const modal = btn.closest(".modal");
            if (modal) closeModal(modal.id);
        });
    });

    // ✅ ESC 키 또는 배경 클릭 시 모달 닫기
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            document.querySelectorAll(".modal").forEach(modal => closeModal(modal.id));
        } else if (event.key === "ArrowRight") {
            if (galleryModal.style.display !== "none") nextGalleryImage();
            if (gallery2Modal.style.display !== "none") nextGallery2Image();
        } else if (event.key === "ArrowLeft") {
            if (galleryModal.style.display !== "none") prevGalleryImage();
            if (gallery2Modal.style.display !== "none") prevGallery2Image();
        }
    });

    document.querySelectorAll(".modal").forEach((modal) => {
        modal.addEventListener("click", (event) => {
            if (!event.target.closest(".modal-content")) {
                closeModal(modal.id);
            }
        });
    });

    // ✅ 드래그 스크롤 기능
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
});

// ✅ 모달 열기 함수
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "flex";
        modal.style.visibility = "visible";
        modal.style.opacity = "1";
    }
}

// ✅ 모달 닫기 함수
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

// ✅ 갤러리1 모달 이미지 슬라이드
function openGalleryModal(imgElement) {
    const images = document.querySelectorAll(".gallery-item img");
    currentGalleryIndex = Array.from(images).indexOf(imgElement);
    if (galleryImage) {
        galleryImage.src = imgElement.src;
        openModal("galleryModal");
    }
}

function updateGalleryModal() {
    const images = document.querySelectorAll(".gallery-item img");
    galleryImage.src = images[currentGalleryIndex].src;
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

// ✅ 갤러리2 모달 내비게이션
function updateGallery2Modal() {
    const imgEl = gallery2Images[currentGallery2Index];
    gallery2Image.src = imgEl.src;
    gallery2Filename.innerText = imgEl.parentElement.dataset.filename || "";
}