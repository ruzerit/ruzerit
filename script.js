// ✅ 전역 변수 선언
let currentGalleryIndex = 0;  // 갤러리1 현재 이미지 인덱스 (추가)
let currentGallery2Index = 0; // 갤러리2 현재 이미지 인덱스
document.addEventListener("DOMContentLoaded", function () {
    // ✅ 요소 가져오기
    const galleryContainer = document.querySelector(".gallery-container");
    const galleryItems = document.querySelectorAll(".gallery-item");
    let isDown = false;
    let startX, startScrollLeft;

    const compCardBtn   = document.getElementById("compCardBtn");
    const videoCheckBtn = document.getElementById("videoCheckBtn");
    const videoModal = document.getElementById("modalVideoCheck");
    const compCardModal = document.getElementById("modalCompCard");
    const galleryModal = document.getElementById("galleryModal");
    const galleryImage = document.getElementById("galleryImage");
    const videoElement = document.querySelector("#modalVideoCheck video");
    const gallery2Modal = document.getElementById("gallery2Modal");
    const gallery2Image = document.getElementById("gallery2Image");
    const gallery2Filename = document.getElementById("gallery2Filename");
    const gallery2Container = document.querySelector(".gallery2-container");

    compCardBtn.addEventListener("click", () => openModal("modalCompCard"));
    videoCheckBtn.addEventListener("click", () => openModal("modalVideoCheck"));

    // 갤러리1 이미지 클릭 이벤트 (모든 .gallery-item img에 핸들러 등록)
    document.querySelectorAll(".gallery-item img").forEach((img) => {
        img.addEventListener("click", () => openGalleryModal(img));
    });

    // ✅ 중앙 정렬 유지
    function updateCenterImage() {
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

    // 갤러리2 이미지 클릭 이벤트
    function openGallery2Modal(index) {
        currentGallery2Index = index;
        updateGallery2Modal();
        openModal("gallery2Modal");
    } 
    
    let gallery2Images = document.querySelectorAll(".gallery2-item img");
    document.querySelectorAll(".gallery2-item img").forEach((img, index) => {
        img.addEventListener("click", () => openGallery2Modal(index));
    });

    // ✅ 갤러리2 초기 표시 설정
    if (gallery2Container) {
        gallery2Container.style.visibility = "visible";
        gallery2Container.style.opacity = "1";
    }

    // ✅ 이전 / 다음 이미지 보기
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

    function updateGallery2Modal() {
        let imgElement = gallery2Images[currentGallery2Index];
        let filename = imgElement.parentElement.dataset.filename;

        gallery2Image.src = imgElement.src;
        gallery2Filename.innerText = filename;
    }


    // ✅ 스크롤 시 갤러리2 이미지 등장 애니메이션
    document.addEventListener("scroll", function () {
        let gallery2Items = document.querySelectorAll(".gallery2-item");
        gallery2Items.forEach(item => {
            let rect = item.getBoundingClientRect();
            if (rect.top < window.innerHeight - 50) {
                item.classList.add("visible");
            }
        });
    });
});

    // 4. 모달 닫기 버튼(X) 이벤트 공통 처리 (.close 클래스 대상으로)
    document.querySelectorAll(".modal .close").forEach((btn) => {
        btn.addEventListener("click", () => {
            const modal = btn.closest(".modal");
            if (modal) closeModal(modal.id);
        });
    });

    // 5. 갤러리 모달 내비게이션 버튼 이벤트 연결
    const prevBtn1 = document.querySelector("#galleryModal .prev");
    const nextBtn1 = document.querySelector("#galleryModal .next");
    if (prevBtn1) prevBtn1.addEventListener("click", prevGalleryImage);
    if (nextBtn1) nextBtn1.addEventListener("click", nextGalleryImage);
    const prevBtn2 = document.querySelector("#gallery2Modal .prev");
    const nextBtn2 = document.querySelector("#gallery2Modal .next");
    if (prevBtn2) prevBtn2.addEventListener("click", prevGallery2Image);
    if (nextBtn2) nextBtn2.addEventListener("click", nextGallery2Image);

    // 6. ESC 키 또는 배경 클릭 시 모달 닫기 (기존과 동일)
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            // 열린 모든 모달 닫기
            document.querySelectorAll(".modal").forEach(modal => closeModal(modal.id));
        } else if (event.key === "ArrowRight") {
            // 오른쪽 화살표 -> 다음 이미지
            if (galleryModal.style.display !== "none") nextGalleryImage();
            if (gallery2Modal.style.display !== "none") nextGallery2Image();
        } else if (event.key === "ArrowLeft") {
            // 왼쪽 화살표 -> 이전 이미지
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
});

// 7. 모달 열기/닫기 함수 (중복 제거 및 일관성 유지)
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        // 모달 표시: CSS 클래스 토글 또는 스타일 변경
        modal.style.display = "flex";
        modal.style.visibility = "visible";
        modal.style.opacity = "1";
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.transition = "opacity 0.3s ease";
        modal.style.opacity = "0";
        modal.style.visibility = "hidden";
        setTimeout(() => { modal.style.display = "none"; }, 300);
        // 동영상 모달인 경우 재생 일시정지하여 뒷소리 제거
        if (modalId === "modalVideoCheck" && modal.querySelector("video")) {
            modal.querySelector("video").pause();
        }
    }
}

// 8. 갤러리1 모달 열기 및 이미지 슬라이드 함수 추가
function openGalleryModal(imgElement) {
    const images = document.querySelectorAll(".gallery-item img");
    currentGalleryIndex = Array.from(images).indexOf(imgElement);  // 현재 이미지 인덱스 기록
    if (galleryImage && imgElement) {
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

// 9. 갤러리2 모달 내비게이션 (기존 함수 재사용, 이벤트 핸들러는 위에서 등록)
function updateGallery2Modal() {
    const imgEl = document.querySelectorAll(".gallery2-item img")[currentGallery2Index];
    const filename = imgEl.parentElement.dataset.filename || "";
    document.getElementById("gallery2Image").src = imgEl.src;
    document.getElementById("gallery2Filename").innerText = filename;
}
function prevGallery2Image() {
    if (currentGallery2Index > 0) {
        currentGallery2Index--;
        updateGallery2Modal();
    }
}
function nextGallery2Image() {
    const total = document.querySelectorAll(".gallery2-item img").length;
    if (currentGallery2Index < total - 1) {
        currentGallery2Index++;
        updateGallery2Modal();
    }
}

    // ✅ 다크 모드 설정
    const darkModeToggle = document.getElementById("darkModeToggle");
    const body = document.body;

    if (localStorage.getItem("darkMode") === "enabled") {
        body.classList.add("dark-mode");
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener("click", function () {
            body.classList.toggle("dark-mode");
            localStorage.setItem("darkMode", body.classList.contains("dark-mode") ? "enabled" : "disabled");
        });
    }